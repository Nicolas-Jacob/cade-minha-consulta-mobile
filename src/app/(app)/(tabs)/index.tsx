import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import {
  Button,
  Card,
  CidadaoOnly,
  EmptyState,
  ErrorMessage,
  Loading,
  ProximaConsultaCard,
  Screen,
  SuccessMessage,
} from '@/components';
import { useApiRequest } from '@/hooks/useApiRequest';
import { useAuth } from '@/hooks/useAuth';
import { useConsultaAcoes } from '@/hooks/useConsultaAcoes';
import { useRefreshOnFocus } from '@/hooks/useRefreshOnFocus';
import { consultaService } from '@/services/consultaService';
import { colors, radius, spacing, typography } from '@/theme';
import type { ConsultaResponse } from '@/types/api';

/** A próxima consulta é a primeira das futuras (a API já ordena por data). */
async function buscarProximaConsulta(): Promise<ConsultaResponse | null> {
  const page = await consultaService.listarMinhas('futuras', { page: 0, size: 1 });
  return page.content[0] ?? null;
}

export default function InicioScreen() {
  return (
    <CidadaoOnly>
      <Inicio />
    </CidadaoOnly>
  );
}

function Inicio() {
  const { usuario } = useAuth();
  const { data: proxima, loading, error, reload, setData } = useApiRequest(buscarProximaConsulta);
  const acoes = useConsultaAcoes(setData);

  // Ao voltar para a aba, busca de novo (a consulta pode ter sido confirmada ou cancelada
  // no detalhe). Ao sair, o aviso de sucesso some.
  useRefreshOnFocus(reload, acoes.limparAviso);

  const abrirDetalhe = (consulta: ConsultaResponse) =>
    router.push({ pathname: '/consulta/[id]', params: { id: consulta.id } });

  function renderProximaConsulta() {
    // Na recarga ao voltar para a aba, o card atual continua visível até a resposta chegar.
    if (loading && !proxima) return <Loading message="Buscando sua próxima consulta..." />;
    if (error) return <ErrorMessage message={error} onRetry={reload} />;
    if (!proxima) {
      return (
        <Card>
          <EmptyState
            icon="calendar-clear-outline"
            title="Você não tem consultas marcadas"
            description="Precisa de um especialista? Faça um pedido e acompanhe sua posição na fila."
            action={{ label: 'Solicitar consulta', onPress: () => router.push('/fila/nova') }}
          />
        </Card>
      );
    }
    return (
      <ProximaConsultaCard
        consulta={proxima}
        onPress={() => abrirDetalhe(proxima)}
        onConfirmar={() => void acoes.confirmar(proxima)}
        confirmando={acoes.confirmando}
      />
    );
  }

  return (
    <Screen scroll>
      <View style={styles.saudacao}>
        <Text style={styles.titulo} accessibilityRole="header">
          Olá, {usuario?.nome}!
        </Text>
        <Text style={styles.subtitulo}>Acompanhe suas consultas e pedidos.</Text>
      </View>

      {acoes.aviso && <SuccessMessage message={acoes.aviso} onDismiss={acoes.limparAviso} />}
      {renderProximaConsulta()}
      {acoes.erro && <ErrorMessage message={acoes.erro} />}

      <View style={styles.atalhos}>
        <Text style={styles.secao} accessibilityRole="header">
          Atalhos
        </Text>
        <Button
          title="Minhas consultas"
          variant="secondary"
          icon="calendar-outline"
          onPress={() => router.navigate('/consultas')}
          accessibilityHint="Mostra suas próximas consultas e o histórico"
        />
        <Button
          title="Minhas solicitações"
          variant="secondary"
          icon="document-text-outline"
          onPress={() => router.navigate('/filas')}
          accessibilityHint="Mostra seus pedidos de consulta e a posição na fila"
        />
      </View>

      <View style={styles.aviso} accessible accessibilityRole="text">
        <Ionicons name="people-outline" size={28} color={colors.primaryDark} />
        <View style={styles.avisoTextos}>
          <Text style={styles.avisoTitulo}>Não vai poder ir? Libere a vaga.</Text>
          <Text style={styles.avisoTexto}>Outra pessoa da fila será chamada.</Text>
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  saudacao: {
    gap: spacing.xs,
  },
  titulo: {
    ...typography.title,
  },
  subtitulo: {
    ...typography.body,
    color: colors.textSecondary,
  },
  atalhos: {
    gap: spacing.sm,
  },
  secao: {
    ...typography.subtitle,
  },
  aviso: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.primaryLight,
    borderRadius: radius.lg,
    padding: spacing.md,
  },
  avisoTextos: {
    flex: 1,
    gap: 2,
  },
  avisoTitulo: {
    ...typography.bodyBold,
    color: colors.primaryDark,
  },
  avisoTexto: {
    ...typography.body,
    color: colors.primaryDark,
  },
});
