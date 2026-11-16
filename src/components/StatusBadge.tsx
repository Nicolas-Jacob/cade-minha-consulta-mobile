import { StyleSheet, Text, View } from 'react-native';

import { colors, radius, spacing, typography } from '@/theme';
import type { StatusConsulta, StatusFila } from '@/types/api';

type Status = StatusConsulta | StatusFila;

const statusConfig: Record<Status, { label: string; text: string; background: string }> = {
  AGUARDANDO: { label: 'Aguardando vaga', text: colors.warning, background: colors.warningLight },
  AGENDADA: { label: 'Agendada', text: colors.primary, background: colors.primaryLight },
  CONFIRMADA: { label: 'Confirmada', text: colors.success, background: colors.successLight },
  PRESENTE: { label: 'Compareceu', text: colors.success, background: colors.successLight },
  FALTA: { label: 'Faltou', text: colors.danger, background: colors.dangerLight },
  CANCELADA: { label: 'Cancelada', text: colors.neutral, background: colors.neutralLight },
};

export function StatusBadge({ status }: { status: Status }) {
  const config = statusConfig[status];

  return (
    <View
      style={[styles.badge, { backgroundColor: config.background }]}
      accessible
      accessibilityLabel={`Situação: ${config.label}`}>
      <Text style={[styles.text, { color: config.text }]}>{config.label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignSelf: 'flex-start',
    borderRadius: radius.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
  text: {
    ...typography.label,
    fontSize: 14,
  },
});
