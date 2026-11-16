import * as SecureStore from 'expo-secure-store';

import type { UsuarioResumo } from '@/types/api';

const TOKEN_KEY = 'cmc.token';
const USUARIO_KEY = 'cmc.usuario';

/** Persistência da sessão no armazenamento seguro do aparelho (Keychain / Keystore). */
export const tokenStorage = {
  async save(token: string, usuario: UsuarioResumo) {
    await SecureStore.setItemAsync(TOKEN_KEY, token);
    await SecureStore.setItemAsync(USUARIO_KEY, JSON.stringify(usuario));
  },

  async saveUsuario(usuario: UsuarioResumo) {
    await SecureStore.setItemAsync(USUARIO_KEY, JSON.stringify(usuario));
  },

  getToken() {
    return SecureStore.getItemAsync(TOKEN_KEY);
  },

  async getUsuario(): Promise<UsuarioResumo | null> {
    const value = await SecureStore.getItemAsync(USUARIO_KEY);
    if (!value) return null;
    try {
      return JSON.parse(value) as UsuarioResumo;
    } catch {
      return null;
    }
  },

  async clear() {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
    await SecureStore.deleteItemAsync(USUARIO_KEY);
  },
};
