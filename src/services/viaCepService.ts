const VIACEP_URL = 'https://viacep.com.br/ws';
const TIMEOUT_MS = 10000;

export interface EnderecoViaCep {
  logradouro: string;
  bairro: string;
  cidade: string;
  uf: string;
}

interface ViaCepResponse {
  logradouro?: string;
  bairro?: string;
  localidade?: string;
  uf?: string;
  erro?: boolean | string;
}

/**
 * Busca o endereço de um CEP (8 dígitos) no ViaCEP.
 * Devolve null quando o CEP não existe; lança erro em falha de rede.
 */
export async function buscarEnderecoPorCep(cep: string): Promise<EnderecoViaCep | null> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const response = await fetch(`${VIACEP_URL}/${cep}/json/`, { signal: controller.signal });
    if (response.status === 400) return null;
    if (!response.ok) throw new Error(`ViaCEP respondeu ${response.status}`);

    const data = (await response.json()) as ViaCepResponse;
    if (data.erro) return null;

    return {
      logradouro: data.logradouro ?? '',
      bairro: data.bairro ?? '',
      cidade: data.localidade ?? '',
      uf: data.uf ?? '',
    };
  } finally {
    clearTimeout(timeout);
  }
}
