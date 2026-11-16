import Ionicons from '@expo/vector-icons/Ionicons';
import { useState, type Ref } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  type TextInputInstance,
  type TextInputProps,
} from 'react-native';

import { colors, fonts, MIN_TOUCH_SIZE, radius, spacing, typography } from '@/theme';

interface InputProps extends Omit<TextInputProps, 'style'> {
  label: string;
  error?: string | null;
  hint?: string | null;
  /** Mostra "(opcional)" ao lado do rótulo. */
  optional?: boolean;
  /** Mostra o botão de exibir/ocultar senha. */
  password?: boolean;
  ref?: Ref<TextInputInstance>;
}

export function Input({
  label,
  error,
  hint,
  optional = false,
  password = false,
  ref,
  ...textInputProps
}: InputProps) {
  const [focused, setFocused] = useState(false);
  const [hidden, setHidden] = useState(password);
  const message = error ?? hint;

  const borderColor = error ? colors.danger : focused ? colors.primary : colors.borderStrong;

  return (
    <View style={styles.container}>
      <Text style={styles.label}>
        {label}
        {optional && <Text style={styles.optional}> (opcional)</Text>}
      </Text>

      <View style={[styles.field, { borderColor }, focused && styles.fieldFocused]}>
        <TextInput
          ref={ref}
          accessibilityLabel={label}
          accessibilityHint={message ?? undefined}
          placeholderTextColor={colors.textSecondary}
          secureTextEntry={hidden}
          style={styles.input}
          {...textInputProps}
          onFocus={(event) => {
            setFocused(true);
            textInputProps.onFocus?.(event);
          }}
          onBlur={(event) => {
            setFocused(false);
            textInputProps.onBlur?.(event);
          }}
        />
        {password && (
          <Pressable
            onPress={() => setHidden((value) => !value)}
            accessibilityRole="button"
            accessibilityLabel={hidden ? 'Mostrar senha' : 'Ocultar senha'}
            hitSlop={4}
            style={styles.iconButton}>
            <Ionicons
              name={hidden ? 'eye-outline' : 'eye-off-outline'}
              size={22}
              color={colors.textSecondary}
            />
          </Pressable>
        )}
      </View>

      {message && (
        <Text
          style={[styles.message, error ? styles.error : null]}
          accessibilityLiveRegion="polite">
          {message}
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
  optional: {
    fontFamily: fonts.regular,
    color: colors.textSecondary,
  },
  field: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: MIN_TOUCH_SIZE,
    borderWidth: 1.5,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
  },
  fieldFocused: {
    borderWidth: 2,
  },
  input: {
    ...typography.body,
    flex: 1,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  iconButton: {
    width: MIN_TOUCH_SIZE,
    height: MIN_TOUCH_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  message: {
    ...typography.caption,
  },
  error: {
    color: colors.danger,
  },
});
