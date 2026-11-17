import { useCallback, useState } from 'react';

import type { EnderecoViaCep } from '@/services/viaCepService';
import { getErrorMessage, getFieldErrors } from '@/utils/apiError';
import {
  DADOS_USUARIO_MASKS,
  type DadosUsuarioValues,
  type FieldMasks,
  type FormErrors,
} from '@/utils/usuarioForm';

import { useCepLookup } from './useCepLookup';

interface UsuarioFormOptions<V extends DadosUsuarioValues> {
  initialValues: V;
  /** Máscaras extras, além das de telefone, CEP, número e UF. */
  masks?: FieldMasks<V>;
  validate: (values: V) => FormErrors<V>;
  /** Envia os dados para a API. Um erro lançado aqui aparece no formulário. */
  onSubmit: (values: V) => Promise<void>;
}

/**
 * Estado dos formulários de dados do usuário (cadastro e edição do perfil):
 * máscaras, endereço preenchido pelo CEP, validação e erros da API por campo.
 */
export function useUsuarioForm<V extends DadosUsuarioValues>({
  initialValues,
  masks,
  validate,
  onSubmit,
}: UsuarioFormOptions<V>) {
  const [values, setValues] = useState<V>(initialValues);
  const [errors, setErrors] = useState<FormErrors<V>>({});
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
  // As chaves de DadosUsuarioValues também são chaves de V (V estende DadosUsuarioValues).
  const allMasks = { ...DADOS_USUARIO_MASKS, ...masks } as FieldMasks<V>;

  function setField<K extends keyof V>(field: K, value: V[K]) {
    const mask = allMasks[field];
    const nextValue = (mask && typeof value === 'string' ? mask(value) : value) as V[K];

    setValues((current) => ({ ...current, [field]: nextValue }));
    setErrors((current) => ({ ...current, [field]: undefined }));
    if (field === 'cep') void cepLookup.lookup(nextValue as string);
  }

  /** Valida e envia. Devolve true se a API aceitou os dados. */
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
      await onSubmit(values);
      return true;
    } catch (error) {
      setErrors(getFieldErrors(error) as FormErrors<V>);
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
