import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { StyleSheet, Text } from 'react-native';

import {
  Button,
  CidadaoOnly,
  EmptyState,
  ErrorMessage,
  FormSection,
  Input,
  Loading,
  Screen,
  SelectableList,
  UnidadeSelector,
} from '@/components';
import { useApiRequest } from '@/hooks/useApiRequest';
import { catalogoService } from '@/services/catalogoService';
import { filaService } from '@/services/filaService';
import { typography } from '@/theme';
import type { EspecialidadeResponse } from '@/types/api';
import { getErrorMessage } from '@/utils/apiError';
import { normalizeSearch } from '@/utils/text';

export default function NovaSolicitacaoScreen() {
  return (
    <CidadaoOnly>
      <NovaSolicitacao />
    </CidadaoOnly>
  );
}

function NovaSolicitacao() {
  const [especialidade, setEspecialidade] = useState<EspecialidadeResponse | null>(null);
  const [idUnidade, setIdUnidade] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  function escolherEspecialidade(escolhida: EspecialidadeResponse | null) {
    setEspecialidade(escolhida);
    setIdUnidade(null);
    setSubmitError(null);
  }

  function escolherUnidade(id: number) {
    setIdUnidade(id);
    setSubmitError(null);
  }

  async function confirmar() {
    if (!especialidade || !idUnidade) return;
    setSubmitting(true);
    setSubmitError(null);
    try {
      await filaService.criar({ idEspecialidade: especialidade.id, idUnidade });
      router.dismissTo({ pathname: '/filas', params: { sucesso: 'criada' } });
    } catch (error) {
      // 409 (já existe pedido aguardando) e 422 chegam com a mensagem da API.
      setSubmitError(getErrorMessage(error));
      setSubmitting(false);
    }
  }

  return (
    <Screen scroll edges={['bottom', 'left', 'right']}>
      <Text style={styles.intro}>
        Escolha a especialidade e a unidade de saúde. Você entra na fila e acompanha sua posição na
        aba Solicitações.
      </Text>

      <FormSection title="1. Especialidade">
        {especialidade ? (
          <>
            <Text style={styles.escolha}>{especialidade.nome}</Text>
            <Button
              title="Trocar especialidade"
              variant="secondary"
              icon="swap-horizontal"
              onPress={() => escolherEspecialidade(null)}
              accessibilityLabel={`Trocar especialidade. Escolhida: ${especialidade.nome}`}
            />
          </>
        ) : (
          <EspecialidadePicker onSelect={escolherEspecialidade} />
        )}
      </FormSection>

      {especialidade && (
        <FormSection title="2. Unidade de saúde">
          <Text style={styles.hint}>Unidades com atendimento em {especialidade.nome}:</Text>
          <UnidadeSelector
            especialidade={especialidade}
            selectedId={idUnidade}
            onSelect={escolherUnidade}
          />
        </FormSection>
      )}

      {submitError && <ErrorMessage message={submitError} />}

      {especialidade && (
        <Button
          title="Confirmar pedido"
          icon="checkmark-circle-outline"
          onPress={() => void confirmar()}
          loading={submitting}
          disabled={!idUnidade}
          accessibilityHint={
            idUnidade ? 'Envia o pedido e coloca você na fila' : 'Escolha uma unidade primeiro'
          }
        />
      )}
    </Screen>
  );
}

function EspecialidadePicker({
  onSelect,
}: {
  onSelect: (especialidade: EspecialidadeResponse) => void;
}) {
  const {
    data: especialidades,
    loading,
    error,
    reload,
  } = useApiRequest(catalogoService.listarEspecialidades);
  const [busca, setBusca] = useState('');

  const filtradas = useMemo(() => {
    const termo = normalizeSearch(busca);
    if (!especialidades || !termo) return especialidades ?? [];
    return especialidades.filter((item) => normalizeSearch(item.nome).includes(termo));
  }, [busca, especialidades]);

  if (loading) return <Loading message="Buscando especialidades..." />;
  if (error) return <ErrorMessage message={error} onRetry={reload} />;
  if (!especialidades || especialidades.length === 0) {
    return (
      <EmptyState
        icon="medkit-outline"
        title="Nenhuma especialidade disponível"
        description="Ainda não há especialidades cadastradas. Tente novamente mais tarde."
      />
    );
  }

  return (
    <>
      <Input
        label="Buscar especialidade"
        placeholder="Ex.: cardiologia"
        value={busca}
        onChangeText={setBusca}
        autoCorrect={false}
        returnKeyType="search"
      />
      {filtradas.length === 0 ? (
        <Text style={styles.hint} accessibilityLiveRegion="polite">
          Nenhuma especialidade encontrada para “{busca.trim()}”.
        </Text>
      ) : (
        <SelectableList
          label="Especialidades"
          items={filtradas.map((item) => ({
            id: item.id,
            title: item.nome,
            description: item.descricao,
          }))}
          selectedId={null}
          onSelect={(id) => {
            const escolhida = especialidades.find((item) => item.id === id);
            if (escolhida) onSelect(escolhida);
          }}
        />
      )}
    </>
  );
}

const styles = StyleSheet.create({
  intro: {
    ...typography.body,
  },
  escolha: {
    ...typography.bodyBold,
  },
  hint: {
    ...typography.caption,
  },
});
