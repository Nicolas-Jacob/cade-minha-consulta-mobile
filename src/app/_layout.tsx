import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';

import { AuthProvider } from '@/contexts/AuthContext';
import { useAuth } from '@/hooks/useAuth';
import { colors, fontAssets } from '@/theme';

void SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts(fontAssets);

  // Sem a fonte não há o que desenhar; se ela falhar, o app segue com a fonte do sistema.
  if (!fontsLoaded && !fontError) return null;

  return (
    <AuthProvider>
      <StatusBar style="dark" />
      <RootNavigator />
    </AuthProvider>
  );
}

/**
 * Os dois grupos ficam sempre registrados, para que toda rota ("/", "/login"...) exista.
 * Quem decide o acesso são os layouts de cada grupo, que redirecionam conforme a sessão:
 * (app)/_layout manda para /login sem sessão; (auth)/_layout manda, com sessão, para "/"
 * (abas do cidadão) ou "/gestor" (abas do gestor).
 */
function RootNavigator() {
  const { status } = useAuth();

  // Mantém o splash até saber se existe sessão salva.
  useEffect(() => {
    if (status !== 'loading') void SplashScreen.hideAsync();
  }, [status]);

  return (
    <Stack
      screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.background } }}>
      <Stack.Screen name="(app)" />
      <Stack.Screen name="(auth)" />
    </Stack>
  );
}
