import type { ConsultaResponse, Page, PageParams, PeriodoConsulta } from '@/types/api';

import { api } from './api';

/** Próximas em ordem de data; histórico com as mais recentes primeiro. */
const SORT_POR_PERIODO: Record<PeriodoConsulta, string> = {
  futuras: 'dataHora,asc',
  historico: 'dataHora,desc',
};

/** Consultas do cidadão logado. */
export const consultaService = {
  async listarMinhas(periodo: PeriodoConsulta, params: PageParams = {}) {
    const response = await api.get<Page<ConsultaResponse>>('/consultas/minhas', {
      params: { periodo, sort: SORT_POR_PERIODO[periodo], ...params },
    });
    return response.data;
  },

  async buscarPorId(id: number) {
    const response = await api.get<ConsultaResponse>(`/consultas/${id}`);
    return response.data;
  },

  /** AGENDADA → CONFIRMADA. Devolve a consulta atualizada. */
  async confirmar(id: number) {
    const response = await api.patch<ConsultaResponse>(`/consultas/${id}/confirmar`);
    return response.data;
  },

  /** Libera a vaga (CANCELADA) para o próximo da fila. Devolve a consulta atualizada. */
  async cancelar(id: number) {
    const response = await api.patch<ConsultaResponse>(`/consultas/${id}/cancelar`);
    return response.data;
  },
};
