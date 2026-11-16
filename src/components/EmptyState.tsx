import Ionicons from '@expo/vector-icons/Ionicons';
import type { ComponentProps } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { colors, spacing, typography } from '@/theme';

import { Button } from './Button';

interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: ComponentProps<typeof Ionicons>['name'];
  action?: { label: string; onPress: () => void };
}

export function EmptyState({
  title,
  description,
  icon = 'file-tray-outline',
  action,
}: EmptyStateProps) {
  return (
    <View style={styles.container}>
      <Ionicons name={icon} size={56} color={colors.primary} accessibilityElementsHidden />
      <Text style={styles.title} accessibilityRole="header">
        {title}
      </Text>
      {description && <Text style={styles.description}>{description}</Text>}
      {action && <Button title={action.label} onPress={action.onPress} style={styles.action} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing.md,
  },
  title: {
    ...typography.subtitle,
    textAlign: 'center',
  },
  description: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  action: {
    marginTop: spacing.md,
    alignSelf: 'stretch',
  },
});
