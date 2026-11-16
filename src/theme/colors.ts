/**
 * Paleta do app. Todos os pares de texto/fundo usados atendem ao contraste
 * mínimo WCAG AA (4,5:1). Só tema claro nesta etapa.
 */
export const colors = {
  primary: '#0B5CAD',
  primaryDark: '#084682',
  primaryLight: '#E3EEF9',
  onPrimary: '#FFFFFF',

  success: '#1E7B4F',
  successLight: '#E3F4EA',

  danger: '#B3261E',
  dangerLight: '#FDE7E5',

  warning: '#8A5300',
  warningLight: '#FFF3DC',

  neutral: '#4F5D6B',
  neutralLight: '#ECEFF2',

  text: '#1B2733',
  textSecondary: '#4F5D6B',
  background: '#F5F8FB',
  surface: '#FFFFFF',
  border: '#D5DEE7',
  borderStrong: '#7A8896',
} as const;
