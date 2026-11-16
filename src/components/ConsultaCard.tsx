import Ionicons from '@expo/vector-icons/Ionicons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, spacing, typography } from '@/theme';
import type { ConsultaResponse } from '@/types/api';
import { isoToBrDateTime } from '@/utils/date';
import { maskPhone } from '@/utils/masks';

import { Card } from './Card';
import { IconText } from './IconText';
import { StatusBadge } from './StatusBadge';

interface ConsultaCardProps {
  consulta: ConsultaResponse;
  onPress: () => void;
}

/**
 * Resumo de uma consulta nas listas. Quando a consulta traz o `paciente` (só vem para o gestor),
 * mostra também o médico, o paciente e o telefone de contato.
 */
export function ConsultaCard({ consulta, onPress }: ConsultaCardProps) {
  const dataHora = isoToBrDateTime(consulta.dataHora);
  const { paciente } = consulta;
  const telefone = paciente?.telefone ? maskPhone(paciente.telefone) : 'sem telefone';

  const accessibilityLabel = [
    consulta.especialidade.nome,
    dataHora,
    consulta.unidade.nome,
    ...(paciente
      ? [`Médico(a): ${consulta.medico.nome}`, `Paciente: ${paciente.nome}`, telefone]
      : []),
  ].join(', ');

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
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

        {paciente && (
          <>
            <IconText icon="medkit-outline">{`Médico(a): ${consulta.medico.nome}`}</IconText>
            <IconText icon="person-outline">{`Paciente: ${paciente.nome}`}</IconText>
            <IconText icon="call-outline">{telefone}</IconText>
          </>
        )}
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
