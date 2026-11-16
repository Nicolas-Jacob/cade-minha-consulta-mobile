import { colors } from './colors';
import { fonts } from './typography';

/** Aparência padrão dos cabeçalhos (Stack e Tabs). */
export const headerOptions = {
  headerStyle: { backgroundColor: colors.surface },
  headerTintColor: colors.primary,
  headerTitleStyle: { fontFamily: fonts.bold, color: colors.text },
  headerShadowVisible: true,
} as const;

/** Aparência padrão das abas (cidadão e gestor). */
export const tabsScreenOptions = {
  ...headerOptions,
  tabBarActiveTintColor: colors.primary,
  tabBarInactiveTintColor: colors.textSecondary,
  tabBarLabelStyle: { fontFamily: fonts.bold, fontSize: 12 },
  tabBarStyle: { backgroundColor: colors.surface, borderTopColor: colors.border },
  sceneStyle: { backgroundColor: colors.background },
} as const;
