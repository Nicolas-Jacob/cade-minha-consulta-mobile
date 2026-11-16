import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { useRef, useState } from 'react';
import { StyleSheet, Text, View, type TextInputInstance } from 'react-native';

import { Button, Card, ErrorMessage, Input, Screen } from '@/components';
import { useAuth } from '@/hooks/useAuth';
import { colors, radius, spacing, typography } from '@/theme';
import { getErrorMessage } from '@/utils/apiError';

export default function LoginScreen() {
  const { signIn } = useAuth();
  const senhaRef = useRef<TextInputInstance>(null);

  const [login, setLogin] = useState('');
  const [senha, setSenha] = useState('');
  const [errors, setErrors] = useState<{ login?: string; senha?: string }>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit() {
    const validationErrors = {
      login: login.trim() ? undefined : 'Informe seu usuário.',
      senha: senha ? undefined : 'Informe sua senha.',
    };
    setErrors(validationErrors);
    setSubmitError(null);
    if (validationErrors.login || validationErrors.senha) return;

    setSubmitting(true);
    try {
      // Ao entrar, o (auth)/_layout redireciona para a aba Início.
      await signIn({ login: login.trim(), senha });
    } catch (error) {
      setSubmitError(getErrorMessage(error));
      setSubmitting(false);
    }
  }

  return (
    <Screen scroll edges={['top', 'bottom', 'left', 'right']}>
      <View style={styles.header}>
        <View style={styles.logo}>
          <Ionicons name="medkit" size={40} color={colors.onPrimary} />
        </View>
        <Text style={styles.title} accessibilityRole="header">
          Cadê minha consulta
        </Text>
        <Text style={styles.subtitle}>
          Acompanhe suas consultas do SUS, confirme presença ou libere a vaga para outra pessoa.
        </Text>
      </View>

      <Card style={styles.card}>
        <Input
          label="Usuário"
          value={login}
          onChangeText={(value) => {
            setLogin(value);
            setErrors((current) => ({ ...current, login: undefined }));
          }}
          error={errors.login}
          autoCapitalize="none"
          autoCorrect={false}
          autoComplete="username"
          textContentType="username"
          returnKeyType="next"
          onSubmitEditing={() => senhaRef.current?.focus()}
          submitBehavior="submit"
        />
        <Input
          ref={senhaRef}
          label="Senha"
          password
          value={senha}
          onChangeText={(value) => {
            setSenha(value);
            setErrors((current) => ({ ...current, senha: undefined }));
          }}
          error={errors.senha}
          autoCapitalize="none"
          autoCorrect={false}
          autoComplete="current-password"
          textContentType="password"
          returnKeyType="done"
          onSubmitEditing={handleSubmit}
        />

        {submitError && <ErrorMessage message={submitError} />}

        <Button
          title="Entrar"
          icon="log-in-outline"
          onPress={handleSubmit}
          loading={submitting}
          accessibilityHint="Entra no aplicativo com seu usuário e senha"
        />
      </Card>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Ainda não tem conta?</Text>
        <Button
          title="Criar conta"
          variant="secondary"
          icon="person-add-outline"
          onPress={() => router.push('/cadastro')}
          accessibilityHint="Abre o formulário de cadastro"
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
    gap: spacing.sm,
    marginTop: spacing.xl,
    marginBottom: spacing.md,
  },
  logo: {
    width: 80,
    height: 80,
    borderRadius: radius.pill,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  title: {
    ...typography.title,
    color: colors.primary,
    textAlign: 'center',
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  card: {
    gap: spacing.md,
    padding: spacing.lg,
  },
  footer: {
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  footerText: {
    ...typography.body,
    textAlign: 'center',
  },
});
