import Ionicons from '@expo/vector-icons/Ionicons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, spacing, typography } from '@/theme';
import type { RiscoFaltaResponse } from '@/types/api';
import { isoToBrDateTime } from '@/utils/date';
import { riscoConfig, textoPercentualRisco } from '@/utils/risco';

import { Badge } from './Badge';
import { Card } from './Card';
import { IconText } from './IconText';

interface RiscoFaltaCardProps {
  item: RiscoFaltaResponse;
  onPress: () => void;
}

/** Consulta da lista de risco de falta, com o selo do nível previsto pelo modelo. */
export function RiscoFaltaCard({ item, onPress }: RiscoFaltaCardProps) {
  const dataHora = isoToBrDateTime(item.dataHora);
  const config = riscoConfig(item.nivel);
  const percentual = textoPercentualRisco(item.risco);
  const rotulo = percentual ? `${config.label} (${percentual})` : config.label;

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${item.paciente}, ${dataHora}, ${item.especialidade}. Risco de falta: ${rotulo}`}
      accessibilityHint="Abre os detalhes da consulta"
      style={({ pressed }) => pressed && styles.pressed}>
      <Card>
        <View style={styles.header}>
          <Text style={styles.paciente}>{item.paciente}</Text>
          <Ionicons name="chevron-forward" size={22} color={colors.textSecondary} />
        </View>

        <Badge label={rotulo} color={config.color} background={config.background} />

        <IconText icon="calendar-outline" textStyle={styles.dataHora}>
          {dataHora}
        </IconText>
        <IconText icon="medkit-outline">{item.especialidade}</IconText>
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
  paciente: {
    ...typography.subtitle,
    flex: 1,
  },
  dataHora: {
    ...typography.bodyBold,
  },
});
