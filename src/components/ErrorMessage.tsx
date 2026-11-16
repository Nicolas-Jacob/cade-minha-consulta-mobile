import Ionicons from '@expo/vector-icons/Ionicons';
import { StyleSheet, Text, View } from 'react-native';

import { colors, radius, spacing, typography } from '@/theme';

import { Button } from './Button';

interface ErrorMessageProps {
  message: string;
  /** Quando informado, mostra o botão "Tentar novamente". */
  onRetry?: () => void;
}

export function ErrorMessage({ message, onRetry }: ErrorMessageProps) {
  return (
    <View style={styles.container} accessibilityRole="alert">
      <View style={styles.row}>
        <Ionicons name="alert-circle" size={24} color={colors.danger} />
        <Text style={styles.message}>{message}</Text>
      </View>
      {onRetry && (
        <Button
          title="Tentar novamente"
          icon="refresh"
          variant="secondary"
          onPress={onRetry}
          accessibilityHint="Faz a busca outra vez"
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.dangerLight,
    borderRadius: radius.md,
    borderLeftWidth: 4,
    borderLeftColor: colors.danger,
    padding: spacing.md,
    gap: spacing.md,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
  },
  message: {
    ...typography.body,
    flex: 1,
    color: colors.danger,
  },
});
