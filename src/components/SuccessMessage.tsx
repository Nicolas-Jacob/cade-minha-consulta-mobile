import Ionicons from '@expo/vector-icons/Ionicons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, MIN_TOUCH_SIZE, radius, spacing, typography } from '@/theme';

interface SuccessMessageProps {
  message: string;
  /** Quando informado, mostra o botão de fechar o aviso. */
  onDismiss?: () => void;
}

export function SuccessMessage({ message, onDismiss }: SuccessMessageProps) {
  return (
    <View style={styles.container} accessibilityLiveRegion="polite">
      <Ionicons name="checkmark-circle" size={24} color={colors.success} />
      <Text style={styles.message} accessibilityRole="alert">
        {message}
      </Text>
      {onDismiss && (
        <Pressable
          onPress={onDismiss}
          accessibilityRole="button"
          accessibilityLabel="Fechar aviso"
          style={styles.close}>
          <Ionicons name="close" size={22} color={colors.success} />
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.successLight,
    borderRadius: radius.md,
    borderLeftWidth: 4,
    borderLeftColor: colors.success,
    paddingVertical: spacing.xs,
    paddingLeft: spacing.md,
  },
  message: {
    ...typography.body,
    flex: 1,
    color: colors.success,
    paddingVertical: spacing.sm,
  },
  close: {
    width: MIN_TOUCH_SIZE,
    height: MIN_TOUCH_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
