import { useCallback, useEffect, useRef, useState } from 'react';

import type { Page, PageParams } from '@/types/api';
import { getErrorMessage } from '@/utils/apiError';

type Status = 'loading' | 'refreshing' | 'loadingMore' | 'idle';

const DEFAULT_PAGE_SIZE = 10;

/**
 * Lista paginada (formato de página do Spring) com carga inicial, pull-to-refresh
 * e "carregar mais" ao chegar no fim da lista.
 * `fetchPage` deve ser estável (função de service ou useCallback).
 */
export function usePaginatedList<T extends { id: number }>(
  fetchPage: (params: PageParams) => Promise<Page<T>>,
  pageSize = DEFAULT_PAGE_SIZE,
) {
  const [items, setItems] = useState<T[]>([]);
  const [status, setStatus] = useState<Status>('loading');
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(false);

  const nextPage = useRef(0);
  // Só a resposta da chamada mais recente vale (um refresh descarta um "carregar mais" em andamento).
  const lastRequestId = useRef(0);
  const lastRequest = useRef<{ page: number; status: Status }>({ page: 0, status: 'loading' });

  /**
   * Busca a página e aplica o resultado. Quem chama já deixou o status de carregamento.
   * O estado só muda nos callbacks da Promise, o que permite usar esta função na carga inicial
   * (useEffect) sem atualizar estado de forma síncrona dentro do efeito.
   */
  const request = useCallback(
    (page: number, nextStatus: Status) => {
      const requestId = ++lastRequestId.current;
      lastRequest.current = { page, status: nextStatus };
      const isLatest = () => requestId === lastRequestId.current;

      return fetchPage({ page, size: pageSize }).then(
        (result) => {
          if (!isLatest()) return;
          setItems((current) => {
            if (page === 0) return result.content;
            // Se a lista mudou entre uma página e outra, evita itens repetidos.
            const loadedIds = new Set(current.map((item) => item.id));
            return [...current, ...result.content.filter((item) => !loadedIds.has(item.id))];
          });
          nextPage.current = result.number + 1;
          setHasMore(result.number + 1 < result.totalPages);
          setStatus('idle');
        },
        (requestError: unknown) => {
          if (!isLatest()) return;
          setError(getErrorMessage(requestError));
          setStatus('idle');
        },
      );
    },
    [fetchPage, pageSize],
  );

  const fetchAt = useCallback(
    (page: number, nextStatus: Status) => {
      setStatus(nextStatus);
      setError(null);
      return request(page, nextStatus);
    },
    [request],
  );

  // Carga inicial: o estado já começa em "loading", sem erro.
  useEffect(() => {
    void request(0, 'loading');
  }, [request]);

  /** Recarrega a partir da primeira página, mantendo a lista na tela enquanto busca. */
  const refresh = useCallback(() => fetchAt(0, 'refreshing'), [fetchAt]);

  /** Busca a próxima página, se houver e se nada estiver carregando. */
  const loadMore = useCallback(() => {
    if (status !== 'idle' || !hasMore || error) return;
    void fetchAt(nextPage.current, 'loadingMore');
  }, [error, fetchAt, hasMore, status]);

  /** Repete a última chamada que falhou. */
  const retry = useCallback(() => {
    const { page, status: lastStatus } = lastRequest.current;
    return fetchAt(page, lastStatus);
  }, [fetchAt]);

  return {
    items,
    error,
    hasMore,
    loading: status === 'loading',
    refreshing: status === 'refreshing',
    loadingMore: status === 'loadingMore',
    refresh,
    loadMore,
    retry,
  };
}
