import type { EspecialidadeResponse, Page, UnidadeResponse } from '@/types/api';

import { api } from './api';

/**
 * O catálogo é pequeno, então as telas de escolha buscam tudo de uma vez
 * (uma página grande, em ordem alfabética) e filtram no próprio aparelho.
 */
const CATALOGO_PAGE = { page: 0, size: 100, sort: 'nome,asc' };

export const catalogoService = {
  async listarEspecialidades() {
    const response = await api.get<Page<EspecialidadeResponse>>('/especialidades', {
      params: CATALOGO_PAGE,
    });
    return response.data.content;
  },

  /** Com `idEspecialidade`, só as unidades que têm médico ativo dessa especialidade. */
  async listarUnidades(idEspecialidade?: number) {
    const response = await api.get<Page<UnidadeResponse>>('/unidades', {
      params: { ...CATALOGO_PAGE, especialidade: idEspecialidade },
    });
    return response.data.content;
  },
};
