import { StyleSheet, Text, View } from 'react-native';

import { colors, spacing, typography } from '@/theme';

interface InfoRowProps {
  label: string;
  value: string | null;
}

/** Par rótulo/valor somente leitura, lido como uma frase só pelo leitor de tela. */
export function InfoRow({ label, value }: InfoRowProps) {
  return (
    <View
      style={styles.row}
      accessible
      accessibilityLabel={`${label}: ${value ?? 'não informado'}`}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value ?? 'Não informado'}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    gap: 2,
    paddingVertical: spacing.xs,
  },
  label: {
    ...typography.caption,
  },
  value: {
    ...typography.body,
    color: colors.text,
  },
});
