import type { FilaRequest, FilaResponse, FilaUpdateRequest, Page, PageParams } from '@/types/api';

import { api } from './api';

/** Solicitações de consulta (fila) do cidadão logado. */
export const filaService = {
  async criar(data: FilaRequest) {
    const response = await api.post<FilaResponse>('/filas', data);
    return response.data;
  },

  async listarMinhas(params: PageParams = {}) {
    const response = await api.get<Page<FilaResponse>>('/filas/minhas', {
      params: { sort: 'dataEntrada,desc', ...params },
    });
    return response.data;
  },

  async buscarPorId(id: number) {
    const response = await api.get<FilaResponse>(`/filas/${id}`);
    return response.data;
  },

  async trocarUnidade(id: number, data: FilaUpdateRequest) {
    const response = await api.put<FilaResponse>(`/filas/${id}`, data);
    return response.data;
  },

  /** Desistência: a API marca a solicitação como CANCELADA (204). */
  async desistir(id: number) {
    await api.delete(`/filas/${id}`);
  },
};
