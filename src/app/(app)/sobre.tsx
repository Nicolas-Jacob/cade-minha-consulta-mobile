import Constants from 'expo-constants';
import { StyleSheet, Text } from 'react-native';

import { Card, Screen } from '@/components';
import { typography } from '@/theme';

// Placeholder: o hash do commit da versão publicada entra em uma próxima etapa.
export default function SobreScreen() {
  return (
    <Screen scroll edges={['bottom', 'left', 'right']}>
      <Card>
        <Text style={styles.title} accessibilityRole="header">
          Cadê minha consulta
        </Text>
        <Text style={styles.body}>
          Aplicativo para acompanhar suas consultas com especialista no SUS, confirmar presença ou
          liberar a vaga para quem está esperando na fila.
        </Text>
        <Text style={styles.caption}>Versão {Constants.expoConfig?.version ?? '-'}</Text>
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: {
    ...typography.subtitle,
  },
  body: {
    ...typography.body,
  },
  caption: {
    ...typography.caption,
  },
});
