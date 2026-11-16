import { useCallback, useEffect, useState } from 'react';

import { getErrorMessage } from '@/utils/apiError';

interface RequestState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

interface ApiRequestOptions {
  /**
   * true (padrão): chama a API ao montar a tela.
   * false: só chama quando `reload` for executado (ex.: ao tocar num botão).
   */
  immediate?: boolean;
}

/**
 * Executa uma chamada à API e expõe loading, erro e recarga.
 * `request` deve ser estável (função de service ou useCallback).
 */
export function useApiRequest<T>(
  request: () => Promise<T>,
  { immediate = true }: ApiRequestOptions = {},
) {
  const [state, setState] = useState<RequestState<T>>({
    data: null,
    loading: immediate,
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
    if (immediate) void load();
  }, [immediate, load]);

  /** Substitui os dados sem nova chamada (ex.: com o recurso devolvido por um PUT). */
  const setData = useCallback((data: T) => {
    setState({ data, loading: false, error: null });
  }, []);

  return { ...state, reload: load, setData };
}
