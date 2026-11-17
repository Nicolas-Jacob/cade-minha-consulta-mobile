import { router, useLocalSearchParams } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';

/**
 * Aviso de sucesso recebido pelo parâmetro `sucesso` ao voltar de outra tela
 * (ex.: `router.dismissTo({ pathname: '/filas', params: { sucesso: 'criada' } })`).
 * `messages` traduz cada valor do parâmetro no texto do aviso.
 */
export function useSuccessParam(messages: Record<string, string>) {
  const { sucesso } = useLocalSearchParams<{ sucesso?: string }>();
  const [aviso, setAviso] = useState<string | null>(null);

  // Um novo valor de `sucesso` vira aviso (ajuste de estado durante o render, sem efeito).
  const [ultimoSucesso, setUltimoSucesso] = useState<string | undefined>(undefined);
  if (sucesso !== ultimoSucesso) {
    setUltimoSucesso(sucesso);
    if (sucesso) setAviso(messages[sucesso] ?? null);
  }

  // Limpa o parâmetro para que o mesmo aviso possa aparecer de novo numa próxima vez.
  useEffect(() => {
    if (sucesso) router.setParams({ sucesso: undefined });
  }, [sucesso]);

  const limparAviso = useCallback(() => setAviso(null), []);

  return { aviso, limparAviso };
}
