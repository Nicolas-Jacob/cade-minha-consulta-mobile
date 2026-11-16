import type { OrientacaoResponse } from '@/types/api';

import { api } from './api';

/** A IA pode levar alguns segundos para escrever o texto: mais tempo que o padrão da API. */
const ORIENTACAO_TIMEOUT_MS = 30000;

/** Orientações de preparo para a consulta, escritas pela IA (ou texto padrão de reserva). */
export const orientacaoService = {
  async buscar(idConsulta: number) {
    const response = await api.get<OrientacaoResponse>(`/consultas/${idConsulta}/orientacoes`, {
      timeout: ORIENTACAO_TIMEOUT_MS,
    });
    return response.data;
  },
};
