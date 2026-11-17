import type { EnderecoRequest, UsuarioResponse, UsuarioUpdateRequest } from '@/types/api';

import { maskCep, maskPhone, onlyDigits } from './masks';
import { isValidCep, isValidEmail, isValidPhone, isValidUf } from './validators';

/** Campos comuns ao cadastro e à edição do perfil (nome, contato e endereço). */
export interface DadosUsuarioValues {
  nome: string;
  sobrenome: string;
  telefone: string;
  email: string;
  cep: string;
  logradouro: string;
  numero: string;
  complemento: string;
  bairro: string;
  cidade: string;
  uf: string;
}

export type FormErrors<V> = Partial<Record<keyof V, string>>;
export type FieldMasks<V> = Partial<Record<keyof V, (value: string) => string>>;

export const EMPTY_DADOS_USUARIO: DadosUsuarioValues = {
  nome: '',
  sobrenome: '',
  telefone: '',
  email: '',
  cep: '',
  logradouro: '',
  numero: '',
  complemento: '',
  bairro: '',
  cidade: '',
  uf: '',
};

/** Máscara aplicada a cada campo comum enquanto o usuário digita. */
export const DADOS_USUARIO_MASKS: FieldMasks<DadosUsuarioValues> = {
  telefone: maskPhone,
  cep: maskCep,
  numero: onlyDigits,
  uf: (value) => value.replace(/[^a-zA-Z]/g, '').toUpperCase(),
};

/** Marca como obrigatório cada campo vazio da lista. */
export function requiredErrors<V>(values: V, fields: (keyof V)[]): FormErrors<V> {
  const errors: FormErrors<V> = {};
  for (const field of fields) {
    const value = values[field];
    const empty = typeof value === 'string' ? !value.trim() : value == null;
    if (empty) errors[field] = 'Campo obrigatório.';
  }
  return errors;
}

/** Validação dos campos comuns: obrigatórios e formatos (telefone, e-mail, CEP, número, UF). */
export function validateDadosUsuario(values: DadosUsuarioValues): FormErrors<DadosUsuarioValues> {
  const errors = requiredErrors(values, [
    'nome',
    'sobrenome',
    'telefone',
    'cep',
    'logradouro',
    'numero',
    'bairro',
    'cidade',
    'uf',
  ]);

  if (values.telefone && !isValidPhone(values.telefone)) {
    errors.telefone = 'Informe o DDD e o número (10 ou 11 dígitos).';
  }
  if (values.email && !isValidEmail(values.email)) errors.email = 'E-mail inválido.';
  if (values.cep && !isValidCep(values.cep)) errors.cep = 'O CEP precisa ter 8 dígitos.';
  if (values.numero && Number(values.numero) <= 0) errors.numero = 'Número inválido.';
  if (values.uf && !isValidUf(values.uf)) errors.uf = 'UF inválida. Ex.: SP';

  return errors;
}

/** Texto opcional: vazio vira `undefined` (o campo não é enviado). */
export function optionalText(value: string) {
  const trimmed = value.trim();
  return trimmed ? trimmed : undefined;
}

export function toEnderecoRequest(values: DadosUsuarioValues): EnderecoRequest {
  return {
    cep: onlyDigits(values.cep),
    logradouro: values.logradouro.trim(),
    numero: Number(values.numero),
    complemento: optionalText(values.complemento),
    bairro: values.bairro.trim(),
    cidade: values.cidade.trim(),
    uf: values.uf.toUpperCase(),
  };
}

export function toUsuarioUpdateRequest(values: DadosUsuarioValues): UsuarioUpdateRequest {
  return {
    nome: values.nome.trim(),
    sobrenome: values.sobrenome.trim(),
    telefone: onlyDigits(values.telefone),
    email: optionalText(values.email),
    endereco: toEnderecoRequest(values),
  };
}

/** Dados de GET /usuarios/me no formato do formulário (com máscaras). */
export function usuarioToFormValues(usuario: UsuarioResponse): DadosUsuarioValues {
  const { endereco } = usuario;
  return {
    nome: usuario.nome,
    sobrenome: usuario.sobrenome,
    telefone: maskPhone(usuario.telefone ?? ''),
    email: usuario.email ?? '',
    cep: maskCep(endereco?.cep ?? ''),
    logradouro: endereco?.logradouro ?? '',
    numero: endereco ? String(endereco.numero) : '',
    complemento: endereco?.complemento ?? '',
    bairro: endereco?.bairro ?? '',
    cidade: endereco?.cidade ?? '',
    uf: endereco?.uf ?? '',
  };
}
