import { router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { useCallback, useEffect, useRef, useState } from 'react';
import { ActivityIndicator, FlatList, RefreshControl, StyleSheet, View } from 'react-native';

import {
  Button,
  CidadaoOnly,
  EmptyState,
  ErrorMessage,
  FilaCard,
  Loading,
  Screen,
  SuccessMessage,
} from '@/components';
import { usePaginatedList } from '@/hooks/usePaginatedList';
import { filaService } from '@/services/filaService';
import { colors, spacing } from '@/theme';

/** Avisos recebidos pelo parâmetro `sucesso` ao voltar de outra tela. */
const SUCCESS_MESSAGES: Record<string, string> = {
  criada: 'Pedido enviado! Você entrou na fila e pode acompanhar sua posição aqui.',
  desistiu: 'Você desistiu do pedido e saiu da fila.',
};

export default function FilasScreen() {
  return (
    <CidadaoOnly>
      <MinhasSolicitacoes />
    </CidadaoOnly>
  );
}

function MinhasSolicitacoes() {
  const { items, loading, refreshing, loadingMore, error, refresh, loadMore, retry } =
    usePaginatedList(filaService.listarMinhas);

  const { sucesso } = useLocalSearchParams<{ sucesso?: string }>();
  const [aviso, setAviso] = useState<string | null>(null);

  // Um novo valor de `sucesso` vira aviso (ajuste de estado durante o render, sem efeito).
  const [ultimoSucesso, setUltimoSucesso] = useState<string | undefined>(undefined);
  if (sucesso !== ultimoSucesso) {
    setUltimoSucesso(sucesso);
    if (sucesso) setAviso(SUCCESS_MESSAGES[sucesso] ?? null);
  }

  // Limpa o parâmetro para que o mesmo aviso possa aparecer de novo numa próxima vez.
  useEffect(() => {
    if (sucesso) router.setParams({ sucesso: undefined });
  }, [sucesso]);

  // Ao voltar para a aba (depois de criar, trocar unidade ou desistir), busca a lista de novo.
  // O primeiro foco é ignorado porque o hook já faz a carga inicial. Ao sair, o aviso some.
  const firstFocus = useRef(true);
  useFocusEffect(
    useCallback(() => {
      if (firstFocus.current) firstFocus.current = false;
      else void refresh();
      return () => setAviso(null);
    }, [refresh]),
  );

  const solicitar = () => router.push('/fila/nova');
  const isEmpty = !loading && !refreshing && !error && items.length === 0;

  function renderContent() {
    if (loading) return <Loading message="Carregando seus pedidos..." />;
    if (error && items.length === 0) return <ErrorMessage message={error} onRetry={retry} />;
    if (isEmpty) {
      return (
        <EmptyState
          icon="document-text-outline"
          title="Você ainda não pediu nenhuma consulta"
          description="Peça uma consulta com especialista e acompanhe aqui a sua posição na fila."
          action={{ label: 'Solicitar consulta', onPress: solicitar }}
        />
      );
    }

    return (
      <FlatList
        data={items}
        keyExtractor={(fila) => String(fila.id)}
        renderItem={({ item }) => (
          <FilaCard
            fila={item}
            onPress={() => router.push({ pathname: '/fila/[id]', params: { id: item.id } })}
          />
        )}
        style={styles.list}
        contentContainerStyle={styles.listContent}
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
                accessibilityLabel="Carregando mais pedidos"
                style={styles.footerLoading}
              />
            )}
            {error && <ErrorMessage message={error} onRetry={retry} />}
          </>
        }
      />
    );
  }

  return (
    <Screen>
      {aviso && <SuccessMessage message={aviso} onDismiss={() => setAviso(null)} />}
      {renderContent()}
      {/* No estado vazio o próprio EmptyState já traz o botão de solicitar. */}
      {!isEmpty && (
        <View style={styles.footer}>
          <Button
            title="Solicitar consulta"
            icon="add-circle-outline"
            onPress={solicitar}
            accessibilityHint="Abre a tela para pedir uma consulta com especialista"
          />
        </View>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  list: {
    flex: 1,
  },
  listContent: {
    gap: spacing.md,
    paddingBottom: spacing.md,
  },
  footerLoading: {
    paddingVertical: spacing.md,
  },
  footer: {
    marginTop: 'auto',
  },
});
