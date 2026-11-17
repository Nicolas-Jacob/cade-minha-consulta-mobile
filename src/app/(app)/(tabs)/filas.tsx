import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import {
  Button,
  EmptyState,
  ErrorMessage,
  FilaCard,
  Loading,
  PaginatedList,
  Screen,
  SuccessMessage,
} from '@/components';
import { usePaginatedList } from '@/hooks/usePaginatedList';
import { useRefreshOnFocus } from '@/hooks/useRefreshOnFocus';
import { useSuccessParam } from '@/hooks/useSuccessParam';
import { filaService } from '@/services/filaService';

/** Avisos recebidos pelo parâmetro `sucesso` ao voltar de outra tela. */
const SUCCESS_MESSAGES: Record<string, string> = {
  criada: 'Pedido enviado! Você entrou na fila e pode acompanhar sua posição aqui.',
  desistiu: 'Você desistiu do pedido e saiu da fila.',
};

export default function FilasScreen() {
  const lista = usePaginatedList(filaService.listarMinhas);
  const { items, loading, refreshing, error, refresh, retry } = lista;

  const { aviso, limparAviso } = useSuccessParam(SUCCESS_MESSAGES);

  // Ao voltar para a aba (depois de criar, trocar unidade ou desistir), busca a lista de novo.
  // Ao sair, o aviso some.
  useRefreshOnFocus(refresh, limparAviso);

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
      <PaginatedList
        list={lista}
        loadingMoreLabel="Carregando mais pedidos"
        renderItem={(fila) => (
          <FilaCard
            fila={fila}
            onPress={() => router.push({ pathname: '/fila/[id]', params: { id: fila.id } })}
          />
        )}
      />
    );
  }

  return (
    <Screen>
      {aviso && <SuccessMessage message={aviso} onDismiss={limparAviso} />}
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
  footer: {
    marginTop: 'auto',
  },
});
