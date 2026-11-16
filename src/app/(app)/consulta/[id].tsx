import { useLocalSearchParams } from 'expo-router';
import { useCallback } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';

import {
  Badge,
  Button,
  Card,
  EmptyState,
  ErrorMessage,
  InfoRow,
  Loading,
  Screen,
  StatusBadge,
  SuccessMessage,
} from '@/components';
import { useApiRequest } from '@/hooks/useApiRequest';
import { useAuth } from '@/hooks/useAuth';
import { useConsultaAcoes } from '@/hooks/useConsultaAcoes';
import { consultaService } from '@/services/consultaService';
import { orientacaoService } from '@/services/orientacaoService';
import { colors, spacing, typography } from '@/theme';
import type { ConsultaResponse } from '@/types/api';
import {
  dataHoraPorExtenso,
  podeConfirmar,
  podeLiberarVaga,
  textoDiasAteConsulta,
} from '@/utils/consulta';
import { abrirMapa } from '@/utils/maps';
import { maskPhone } from '@/utils/masks';

/** Detalhe da consulta, aberto pelo cidadão (dono) e pelo gestor. */
export default function DetalheConsultaScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const consultaId = Number(id);
  const request = useCallback(() => consultaService.buscarPorId(consultaId), [consultaId]);
  const { data: consulta, loading, error, reload, setData } = useApiRequest(request);

  function renderContent() {
    if (loading) return <Loading message="Carregando a consulta..." />;
    if (error) return <ErrorMessage message={error} onRetry={reload} />;
    if (!consulta) {
      return <EmptyState icon="calendar-outline" title="Consulta não encontrada" />;
    }
    return <DetalheConteudo consulta={consulta} onUpdated={setData} />;
  }

  return (
    <Screen scroll edges={['bottom', 'left', 'right']}>
      {renderContent()}
    </Screen>
  );
}

interface DetalheConteudoProps {
  consulta: ConsultaResponse;
  /** Recebe a consulta atualizada devolvida pela API. */
  onUpdated: (consulta: ConsultaResponse) => void;
}

function DetalheConteudo({ consulta, onUpdated }: DetalheConteudoProps) {
  const { usuario } = useAuth();
  const acoes = useConsultaAcoes(onUpdated);
  const ativa = podeLiberarVaga(consulta.status);
  // Confirmar e liberar a vaga são ações do dono da consulta; o gestor só acompanha.
  const mostrarAcoesDoDono = ativa && usuario?.credencial === 'CIDADAO';
  // "Em X dias" só faz sentido enquanto a consulta ainda vai acontecer.
  const faltam = ativa ? textoDiasAteConsulta(consulta.diasAteConsulta) : null;
  const { endereco } = consulta.unidade;
  const { paciente } = consulta;

  async function comoChegar(destino: string) {
    try {
      await abrirMapa(destino);
    } catch {
      Alert.alert(
        'Não foi possível abrir o mapa',
        `Procure este endereço no seu aplicativo de mapas: ${destino}`,
      );
    }
  }

  return (
    <>
      {acoes.aviso && <SuccessMessage message={acoes.aviso} onDismiss={acoes.limparAviso} />}

      <Card>
        <Text style={styles.titulo} accessibilityRole="header">
          {consulta.especialidade.nome}
        </Text>
        <StatusBadge status={consulta.status} />
        <Text style={styles.dataHora}>{dataHoraPorExtenso(consulta.dataHora)}</Text>
        {faltam && <Text style={styles.faltam}>{faltam}</Text>}
      </Card>

      {/* O paciente só vem na resposta para o gestor. */}
      {paciente && (
        <Card>
          <InfoRow label="Paciente" value={paciente.nome} />
          <InfoRow label="Telefone" value={paciente.telefone && maskPhone(paciente.telefone)} />
        </Card>
      )}

      <Card>
        <InfoRow label="Médico(a)" value={consulta.medico.nome} />
        <InfoRow label="CRM" value={consulta.medico.crm} />
      </Card>

      <Card>
        <InfoRow label="Unidade de saúde" value={consulta.unidade.nome} />
        <InfoRow label="Endereço" value={endereco} />
        {endereco && (
          <Button
            title="Como chegar"
            variant="secondary"
            icon="navigate-outline"
            onPress={() => void comoChegar(endereco)}
            accessibilityHint="Abre o aplicativo de mapas com o endereço da unidade"
          />
        )}
      </Card>

      {ativa && <OrientacoesConsulta consultaId={consulta.id} />}

      {acoes.erro && <ErrorMessage message={acoes.erro} />}

      {mostrarAcoesDoDono && (
        <View style={styles.actions}>
          {podeConfirmar(consulta.status) && (
            <Button
              title="Confirmar presença"
              icon="checkmark-circle-outline"
              onPress={() => void acoes.confirmar(consulta)}
              loading={acoes.confirmando}
              disabled={acoes.liberando}
              accessibilityHint="Avisa a unidade de saúde que você vai à consulta"
            />
          )}
          <Text style={styles.dica}>
            Se não puder ir, libere a vaga: outra pessoa da fila será chamada.
          </Text>
          <Button
            title="Não vou poder ir: liberar vaga"
            variant="danger"
            icon="exit-outline"
            onPress={() => acoes.liberarVaga(consulta)}
            loading={acoes.liberando}
            disabled={acoes.confirmando}
            accessibilityHint="Pede confirmação antes de cancelar a consulta e liberar a vaga"
          />
        </View>
      )}
    </>
  );
}

/**
 * Orientações de preparo escritas pela IA. Só são buscadas quando a pessoa toca no botão,
 * porque a geração do texto pode levar alguns segundos.
 */
function OrientacoesConsulta({ consultaId }: { consultaId: number }) {
  const request = useCallback(() => orientacaoService.buscar(consultaId), [consultaId]);
  const { data: orientacao, loading, error, reload } = useApiRequest(request, { immediate: false });

  if (loading) return <Loading message="Preparando suas orientações..." />;
  if (error) return <ErrorMessage message={error} onRetry={reload} />;
  if (!orientacao) {
    return (
      <Button
        title="Ver orientações para a consulta"
        variant="secondary"
        icon="reader-outline"
        onPress={() => void reload()}
        accessibilityHint="Mostra dicas de como se preparar para a consulta"
      />
    );
  }

  return (
    <Card>
      <Text style={styles.secao} accessibilityRole="header">
        Orientações para a consulta
      </Text>
      {orientacao.origem === 'IA' && (
        <Badge
          label="Gerado por IA"
          icon="sparkles-outline"
          color={colors.neutral}
          background={colors.neutralLight}
        />
      )}
      <Text style={styles.orientacao}>{orientacao.mensagem}</Text>
      <Text style={styles.aviso}>{orientacao.aviso}</Text>
    </Card>
  );
}

const styles = StyleSheet.create({
  titulo: {
    ...typography.title,
  },
  dataHora: {
    ...typography.bodyBold,
  },
  faltam: {
    ...typography.bodyBold,
    color: colors.primary,
  },
  secao: {
    ...typography.subtitle,
  },
  orientacao: {
    ...typography.body,
  },
  aviso: {
    ...typography.caption,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: spacing.sm,
  },
  actions: {
    gap: spacing.sm,
    marginTop: 'auto',
  },
  dica: {
    ...typography.caption,
    textAlign: 'center',
    marginTop: spacing.sm,
  },
});
