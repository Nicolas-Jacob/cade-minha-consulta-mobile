import Ionicons from '@expo/vector-icons/Ionicons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, spacing, typography } from '@/theme';
import type { FilaResponse } from '@/types/api';
import { isoToBrDate } from '@/utils/date';
import { textoPosicaoFila } from '@/utils/fila';

import { Card } from './Card';
import { IconText } from './IconText';
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

        <IconText icon="business-outline">{fila.unidade.nome}</IconText>
        <IconText icon="calendar-outline">{`Pedido em ${dataEntrada}`}</IconText>

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
  posicao: {
    ...typography.bodyBold,
    color: colors.primary,
  },
});
