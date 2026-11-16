import { colors } from '@/theme';
import type { NivelRisco } from '@/types/api';

interface RiscoConfig {
  label: string;
  color: string;
  background: string;
}

const RISCO_POR_NIVEL: Record<NivelRisco, RiscoConfig> = {
  BAIXO: { label: 'Risco baixo', color: colors.success, background: colors.successLight },
  MEDIO: { label: 'Risco médio', color: colors.warning, background: colors.warningLight },
  ALTO: { label: 'Risco alto', color: colors.danger, background: colors.dangerLight },
};

/** Enquanto o modelo de ML não estiver integrado, a API devolve `nivel` null. */
const SEM_MODELO: RiscoConfig = {
  label: 'Aguardando modelo',
  color: colors.neutral,
  background: colors.neutralLight,
};

/** Rótulo e cores do selo de risco de falta. */
export function riscoConfig(nivel: NivelRisco | null): RiscoConfig {
  return nivel ? RISCO_POR_NIVEL[nivel] : SEM_MODELO;
}

/** 0.42 → "42%"; null quando o modelo ainda não calculou o risco. */
export function textoPercentualRisco(risco: number | null) {
  return risco === null ? null : `${Math.round(risco * 100)}%`;
}
