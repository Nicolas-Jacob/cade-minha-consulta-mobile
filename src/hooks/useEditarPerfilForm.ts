import { usuarioService } from '@/services/usuarioService';
import type { UsuarioResponse } from '@/types/api';
import {
  toUsuarioUpdateRequest,
  usuarioToFormValues,
  validateDadosUsuario,
} from '@/utils/usuarioForm';

import { useAuth } from './useAuth';
import { useUsuarioForm } from './useUsuarioForm';

/**
 * Formulário de edição do perfil, pré-preenchido com os dados de GET /usuarios/me.
 * Ao enviar, grava com PUT /usuarios/me e atualiza o usuário da sessão (nome da saudação).
 */
export function useEditarPerfilForm(usuario: UsuarioResponse) {
  const { atualizarUsuario } = useAuth();

  return useUsuarioForm({
    initialValues: usuarioToFormValues(usuario),
    validate: validateDadosUsuario,
    onSubmit: async (values) => {
      const atualizado = await usuarioService.updateMe(toUsuarioUpdateRequest(values));
      await atualizarUsuario(atualizado);
    },
  });
}
