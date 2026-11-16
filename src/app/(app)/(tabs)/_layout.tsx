import { Redirect, Tabs } from 'expo-router';

import { tabIcon } from '@/components';
import { useAuth } from '@/hooks/useAuth';
import { tabsScreenOptions } from '@/theme';
import { rotaInicial } from '@/utils/rotas';

/** Abas do cidadão. O gestor tem abas próprias em /gestor. */
export default function TabsLayout() {
  const { usuario } = useAuth();

  if (usuario?.credencial === 'GESTOR') return <Redirect href={rotaInicial(usuario.credencial)} />;

  return (
    <Tabs screenOptions={tabsScreenOptions}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Início',
          tabBarIcon: tabIcon('home-outline', 'home'),
        }}
      />
      <Tabs.Screen
        name="consultas"
        options={{
          title: 'Consultas',
          tabBarIcon: tabIcon('calendar-outline', 'calendar'),
        }}
      />
      <Tabs.Screen
        name="filas"
        options={{
          title: 'Solicitações',
          tabBarIcon: tabIcon('document-text-outline', 'document-text'),
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
