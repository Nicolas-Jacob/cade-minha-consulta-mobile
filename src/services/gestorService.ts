import type {
  AgendamentoRequest,
  ConsultaResponse,
  Page,
  PageParams,
  RiscoFaltaResponse,
} from '@/types/api';

import { api } from './api';

/** Janela, em dias, das listas do painel e do risco de falta. */
const DIAS_A_FRENTE = 15;

/** Ferramentas da unidade de saúde (só GESTOR). */
export const gestorService = {
  /** Consultas AGENDADA/CONFIRMADA dos próximos dias, com o contato do paciente. */
  async listarProximas(params: PageParams = {}) {
    const response = await api.get<Page<ConsultaResponse>>('/gestor/consultas/proximas', {
      params: { dias: DIAS_A_FRENTE, sort: 'dataHora,asc', ...params },
    });
    return response.data;
  },

  /** Agenda o próximo paciente da fila do médico. Devolve a consulta criada (com `paciente`). */
  async agendar(data: AgendamentoRequest) {
    const response = await api.post<ConsultaResponse>('/gestor/agendamentos', data);
    return response.data;
  },

  /** Exceção à paginação: array simples, já ordenado pela data da consulta. */
  async listarRiscoFalta() {
    const response = await api.get<RiscoFaltaResponse[]>('/gestor/consultas/risco-falta', {
      params: { dias: DIAS_A_FRENTE },
    });
    return response.data;
  },
};
