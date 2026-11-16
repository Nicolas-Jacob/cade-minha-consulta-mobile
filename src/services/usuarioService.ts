import type { UsuarioResponse, UsuarioUpdateRequest } from '@/types/api';

import { api } from './api';

export const usuarioService = {
  async getMe() {
    const response = await api.get<UsuarioResponse>('/usuarios/me');
    return response.data;
  },

  async updateMe(data: UsuarioUpdateRequest) {
    const response = await api.put<UsuarioResponse>('/usuarios/me', data);
    return response.data;
  },
};
