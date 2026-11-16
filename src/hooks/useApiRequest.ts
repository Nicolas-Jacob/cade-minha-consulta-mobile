import { useCallback, useEffect, useState } from 'react';

import { getErrorMessage } from '@/utils/apiError';

interface RequestState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

/**
 * Executa uma chamada à API ao montar a tela e expõe loading, erro e recarga.
 * `request` deve ser estável (função de service ou useCallback).
 */
export function useApiRequest<T>(request: () => Promise<T>) {
  const [state, setState] = useState<RequestState<T>>({
    data: null,
    loading: true,
    error: null,
  });

  const load = useCallback(async () => {
    setState((current) => ({ ...current, loading: true, error: null }));
    try {
      const data = await request();
      setState({ data, loading: false, error: null });
    } catch (error) {
      setState((current) => ({ ...current, loading: false, error: getErrorMessage(error) }));
    }
  }, [request]);

  useEffect(() => {
    void load();
  }, [load]);

  return { ...state, reload: load };
}
