import { useCallback, useRef, useState } from 'react';

import { buscarEnderecoPorCep, type EnderecoViaCep } from '@/services/viaCepService';
import { onlyDigits } from '@/utils/masks';

/**
 * Busca o endereço no ViaCEP quando o CEP fica completo (8 dígitos).
 * Chama `onFound` com o endereço encontrado; erros viram mensagem em `error`.
 */
export function useCepLookup(onFound: (endereco: EnderecoViaCep) => void) {
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const lastCep = useRef<string | null>(null);

  const lookup = useCallback(
    async (value: string) => {
      const cep = onlyDigits(value);
      if (cep.length !== 8) {
        lastCep.current = null;
        setSearching(false);
        setError(null);
        return;
      }
      if (cep === lastCep.current) return;

      lastCep.current = cep;
      setSearching(true);
      setError(null);
      try {
        const endereco = await buscarEnderecoPorCep(cep);
        if (lastCep.current !== cep) return; // o usuário já digitou outro CEP
        if (endereco) {
          onFound(endereco);
        } else {
          setError('CEP não encontrado. Confira o número ou preencha o endereço.');
        }
      } catch {
        if (lastCep.current === cep) {
          setError('Não foi possível buscar o CEP agora. Preencha o endereço manualmente.');
        }
      } finally {
        if (lastCep.current === cep) setSearching(false);
      }
    },
    [onFound],
  );

  return { lookup, searching, error };
}
