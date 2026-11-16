import { Redirect, Stack } from 'expo-router';

import { useAuth } from '@/hooks/useAuth';
import { colors, headerOptions } from '@/theme';
import { rotaInicial } from '@/utils/rotas';

/**
 * Telas públicas: com sessão ativa (após login ou cadastro), vai para a tela inicial
 * do papel (abas do cidadão ou do gestor).
 */
export default function AuthLayout() {
  const { status, usuario } = useAuth();

  if (status === 'signedIn') return <Redirect href={rotaInicial(usuario?.credencial)} />;

  return (
    <Stack
      screenOptions={{ ...headerOptions, contentStyle: { backgroundColor: colors.background } }}>
      <Stack.Screen name="login" options={{ headerShown: false }} />
      <Stack.Screen name="cadastro" options={{ title: 'Criar conta' }} />
    </Stack>
  );
}
