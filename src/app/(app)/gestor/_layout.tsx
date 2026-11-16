import { Redirect, Tabs } from 'expo-router';

import { tabIcon } from '@/components';
import { useAuth } from '@/hooks/useAuth';
import { tabsScreenOptions } from '@/theme';
import { rotaInicial } from '@/utils/rotas';

/** Abas do gestor da unidade. O cidadão que chegar aqui volta para as próprias abas. */
export default function GestorTabsLayout() {
  const { usuario } = useAuth();

  if (usuario?.credencial !== 'GESTOR') return <Redirect href={rotaInicial(usuario?.credencial)} />;

  return (
    <Tabs screenOptions={tabsScreenOptions}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Painel',
          headerTitle: 'Próximas consultas',
          tabBarIcon: tabIcon('grid-outline', 'grid'),
        }}
      />
      <Tabs.Screen
        name="agendar"
        options={{
          title: 'Agendar',
          headerTitle: 'Agendar pela fila',
          tabBarIcon: tabIcon('add-circle-outline', 'add-circle'),
        }}
      />
      <Tabs.Screen
        name="risco"
        options={{
          title: 'Risco de falta',
          tabBarIcon: tabIcon('alert-circle-outline', 'alert-circle'),
        }}
      />
      <Tabs.Screen
        name="perfil"
        options={{
          title: 'Perfil',
          tabBarIcon: tabIcon('person-outline', 'person'),
        }}
      />
    </Tabs>
  );
}
