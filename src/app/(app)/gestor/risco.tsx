import { router } from 'expo-router';
import { FlatList, RefreshControl, StyleSheet, Text } from 'react-native';

import { EmptyState, ErrorMessage, Loading, RiscoFaltaCard, Screen } from '@/components';
import { useApiRequest } from '@/hooks/useApiRequest';
import { useRefreshOnFocus } from '@/hooks/useRefreshOnFocus';
import { gestorService } from '@/services/gestorService';
import { colors, spacing, typography } from '@/theme';

/**
 * Consultas dos próximos 15 dias com o risco de falta previsto pelo modelo de ML.
 * A API devolve um array simples (sem paginação), já ordenado pela data.
 */
export default function RiscoFaltaScreen() {
  const { data, loading, error, reload } = useApiRequest(gestorService.listarRiscoFalta);
  // Com a lista já na tela, uma nova busca é um pull-to-refresh, não a carga inicial.
  const refreshing = loading && data !== null;

  useRefreshOnFocus(reload);

  if (!data) {
    return (
      <Screen>
        {error ? (
          <ErrorMessage message={error} onRetry={reload} />
        ) : (
          <Loading message="Carregando o risco de falta..." />
        )}
      </Screen>
    );
  }

  return (
    <Screen>
      <FlatList
        data={data}
        keyExtractor={(item) => String(item.idConsulta)}
        renderItem={({ item }) => (
          <RiscoFaltaCard
            item={item}
            onPress={() =>
              router.push({ pathname: '/consulta/[id]', params: { id: item.idConsulta } })
            }
          />
        )}
        style={styles.list}
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => void reload()}
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        }
        ListHeaderComponent={
          <>
            <Text style={styles.intro}>
              Chance de o paciente faltar às consultas dos próximos 15 dias. Use para lembrar quem
              tem risco maior.
            </Text>
            {error && <ErrorMessage message={error} onRetry={reload} />}
          </>
        }
        ListEmptyComponent={
          <EmptyState
            icon="checkmark-done-outline"
            title="Nenhuma consulta nos próximos 15 dias"
            description="Quando houver consultas agendadas, o risco de falta aparece aqui."
          />
        }
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  list: {
    flex: 1,
  },
  content: {
    gap: spacing.md,
    paddingBottom: spacing.md,
  },
  intro: {
    ...typography.caption,
  },
});
