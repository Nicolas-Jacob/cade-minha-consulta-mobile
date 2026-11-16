import Ionicons from '@expo/vector-icons/Ionicons';
import type { ComponentProps } from 'react';
import { StyleSheet, Text, View, type TextStyle } from 'react-native';

import { colors, spacing, typography } from '@/theme';

interface IconTextProps {
  icon: ComponentProps<typeof Ionicons>['name'];
  children: string;
  textStyle?: TextStyle;
}

/** Linha com um ícone decorativo à esquerda e um texto (usada nos cards das listas). */
export function IconText({ icon, children, textStyle }: IconTextProps) {
  return (
    <View style={styles.row}>
      <Ionicons
        name={icon}
        size={18}
        color={colors.textSecondary}
        style={styles.icon}
        accessibilityElementsHidden
        importantForAccessibility="no"
      />
      <Text style={[styles.text, textStyle]}>{children}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
  },
  // Alinha o ícone com a primeira linha do texto quando ele quebra em várias linhas.
  icon: {
    marginTop: 3,
  },
  text: {
    ...typography.body,
    flex: 1,
  },
});
