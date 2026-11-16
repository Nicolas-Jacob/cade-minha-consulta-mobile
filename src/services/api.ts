import { create, isAxiosError } from 'axios';

const API_URL = process.env.EXPO_PUBLIC_API_URL;

if (!API_URL) {
  console.warn(
    'EXPO_PUBLIC_API_URL não definida. Copie .env.example para .env e informe o IP da API.',
  );
}

/** Rotas públicas: um 401 nelas é "login ou senha inválidos", não sessão expirada. */
const PUBLIC_ROUTES = ['/auth/login', '/auth/register'];

let authToken: string | null = null;
let unauthorizedHandler: (() => void) | null = null;

export const api = create({
  baseURL: `${API_URL}/api`,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

/** Define o token enviado no header Authorization (chamado pelo AuthContext). */
export function setAuthToken(token: string | null) {
  authToken = token;
}

/** Registra a ação executada quando a API responde 401 em rota protegida (logout). */
export function setUnauthorizedHandler(handler: (() => void) | null) {
  unauthorizedHandler = handler;
}

api.interceptors.request.use((config) => {
  if (authToken) {
    config.headers.Authorization = `Bearer ${authToken}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    if (isAxiosError(error) && error.response?.status === 401) {
      const url = error.config?.url ?? '';
      const isPublicRoute = PUBLIC_ROUTES.some((route) => url.startsWith(route));
      if (!isPublicRoute) unauthorizedHandler?.();
    }
    return Promise.reject(error);
  },
);
