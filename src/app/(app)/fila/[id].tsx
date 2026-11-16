import { router, useLocalSearchParams } from 'expo-router';
import { useCallback, useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';

import {
  Button,
  Card,
  EmptyState,
  ErrorMessage,
  FormSection,
  InfoRow,
  Loading,
  Screen,
  StatusBadge,
  SuccessMessage,
  UnidadeSelector,
} from '@/components';
import { useApiRequest } from '@/hooks/useApiRequest';
import { filaService } from '@/services/filaService';
import { colors, spacing, typography } from '@/theme';
import type { FilaResponse } from '@/types/api';
import { getErrorMessage } from '@/utils/apiError';
import { isoToBrDateTime } from '@/utils/date';
import { textoPosicaoFila } from '@/utils/fila';

export default function DetalheSolicitacaoScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const filaId = Number(id);
  const request = useCallback(() => filaService.buscarPorId(filaId), [filaId]);
  const { data: fila, loading, error, reload, setData } = useApiRequest(request);

  function renderContent() {
    if (loading) return <Loading message="Carregando o pedido..." />;
    if (error) return <ErrorMessage message={error} onRetry={reload} />;
    if (!fila) {
      return <EmptyState icon="document-text-outline" title="Pedido não encontrado" />;
    }
    return <DetalheConteudo fila={fila} onUpdated={setData} />;
  }

  return (
    <Screen scroll edges={['bottom', 'left', 'right']}>
      {renderContent()}
    </Screen>
  );
}

interface DetalheConteudoProps {
  fila: FilaResponse;
  /** Recebe o pedido atualizado devolvido pela API. */
  onUpdated: (fila: FilaResponse) => void;
}

function DetalheConteudo({ fila, onUpdated }: DetalheConteudoProps) {
  const [editando, setEditando] = useState(false);
  const [novaUnidade, setNovaUnidade] = useState<number | null>(fila.unidade.id);
  const [salvando, setSalvando] = useState(false);
  const [desistindo, setDesistindo] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const [aviso, setAviso] = useState<string | null>(null);

  const aguardando = fila.status === 'AGUARDANDO';
  const posicao = textoPosicaoFila(fila);
  const ocupado = salvando || desistindo;

  function abrirTroca() {
    setNovaUnidade(fila.unidade.id);
    setActionError(null);
    setAviso(null);
    setEditando(true);
  }

  async function salvarUnidade() {
    if (!novaUnidade || novaUnidade === fila.unidade.id) return;
    setSalvando(true);
    setActionError(null);
    try {
      const atualizada = await filaService.trocarUnidade(fila.id, { idUnidade: novaUnidade });
      onUpdated(atualizada);
      setEditando(false);
      setAviso('Unidade alterada. Sua posição na fila foi recalculada.');
    } catch (error) {
      setActionError(getErrorMessage(error));
    } finally {
      setSalvando(false);
    }
  }

  async function desistir() {
    setDesistindo(true);
    setActionError(null);
    try {
      await filaService.desistir(fila.id);
      router.dismissTo({ pathname: '/filas', params: { sucesso: 'desistiu' } });
    } catch (error) {
      setActionError(getErrorMessage(error));
      setDesistindo(false);
    }
  }

  function confirmarDesistencia() {
    Alert.alert(
      'Desistir do pedido?',
      `Você vai sair da fila de ${fila.especialidade.nome} e perder a sua posição. ` +
        'Se precisar da consulta depois, terá que fazer um novo pedido e entrar no fim da fila.',
      [
        { text: 'Continuar na fila', style: 'cancel' },
        { text: 'Desistir', style: 'destructive', onPress: () => void desistir() },
      ],
    );
  }

  return (
    <>
      {aviso && <SuccessMessage message={aviso} onDismiss={() => setAviso(null)} />}

      <Card>
        <Text style={styles.titulo} accessibilityRole="header">
          {fila.especialidade.nome}
        </Text>
        <StatusBadge status={fila.status} />
        {posicao && (
          <View style={styles.posicaoBox}>
            <Text style={styles.posicao}>{posicao}</Text>
            <Text style={styles.posicaoInfo}>
              A ordem pode mudar conforme a prioridade definida pela unidade de saúde.
            </Text>
          </View>
        )}
      </Card>

      <Card>
        <InfoRow label="Unidade de saúde" value={fila.unidade.nome} />
        <InfoRow label="Pedido feito em" value={isoToBrDateTime(fila.dataEntrada)} />
        {fila.dataSaida && (
          <InfoRow label="Saiu da fila em" value={isoToBrDateTime(fila.dataSaida)} />
        )}
      </Card>

      {actionError && <ErrorMessage message={actionError} />}

      {aguardando && editando && (
        <FormSection title="Trocar unidade">
          <Text style={styles.hint}>
            Escolha outra unidade com atendimento em {fila.especialidade.nome}:
          </Text>
          <UnidadeSelector
            especialidade={fila.especialidade}
            selectedId={novaUnidade}
            onSelect={setNovaUnidade}
          />
          <Button
            title="Salvar nova unidade"
            icon="checkmark-circle-outline"
            onPress={() => void salvarUnidade()}
            loading={salvando}
            disabled={!novaUnidade || novaUnidade === fila.unidade.id || desistindo}
            accessibilityHint={
              novaUnidade === fila.unidade.id ? 'Escolha uma unidade diferente da atual' : undefined
            }
          />
          <Button
            title="Cancelar"
            variant="link"
            onPress={() => setEditando(false)}
            disabled={salvando}
            accessibilityLabel="Cancelar troca de unidade"
          />
        </FormSection>
      )}

      {aguardando && (
        <View style={styles.actions}>
          {!editando && (
            <Button
              title="Trocar unidade"
              variant="secondary"
              icon="swap-horizontal"
              onPress={abrirTroca}
              disabled={ocupado}
              accessibilityHint="Mostra as unidades que atendem esta especialidade"
            />
          )}
          <Button
            title="Desistir do pedido"
            variant="danger"
            icon="exit-outline"
            onPress={confirmarDesistencia}
            loading={desistindo}
            disabled={salvando}
            accessibilityHint="Pede confirmação antes de tirar você da fila"
          />
        </View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  titulo: {
    ...typography.title,
  },
  posicaoBox: {
    gap: spacing.xs,
    paddingTop: spacing.xs,
  },
  posicao: {
    ...typography.bodyBold,
    color: colors.primary,
  },
  posicaoInfo: {
    ...typography.caption,
  },
  hint: {
    ...typography.caption,
  },
  actions: {
    gap: spacing.sm,
    marginTop: 'auto',
  },
});
