import type { RegisterRequest, Sexo } from '@/types/api';
import { brDateToIso } from '@/utils/date';
import { maskCpf, maskDate, onlyDigits } from '@/utils/masks';
import {
  EMPTY_DADOS_USUARIO,
  optionalText,
  requiredErrors,
  toEnderecoRequest,
  validateDadosUsuario,
  type DadosUsuarioValues,
  type FieldMasks,
  type FormErrors,
} from '@/utils/usuarioForm';
import { isValidBirthDate, isValidCpf } from '@/utils/validators';

import { useAuth } from './useAuth';
import { useUsuarioForm } from './useUsuarioForm';

export interface CadastroValues extends DadosUsuarioValues {
  cpf: string;
  sexo: Sexo | null;
  dataNascimento: string;
  nomeMae: string;
  nomePai: string;
  login: string;
  senha: string;
  confirmarSenha: string;
}

export type CadastroField = keyof CadastroValues;

const INITIAL_VALUES: CadastroValues = {
  ...EMPTY_DADOS_USUARIO,
  cpf: '',
  sexo: null,
  dataNascimento: '',
  nomeMae: '',
  nomePai: '',
  login: '',
  senha: '',
  confirmarSenha: '',
};

/** Máscaras dos campos que só existem no cadastro. */
const CADASTRO_MASKS: FieldMasks<CadastroValues> = {
  cpf: maskCpf,
  dataNascimento: maskDate,
  login: (value) => value.trim(),
};

function validate(values: CadastroValues): FormErrors<CadastroValues> {
  const errors: FormErrors<CadastroValues> = {
    ...validateDadosUsuario(values),
    ...requiredErrors(values, [
      'cpf',
      'sexo',
      'dataNascimento',
      'nomeMae',
      'login',
      'senha',
      'confirmarSenha',
    ]),
  };

  if (values.cpf && !isValidCpf(values.cpf)) errors.cpf = 'CPF inválido. Confira os números.';
  if (values.dataNascimento && !isValidBirthDate(values.dataNascimento)) {
    errors.dataNascimento = 'Data inválida. Use o formato dd/mm/aaaa.';
  }
  if (values.login.length > 20) errors.login = 'Use no máximo 20 caracteres.';
  if (values.senha && values.senha.length < 6) {
    errors.senha = 'A senha precisa ter pelo menos 6 caracteres.';
  }
  if (values.confirmarSenha && values.confirmarSenha !== values.senha) {
    errors.confirmarSenha = 'As senhas não são iguais.';
  }

  return errors;
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
    endereco: toEnderecoRequest(values),
  };
}

/** Formulário de cadastro: ao enviar, cria a conta e já entra no aplicativo. */
export function useCadastroForm() {
  const { signUp } = useAuth();

  return useUsuarioForm<CadastroValues>({
    initialValues: INITIAL_VALUES,
    masks: CADASTRO_MASKS,
    validate,
    onSubmit: (values) => signUp(toRegisterRequest(values)),
  });
}
