import Ionicons from '@expo/vector-icons/Ionicons';
import type { ComponentProps } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { radius, spacing, typography } from '@/theme';

export interface BadgeProps {
  label: string;
  /** Cor do texto (e do ícone). O par cor/fundo precisa ter contraste AA. */
  color: string;
  background: string;
  icon?: ComponentProps<typeof Ionicons>['name'];
  /** Se omitido, o leitor de tela lê o próprio rótulo. */
  accessibilityLabel?: string;
}

/** Selo arredondado com texto curto (situação, nível de risco, origem do texto...). */
export function Badge({ label, color, background, icon, accessibilityLabel }: BadgeProps) {
  return (
    <View
      style={[styles.badge, { backgroundColor: background }]}
      accessible
      accessibilityLabel={accessibilityLabel ?? label}>
      {icon && <Ionicons name={icon} size={14} color={color} />}
      <Text style={[styles.text, { color }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
  text: {
    ...typography.label,
    fontSize: 14,
  },
});
