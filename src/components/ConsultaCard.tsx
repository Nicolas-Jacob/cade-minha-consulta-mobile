import Ionicons from '@expo/vector-icons/Ionicons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, spacing, typography } from '@/theme';
import type { ConsultaResponse } from '@/types/api';
import { isoToBrDateTime } from '@/utils/date';

import { Card } from './Card';
import { IconText } from './IconText';
import { StatusBadge } from './StatusBadge';

interface ConsultaCardProps {
  consulta: ConsultaResponse;
  onPress: () => void;
}

/** Resumo de uma consulta na lista "Minhas consultas". */
export function ConsultaCard({ consulta, onPress }: ConsultaCardProps) {
  const dataHora = isoToBrDateTime(consulta.dataHora);

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${consulta.especialidade.nome}, ${dataHora}, ${consulta.unidade.nome}`}
      accessibilityHint="Abre os detalhes da consulta"
      style={({ pressed }) => pressed && styles.pressed}>
      <Card>
        <View style={styles.header}>
          <Text style={styles.especialidade}>{consulta.especialidade.nome}</Text>
          <Ionicons name="chevron-forward" size={22} color={colors.textSecondary} />
        </View>

        <StatusBadge status={consulta.status} />

        <IconText icon="calendar-outline" textStyle={styles.dataHora}>
          {dataHora}
        </IconText>
        <IconText icon="business-outline">{consulta.unidade.nome}</IconText>
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
  dataHora: {
    ...typography.bodyBold,
  },
});
