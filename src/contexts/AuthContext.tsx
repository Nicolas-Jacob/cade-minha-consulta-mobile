import { createContext, useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';

import { setAuthToken, setUnauthorizedHandler } from '@/services/api';
import { authService } from '@/services/authService';
import { tokenStorage } from '@/services/tokenStorage';
import { usuarioService } from '@/services/usuarioService';
import type {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  UsuarioResponse,
  UsuarioResumo,
} from '@/types/api';
import { isUnauthorized } from '@/utils/apiError';

export type AuthStatus = 'loading' | 'signedOut' | 'signedIn';

export interface AuthContextValue {
  status: AuthStatus;
  usuario: UsuarioResumo | null;
  signIn: (data: LoginRequest) => Promise<void>;
  signUp: (data: RegisterRequest) => Promise<void>;
  signOut: () => Promise<void>;
  /** Atualiza o usuário da sessão com os dados mais recentes da API (ex.: após editar o perfil). */
  atualizarUsuario: (usuario: UsuarioResponse) => Promise<void>;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<AuthStatus>('loading');
  const [usuario, setUsuario] = useState<UsuarioResumo | null>(null);

  const signOut = useCallback(async () => {
    setAuthToken(null);
    setUsuario(null);
    setStatus('signedOut');
    await tokenStorage.clear();
  }, []);

  const startSession = useCallback(async ({ token, usuario: novoUsuario }: LoginResponse) => {
    await tokenStorage.save(token, novoUsuario);
    setAuthToken(token);
    setUsuario(novoUsuario);
    setStatus('signedIn');
  }, []);

  const atualizarUsuario = useCallback(async (me: UsuarioResponse) => {
    const resumo: UsuarioResumo = { id: me.id, nome: me.nome, credencial: me.credencial };
    await tokenStorage.saveUsuario(resumo);
    setUsuario(resumo);
  }, []);

  const signIn = useCallback(
    async (data: LoginRequest) => startSession(await authService.login(data)),
    [startSession],
  );

  const signUp = useCallback(
    async (data: RegisterRequest) => startSession(await authService.register(data)),
    [startSession],
  );

  // Qualquer 401 em rota protegida (token expirado ou inválido) encerra a sessão.
  useEffect(() => {
    setUnauthorizedHandler(() => void signOut());
    return () => setUnauthorizedHandler(null);
  }, [signOut]);

  // Restaura a sessão ao abrir o app e confirma com a API que o token ainda vale.
  useEffect(() => {
    async function restoreSession() {
      const token = await tokenStorage.getToken();
      if (!token) {
        setStatus('signedOut');
        return;
      }

      setAuthToken(token);
      try {
        await atualizarUsuario(await usuarioService.getMe());
        setStatus('signedIn');
      } catch (error) {
        const savedUsuario = await tokenStorage.getUsuario();
        if (isUnauthorized(error) || !savedUsuario) {
          await signOut();
          return;
        }
        // Sem conexão com a API: mantém a sessão; cada tela mostra o próprio erro.
        setUsuario(savedUsuario);
        setStatus('signedIn');
      }
    }

    void restoreSession();
  }, [signOut, atualizarUsuario]);

  const value = useMemo(
    () => ({ status, usuario, signIn, signUp, signOut, atualizarUsuario }),
    [status, usuario, signIn, signUp, signOut, atualizarUsuario],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
