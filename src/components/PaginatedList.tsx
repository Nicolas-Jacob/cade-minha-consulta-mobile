import type { ReactElement } from 'react';
import { ActivityIndicator, FlatList, RefreshControl, StyleSheet } from 'react-native';

import type { PaginatedListState } from '@/hooks/usePaginatedList';
import { colors, spacing } from '@/theme';

import { ErrorMessage } from './ErrorMessage';

interface PaginatedListProps<T extends { id: number }> {
  /** Resultado de usePaginatedList. */
  list: PaginatedListState<T>;
  renderItem: (item: T) => ReactElement;
  /** Lido pelo leitor de tela enquanto a próxima página carrega. */
  loadingMoreLabel: string;
}

/**
 * Lista com pull-to-refresh, "carregar mais" ao chegar no fim e erro no rodapé.
 * Os estados de carga inicial, erro sem itens e lista vazia ficam com a tela.
 */
export function PaginatedList<T extends { id: number }>({
  list,
  renderItem,
  loadingMoreLabel,
}: PaginatedListProps<T>) {
  const { items, refreshing, loadingMore, error, refresh, loadMore, retry } = list;

  return (
    <FlatList
      data={items}
      keyExtractor={(item) => String(item.id)}
      renderItem={({ item }) => renderItem(item)}
      style={styles.list}
      contentContainerStyle={styles.content}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={() => void refresh()}
          colors={[colors.primary]}
          tintColor={colors.primary}
        />
      }
      onEndReached={loadMore}
      onEndReachedThreshold={0.3}
      ListFooterComponent={
        <>
          {loadingMore && (
            <ActivityIndicator
              color={colors.primary}
              accessibilityLabel={loadingMoreLabel}
              style={styles.footerLoading}
            />
          )}
          {error && <ErrorMessage message={error} onRetry={retry} />}
        </>
      }
    />
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
  footerLoading: {
    paddingVertical: spacing.md,
  },
});
