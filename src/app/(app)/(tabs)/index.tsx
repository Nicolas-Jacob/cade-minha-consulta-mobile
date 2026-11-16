import { StyleSheet, Text } from 'react-native';

import { CidadaoOnly, EmptyState, Screen } from '@/components';
import { useAuth } from '@/hooks/useAuth';
import { typography } from '@/theme';

// Placeholder: a próxima consulta em destaque (GET /consultas/minhas) entra na próxima etapa.
export default function InicioScreen() {
  const { usuario } = useAuth();

  return (
    <CidadaoOnly>
      <Screen scroll>
        <Text style={styles.greeting} accessibilityRole="header">
          Olá, {usuario?.nome}!
        </Text>
        <EmptyState
          icon="calendar-clear-outline"
          title="Em breve"
          description="Aqui você vai ver sua próxima consulta e atalhos para as principais ações."
        />
      </Screen>
    </CidadaoOnly>
  );
}

const styles = StyleSheet.create({
  greeting: {
    ...typography.title,
  },
});
