import { useCallback, useState } from 'react';

import type { EnderecoViaCep } from '@/services/viaCepService';
import type { RegisterRequest, Sexo } from '@/types/api';
import { getErrorMessage, getFieldErrors } from '@/utils/apiError';
import { brDateToIso } from '@/utils/date';
import { maskCep, maskCpf, maskDate, maskPhone, onlyDigits } from '@/utils/masks';
import {
  isValidBirthDate,
  isValidCep,
  isValidCpf,
  isValidEmail,
  isValidPhone,
  isValidUf,
} from '@/utils/validators';

import { useAuth } from './useAuth';
import { useCepLookup } from './useCepLookup';

export interface CadastroValues {
  nome: string;
  sobrenome: string;
  cpf: string;
  sexo: Sexo | null;
  dataNascimento: string;
  nomeMae: string;
  nomePai: string;
  telefone: string;
  email: string;
  cep: string;
  logradouro: string;
  numero: string;
  complemento: string;
  bairro: string;
  cidade: string;
  uf: string;
  login: string;
  senha: string;
  confirmarSenha: string;
}

export type CadastroField = keyof CadastroValues;
type CadastroErrors = Partial<Record<CadastroField, string>>;

const INITIAL_VALUES: CadastroValues = {
  nome: '',
  sobrenome: '',
  cpf: '',
  sexo: null,
  dataNascimento: '',
  nomeMae: '',
  nomePai: '',
  telefone: '',
  email: '',
  cep: '',
  logradouro: '',
  numero: '',
  complemento: '',
  bairro: '',
  cidade: '',
  uf: '',
  login: '',
  senha: '',
  confirmarSenha: '',
};

/** Máscara aplicada a cada campo enquanto o usuário digita. */
const FIELD_MASKS: Partial<Record<CadastroField, (value: string) => string>> = {
  cpf: maskCpf,
  telefone: maskPhone,
  cep: maskCep,
  dataNascimento: maskDate,
  numero: onlyDigits,
  uf: (value) => value.replace(/[^a-zA-Z]/g, '').toUpperCase(),
  login: (value) => value.trim(),
};

const REQUIRED_FIELDS: CadastroField[] = [
  'nome',
  'sobrenome',
  'cpf',
  'sexo',
  'dataNascimento',
  'nomeMae',
  'telefone',
  'cep',
  'logradouro',
  'numero',
  'bairro',
  'cidade',
  'uf',
  'login',
  'senha',
  'confirmarSenha',
];

function validate(values: CadastroValues): CadastroErrors {
  const errors: CadastroErrors = {};

  for (const field of REQUIRED_FIELDS) {
    if (!values[field]?.toString().trim()) errors[field] = 'Campo obrigatório.';
  }

  if (values.cpf && !isValidCpf(values.cpf)) errors.cpf = 'CPF inválido. Confira os números.';
  if (values.dataNascimento && !isValidBirthDate(values.dataNascimento)) {
    errors.dataNascimento = 'Data inválida. Use o formato dd/mm/aaaa.';
  }
  if (values.telefone && !isValidPhone(values.telefone)) {
    errors.telefone = 'Informe o DDD e o número (10 ou 11 dígitos).';
  }
  if (values.email && !isValidEmail(values.email)) errors.email = 'E-mail inválido.';
  if (values.cep && !isValidCep(values.cep)) errors.cep = 'O CEP precisa ter 8 dígitos.';
  if (values.numero && Number(values.numero) <= 0) errors.numero = 'Número inválido.';
  if (values.uf && !isValidUf(values.uf)) errors.uf = 'UF inválida. Ex.: SP';
  if (values.login.length > 20) errors.login = 'Use no máximo 20 caracteres.';
  if (values.senha && values.senha.length < 6) {
    errors.senha = 'A senha precisa ter pelo menos 6 caracteres.';
  }
  if (values.confirmarSenha && values.confirmarSenha !== values.senha) {
    errors.confirmarSenha = 'As senhas não são iguais.';
  }

  return errors;
}

function optionalText(value: string) {
  const trimmed = value.trim();
  return trimmed ? trimmed : undefined;
}

function toRegisterRequest(values: CadastroValues): RegisterRequest {
  return {
    nome: values.nome.trim(),
    sobrenome: values.sobrenome.trim(),
    cpf: onlyDigits(values.cpf),
    sexo: values.sexo as Sexo,
    dataNascimento: brDateToIso(values.dataNascimento) as string,
    nomeMae: values.nomeMae.trim(),
    nomePai: optionalText(values.nomePai),
    login: values.login.trim(),
    senha: values.senha,
    telefone: onlyDigits(values.telefone),
    email: optionalText(values.email),
    endereco: {
      cep: onlyDigits(values.cep),
      logradouro: values.logradouro.trim(),
      numero: Number(values.numero),
      complemento: optionalText(values.complemento),
      bairro: values.bairro.trim(),
      cidade: values.cidade.trim(),
      uf: values.uf.toUpperCase(),
    },
  };
}

export function useCadastroForm() {
  const { signUp } = useAuth();
  const [values, setValues] = useState<CadastroValues>(INITIAL_VALUES);
  const [errors, setErrors] = useState<CadastroErrors>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const fillAddress = useCallback((endereco: EnderecoViaCep) => {
    setValues((current) => ({
      ...current,
      logradouro: endereco.logradouro || current.logradouro,
      bairro: endereco.bairro || current.bairro,
      cidade: endereco.cidade || current.cidade,
      uf: endereco.uf || current.uf,
    }));
    setErrors((current) => ({
      ...current,
      logradouro: undefined,
      bairro: undefined,
      cidade: undefined,
      uf: undefined,
    }));
  }, []);

  const cepLookup = useCepLookup(fillAddress);

  function setField<K extends CadastroField>(field: K, value: CadastroValues[K]) {
    const mask = FIELD_MASKS[field];
    const nextValue = (
      mask && typeof value === 'string' ? mask(value) : value
    ) as CadastroValues[K];

    setValues((current) => ({ ...current, [field]: nextValue }));
    setErrors((current) => ({ ...current, [field]: undefined }));
    if (field === 'cep') void cepLookup.lookup(nextValue as string);
  }

  /** Valida e envia. Devolve true se o cadastro (e o login automático) deu certo. */
  async function submit() {
    setSubmitError(null);
    const validationErrors = validate(values);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) {
      setSubmitError('Confira os campos destacados em vermelho.');
      return false;
    }

    setSubmitting(true);
    try {
      await signUp(toRegisterRequest(values));
      return true;
    } catch (error) {
      setErrors(getFieldErrors(error));
      setSubmitError(getErrorMessage(error));
      return false;
    } finally {
      setSubmitting(false);
    }
  }

  return {
    values,
    errors,
    setField,
    submit,
    submitting,
    submitError,
    cepSearching: cepLookup.searching,
    cepError: cepLookup.error,
  };
}
