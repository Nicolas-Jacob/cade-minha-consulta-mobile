import type { FilaResponse } from '@/types/api';

/** Texto da posição estimada; null quando a solicitação não está aguardando. */
export function textoPosicaoFila(fila: FilaResponse) {
  if (fila.status !== 'AGUARDANDO' || fila.posicaoEstimada == null) return null;
  return `Você é o nº ${fila.posicaoEstimada} na fila (estimativa)`;
}
