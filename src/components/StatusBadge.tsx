import { colors } from '@/theme';
import type { StatusConsulta, StatusFila } from '@/types/api';

import { Badge } from './Badge';

type Status = StatusConsulta | StatusFila;

const statusConfig: Record<Status, { label: string; color: string; background: string }> = {
  AGUARDANDO: { label: 'Aguardando vaga', color: colors.warning, background: colors.warningLight },
  AGENDADA: { label: 'Agendada', color: colors.primary, background: colors.primaryLight },
  CONFIRMADA: { label: 'Confirmada', color: colors.success, background: colors.successLight },
  PRESENTE: { label: 'Compareceu', color: colors.success, background: colors.successLight },
  FALTA: { label: 'Faltou', color: colors.danger, background: colors.dangerLight },
  CANCELADA: { label: 'Cancelada', color: colors.neutral, background: colors.neutralLight },
};

export function StatusBadge({ status }: { status: Status }) {
  const config = statusConfig[status];
  return <Badge {...config} accessibilityLabel={`Situação: ${config.label}`} />;
}
