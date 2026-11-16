import { Redirect, Stack } from 'expo-router';

import { useAuth } from '@/hooks/useAuth';
import { colors, headerOptions } from '@/theme';

/** Telas públicas: com sessão ativa (após login ou cadastro), vai para a aba Início. */
export default function AuthLayout() {
  const { status } = useAuth();

  if (status === 'signedIn') return <Redirect href="/" />;

  return (
    <Stack
      screenOptions={{ ...headerOptions, contentStyle: { backgroundColor: colors.background } }}>
      <Stack.Screen name="login" options={{ headerShown: false }} />
      <Stack.Screen name="cadastro" options={{ title: 'Criar conta' }} />
    </Stack>
  );
}
