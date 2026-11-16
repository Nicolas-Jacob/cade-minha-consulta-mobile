import Ionicons from '@expo/vector-icons/Ionicons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, radius, spacing, typography } from '@/theme';
import type { ConsultaResponse } from '@/types/api';
import { dataHoraPorExtenso, podeConfirmar, textoDiasAteConsulta } from '@/utils/consulta';

import { Button } from './Button';
import { Card } from './Card';
import { IconText } from './IconText';
import { StatusBadge } from './StatusBadge';

interface ProximaConsultaCardProps {
  consulta: ConsultaResponse;
  /** Abre o detalhe da consulta. */
  onPress: () => void;
  onConfirmar: () => void;
  confirmando?: boolean;
}

/** Destaque da próxima consulta na tela inicial. */
export function ProximaConsultaCard({
  consulta,
  onPress,
  onConfirmar,
  confirmando = false,
}: ProximaConsultaCardProps) {
  const dataHora = dataHoraPorExtenso(consulta.dataHora);
  const faltam = textoDiasAteConsulta(consulta.diasAteConsulta);

  return (
    <Card style={styles.card}>
      {/* Só a parte de informações abre o detalhe; o botão de confirmar fica fora dela
          para continuar acessível ao leitor de tela. */}
      <Pressable
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel={
          `Sua próxima consulta: ${consulta.especialidade.nome}, ${dataHora}` +
          `${faltam ? `, ${faltam.toLowerCase()}` : ''}, ${consulta.unidade.nome}`
        }
        accessibilityHint="Abre os detalhes da consulta"
        style={({ pressed }) => [styles.info, pressed && styles.pressed]}>
        <Text style={styles.kicker}>Sua próxima consulta</Text>

        <View style={styles.header}>
          <Text style={styles.especialidade}>{consulta.especialidade.nome}</Text>
          <Ionicons name="chevron-forward" size={22} color={colors.textSecondary} />
        </View>

        <View style={styles.badges}>
          <StatusBadge status={consulta.status} />
          {faltam && <Text style={styles.faltam}>{faltam}</Text>}
        </View>

        <IconText icon="calendar-outline" textStyle={styles.dataHora}>
          {dataHora}
        </IconText>
        <IconText icon="business-outline">{consulta.unidade.nome}</IconText>
        <IconText icon="person-outline">{`Médico(a): ${consulta.medico.nome}`}</IconText>
      </Pressable>

      {podeConfirmar(consulta.status) && (
        <Button
          title="Confirmar presença"
          icon="checkmark-circle-outline"
          onPress={onConfirmar}
          loading={confirmando}
          accessibilityHint="Avisa a unidade de saúde que você vai à consulta"
        />
      )}
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 2,
    borderColor: colors.primary,
    gap: spacing.md,
  },
  info: {
    gap: spacing.sm,
  },
  pressed: {
    opacity: 0.8,
  },
  kicker: {
    ...typography.label,
    color: colors.primary,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  especialidade: {
    ...typography.title,
    flex: 1,
  },
  badges: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  faltam: {
    ...typography.label,
    fontSize: 14,
    color: colors.primaryDark,
    backgroundColor: colors.primaryLight,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    overflow: 'hidden',
  },
  dataHora: {
    ...typography.bodyBold,
  },
});
