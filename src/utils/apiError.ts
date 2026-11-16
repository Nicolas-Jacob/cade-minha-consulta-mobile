import { isAxiosError } from 'axios';

import type { ApiErrorResponse } from '@/types/api';

const NETWORK_MESSAGE =
  'Não foi possível conectar ao servidor. Verifique sua internet e tente novamente.';
const TIMEOUT_MESSAGE = 'O servidor demorou para responder. Tente novamente em instantes.';
const GENERIC_MESSAGE = 'Algo deu errado. Tente novamente.';

function getApiErrorBody(error: unknown): ApiErrorResponse | null {
  if (!isAxiosError(error)) return null;
  const data = error.response?.data as Partial<ApiErrorResponse> | undefined;
  return data && typeof data.mensagem === 'string' ? (data as ApiErrorResponse) : null;
}

/** Mensagem para mostrar ao usuário: sempre o campo "mensagem" do erro padrão da API. */
export function getErrorMessage(error: unknown) {
  const body = getApiErrorBody(error);
  if (body) return body.mensagem;

  if (isAxiosError(error)) {
    if (error.code === 'ECONNABORTED') return TIMEOUT_MESSAGE;
    if (!error.response) return NETWORK_MESSAGE;
  }
  return GENERIC_MESSAGE;
}

/** Erros de validação por campo ("campos" do erro 400), indexados pelo nome do campo. */
export function getFieldErrors(error: unknown): Record<string, string> {
  const campos = getApiErrorBody(error)?.campos ?? [];
  return Object.fromEntries(
    // "endereco.cep" vira "cep" para casar com os campos do formulário
    campos.map(({ campo, mensagem }) => [campo.split('.').pop() ?? campo, mensagem]),
  );
}

export function isUnauthorized(error: unknown) {
  return isAxiosError(error) && error.response?.status === 401;
}
