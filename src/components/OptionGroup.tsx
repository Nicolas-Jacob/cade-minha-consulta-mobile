import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, MIN_TOUCH_SIZE, radius, spacing, typography } from '@/theme';

interface Option<T extends string> {
  value: T;
  label: string;
}

interface OptionGroupProps<T extends string> {
  /** Lido pelo leitor de tela; também aparece na tela, a menos que `hideLabel` seja true. */
  label: string;
  hideLabel?: boolean;
  options: Option<T>[];
  value: T | null;
  onChange: (value: T) => void;
  error?: string | null;
}

/** Escolha única entre poucas opções (equivalente acessível a um grupo de rádio). */
export function OptionGroup<T extends string>({
  label,
  hideLabel = false,
  options,
  value,
  onChange,
  error,
}: OptionGroupProps<T>) {
  return (
    <View style={styles.container}>
      {!hideLabel && <Text style={styles.label}>{label}</Text>}
      <View style={styles.row} accessibilityRole="radiogroup" accessibilityLabel={label}>
        {options.map((option) => {
          const selected = option.value === value;
          return (
            <Pressable
              key={option.value}
              onPress={() => onChange(option.value)}
              accessibilityRole="radio"
              accessibilityLabel={option.label}
              accessibilityState={{ checked: selected }}
              style={[
                styles.option,
                selected && styles.optionSelected,
                !!error && !selected && styles.optionError,
              ]}>
              <Text style={[styles.optionText, selected && styles.optionTextSelected]}>
                {option.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
      {error && (
        <Text style={styles.error} accessibilityLiveRegion="polite">
          {error}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.xs,
  },
  label: {
    ...typography.label,
  },
  row: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  option: {
    flex: 1,
    minHeight: MIN_TOUCH_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: colors.borderStrong,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
  },
  optionSelected: {
    borderWidth: 2,
    borderColor: colors.primary,
    backgroundColor: colors.primaryLight,
  },
  optionError: {
    borderColor: colors.danger,
  },
  optionText: {
    ...typography.body,
  },
  optionTextSelected: {
    fontFamily: typography.bodyBold.fontFamily,
    color: colors.primary,
  },
  error: {
    ...typography.caption,
    color: colors.danger,
  },
});
