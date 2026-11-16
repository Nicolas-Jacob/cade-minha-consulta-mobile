import type { Credencial } from '@/types/api';

/** Tela inicial de cada papel: o gestor tem abas próprias em /gestor. */
export function rotaInicial(credencial: Credencial | undefined) {
  return credencial === 'GESTOR' ? '/gestor' : '/';
}
