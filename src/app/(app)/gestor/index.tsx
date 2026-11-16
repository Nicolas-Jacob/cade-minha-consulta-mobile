import { router } from 'expo-router';
import { StyleSheet, Text } from 'react-native';

import {
  ConsultaCard,
  EmptyState,
  ErrorMessage,
  Loading,
  PaginatedList,
  Screen,
} from '@/components';
import { usePaginatedList } from '@/hooks/usePaginatedList';
import { useRefreshOnFocus } from '@/hooks/useRefreshOnFocus';
import { gestorService } from '@/services/gestorService';
import { typography } from '@/theme';

/** Painel do gestor: consultas agendadas e confirmadas dos próximos 15 dias. */
export default function PainelScreen() {
  const lista = usePaginatedList(gestorService.listarProximas);
  const { items, loading, refreshing, error, refresh, retry } = lista;

  // Ao voltar de Agendar ou do detalhe, busca de novo: a consulta nova aparece na lista.
  useRefreshOnFocus(refresh);

  function renderContent() {
    if (loading) return <Loading message="Carregando as próximas consultas..." />;
    if (error && items.length === 0) return <ErrorMessage message={error} onRetry={retry} />;
    if (!refreshing && !error && items.length === 0) {
      return (
        <EmptyState
          icon="calendar-clear-outline"
          title="Nenhuma consulta nos próximos 15 dias"
          description="Agende o próximo paciente da fila na aba Agendar."
          action={{ label: 'Agendar paciente', onPress: () => router.navigate('/gestor/agendar') }}
        />
      );
    }

    return (
      <PaginatedList
        list={lista}
        loadingMoreLabel="Carregando mais consultas"
        renderItem={(consulta) => (
          <ConsultaCard
            consulta={consulta}
            onPress={() => router.push({ pathname: '/consulta/[id]', params: { id: consulta.id } })}
          />
        )}
      />
    );
  }

  return (
    <Screen>
      <Text style={styles.intro}>Consultas agendadas e confirmadas nos próximos 15 dias.</Text>
      {renderContent()}
    </Screen>
  );
}

const styles = StyleSheet.create({
  intro: {
    ...typography.caption,
  },
});
