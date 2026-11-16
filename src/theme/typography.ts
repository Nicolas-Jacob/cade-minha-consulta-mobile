import type { TextStyle } from 'react-native';

import { colors } from './colors';

/** Arquivos da fonte carregados no _layout raiz via expo-font. */
export const fontAssets = {
  'AtkinsonHyperlegible-Regular': require('@/assets/fonts/AtkinsonHyperlegible-Regular.ttf'),
  'AtkinsonHyperlegible-Bold': require('@/assets/fonts/AtkinsonHyperlegible-Bold.ttf'),
};

export const fonts = {
  regular: 'AtkinsonHyperlegible-Regular',
  bold: 'AtkinsonHyperlegible-Bold',
} as const;

export const typography = {
  title: { fontFamily: fonts.bold, fontSize: 26, lineHeight: 32, color: colors.text },
  subtitle: { fontFamily: fonts.bold, fontSize: 20, lineHeight: 26, color: colors.text },
  body: { fontFamily: fonts.regular, fontSize: 16, lineHeight: 24, color: colors.text },
  bodyBold: { fontFamily: fonts.bold, fontSize: 16, lineHeight: 24, color: colors.text },
  label: { fontFamily: fonts.bold, fontSize: 15, lineHeight: 20, color: colors.text },
  caption: { fontFamily: fonts.regular, fontSize: 14, lineHeight: 20, color: colors.textSecondary },
  button: { fontFamily: fonts.bold, fontSize: 16, lineHeight: 22 },
} satisfies Record<string, TextStyle>;
