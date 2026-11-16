import type { ReactNode } from 'react';
import { StyleSheet, Text } from 'react-native';

import { spacing, typography } from '@/theme';

import { Card } from './Card';

interface FormSectionProps {
  title: string;
  children: ReactNode;
}

/** Agrupa campos de formulário relacionados sob um título. */
export function FormSection({ title, children }: FormSectionProps) {
  return (
    <Card style={styles.card}>
      <Text style={styles.title} accessibilityRole="header">
        {title}
      </Text>
      {children}
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: spacing.md,
  },
  title: {
    ...typography.subtitle,
  },
});
