import type { LoginRequest, LoginResponse, RegisterRequest } from '@/types/api';

import { api } from './api';

export const authService = {
  async login(data: LoginRequest) {
    const response = await api.post<LoginResponse>('/auth/login', data);
    return response.data;
  },

  async register(data: RegisterRequest) {
    const response = await api.post<LoginResponse>('/auth/register', data);
    return response.data;
  },
};
