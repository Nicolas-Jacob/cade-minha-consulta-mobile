import Ionicons from '@expo/vector-icons/Ionicons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, spacing, typography } from '@/theme';
import type { FilaResponse } from '@/types/api';
import { isoToBrDate } from '@/utils/date';
import { textoPosicaoFila } from '@/utils/fila';

import { Card } from './Card';
import { StatusBadge } from './StatusBadge';

interface FilaCardProps {
  fila: FilaResponse;
  onPress: () => void;
}

/** Resumo de uma solicitação de consulta na lista "Solicitações". */
export function FilaCard({ fila, onPress }: FilaCardProps) {
  const posicao = textoPosicaoFila(fila);
  const dataEntrada = isoToBrDate(fila.dataEntrada);

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${fila.especialidade.nome}, ${fila.unidade.nome}, pedido em ${dataEntrada}`}
      accessibilityHint="Abre os detalhes da solicitação"
      style={({ pressed }) => pressed && styles.pressed}>
      <Card>
        <View style={styles.header}>
          <Text style={styles.especialidade}>{fila.especialidade.nome}</Text>
          <Ionicons name="chevron-forward" size={22} color={colors.textSecondary} />
        </View>

        <StatusBadge status={fila.status} />

        <View style={styles.row}>
          <Ionicons name="business-outline" size={18} color={colors.textSecondary} />
          <Text style={styles.text}>{fila.unidade.nome}</Text>
        </View>
        <View style={styles.row}>
          <Ionicons name="calendar-outline" size={18} color={colors.textSecondary} />
          <Text style={styles.text}>Pedido em {dataEntrada}</Text>
        </View>

        {posicao && <Text style={styles.posicao}>{posicao}</Text>}
      </Card>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pressed: {
    opacity: 0.8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  especialidade: {
    ...typography.subtitle,
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  text: {
    ...typography.body,
    flex: 1,
  },
  posicao: {
    ...typography.bodyBold,
    color: colors.primary,
  },
});
