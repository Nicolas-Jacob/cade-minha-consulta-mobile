import { colors } from './colors';
import { fonts } from './typography';

/** Aparência padrão dos cabeçalhos (Stack e Tabs). */
export const headerOptions = {
  headerStyle: { backgroundColor: colors.surface },
  headerTintColor: colors.primary,
  headerTitleStyle: { fontFamily: fonts.bold, color: colors.text },
  headerShadowVisible: true,
} as const;
