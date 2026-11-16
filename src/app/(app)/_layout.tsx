import { Redirect, Stack } from 'expo-router';

import { useAuth } from '@/hooks/useAuth';
import { colors, headerOptions } from '@/theme';

/** Grupo protegido: sem sessão, qualquer rota daqui (inclusive "/") vai para o login. */
export default function AppLayout() {
  const { status } = useAuth();

  // Enquanto a sessão é restaurada o splash continua visível.
  if (status === 'loading') return null;
  if (status === 'signedOut') return <Redirect href="/login" />;

  return (
    <Stack
      screenOptions={{
        ...headerOptions,
        headerBackButtonDisplayMode: 'minimal',
        contentStyle: { backgroundColor: colors.background },
      }}>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="sobre" options={{ title: 'Sobre o app' }} />
    </Stack>
  );
}
