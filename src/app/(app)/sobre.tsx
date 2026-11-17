import { Image, StyleSheet, Text, View } from 'react-native';

import { Card, InfoRow, Screen } from '@/components';
import { colors, radius, spacing, typography } from '@/theme';
import {
  APP_CONTEXTO,
  APP_NOME,
  APP_OBJETIVO,
  EQUIPE,
  getAppVersion,
  getCommitHash,
} from '@/utils/appInfo';

export default function SobreScreen() {
  const versao = getAppVersion();
  const commitHash = getCommitHash();

  return (
    <Screen scroll edges={['bottom', 'left', 'right']}>
      <View style={styles.header}>
        <Image
          source={require('@/assets/images/icon.png')}
          style={styles.logo}
          accessibilityIgnoresInvertColors
          accessible={false}
        />
        <Text style={styles.title} accessibilityRole="header">
          {APP_NOME}
        </Text>
        <Text style={styles.caption}>Versão {versao}</Text>
      </View>

      <Card>
        <Text style={styles.sectionTitle} accessibilityRole="header">
          Para que serve
        </Text>
        <Text style={styles.body}>{APP_OBJETIVO}</Text>
        <Text style={styles.caption}>{APP_CONTEXTO}</Text>
      </Card>

      <Card>
        <Text style={styles.sectionTitle} accessibilityRole="header">
          Equipe
        </Text>
        {EQUIPE.map((integrante) => (
          <InfoRow
            key={integrante.rm + integrante.nome}
            label={integrante.rm}
            value={integrante.nome}
          />
        ))}
      </Card>

      <Card>
        <Text style={styles.sectionTitle} accessibilityRole="header">
          Versão publicada
        </Text>
        <InfoRow label="Versão do app" value={versao} />
        <View
          style={styles.hashBox}
          accessible
          accessibilityLabel={`Commit de referência: ${commitHash.split('').join(' ')}`}>
          <Text style={styles.caption}>Commit de referência</Text>
          <Text style={styles.hash} selectable>
            {commitHash}
          </Text>
        </View>
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
    gap: spacing.xs,
    paddingVertical: spacing.md,
  },
  logo: {
    width: 88,
    height: 88,
    borderRadius: radius.lg,
    marginBottom: spacing.sm,
  },
  title: {
    ...typography.title,
    textAlign: 'center',
  },
  sectionTitle: {
    ...typography.subtitle,
  },
  body: {
    ...typography.body,
  },
  caption: {
    ...typography.caption,
  },
  hashBox: {
    gap: 2,
    padding: spacing.sm,
    borderRadius: radius.md,
    backgroundColor: colors.primaryLight,
  },
  hash: {
    ...typography.bodyBold,
    color: colors.primaryDark,
    letterSpacing: 1,
  },
});
