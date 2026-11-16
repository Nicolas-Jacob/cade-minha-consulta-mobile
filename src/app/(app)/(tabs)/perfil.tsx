import { router } from 'expo-router';
import { Alert, StyleSheet, Text, View } from 'react-native';

import { Button, Card, EmptyState, ErrorMessage, Loading, Screen } from '@/components';
import { useApiRequest } from '@/hooks/useApiRequest';
import { useAuth } from '@/hooks/useAuth';
import { usuarioService } from '@/services/usuarioService';
import { colors, spacing, typography } from '@/theme';
import type { UsuarioResponse } from '@/types/api';
import { isoToBrDate } from '@/utils/date';
import { maskCep, maskCpf, maskPhone } from '@/utils/masks';

function formatEndereco(endereco: UsuarioResponse['endereco']) {
  if (!endereco) return null;
  const { logradouro, numero, complemento, bairro, cidade, uf, cep } = endereco;
  const linha1 = `${logradouro}, ${numero}${complemento ? ` - ${complemento}` : ''}`;
  return `${linha1}\n${bairro}, ${cidade}/${uf}\nCEP ${maskCep(cep)}`;
}

function InfoRow({ label, value }: { label: string; value: string | null }) {
  return (
    <View
      style={styles.infoRow}
      accessible
      accessibilityLabel={`${label}: ${value ?? 'não informado'}`}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value ?? 'Não informado'}</Text>
    </View>
  );
}

export default function PerfilScreen() {
  const { signOut } = useAuth();
  const { data: usuario, loading, error, reload } = useApiRequest(usuarioService.getMe);

  function confirmSignOut() {
    Alert.alert('Sair do aplicativo', 'Deseja mesmo sair? Você vai precisar entrar de novo.', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Sair', style: 'destructive', onPress: () => void signOut() },
    ]);
  }

  function renderContent() {
    if (loading) return <Loading message="Carregando seus dados..." />;
    if (error) return <ErrorMessage message={error} onRetry={reload} />;
    if (!usuario) {
      return <EmptyState icon="person-outline" title="Não encontramos seus dados" />;
    }

    return (
      <>
        <Text style={styles.name} accessibilityRole="header">
          {usuario.nome} {usuario.sobrenome}
        </Text>
        <Card>
          <InfoRow label="CPF" value={maskCpf(usuario.cpf)} />
          <InfoRow label="Data de nascimento" value={isoToBrDate(usuario.dataNascimento)} />
          <InfoRow label="Usuário" value={usuario.login} />
        </Card>
        <Card>
          <InfoRow label="Telefone" value={usuario.telefone && maskPhone(usuario.telefone)} />
          <InfoRow label="E-mail" value={usuario.email} />
          <InfoRow label="Endereço" value={formatEndereco(usuario.endereco)} />
        </Card>
      </>
    );
  }

  return (
    <Screen scroll>
      {renderContent()}

      <View style={styles.actions}>
        <Button
          title="Sobre o app"
          variant="secondary"
          icon="information-circle-outline"
          onPress={() => router.push('/sobre')}
        />
        <Button
          title="Sair"
          variant="danger"
          icon="log-out-outline"
          onPress={confirmSignOut}
          accessibilityLabel="Sair do aplicativo"
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  name: {
    ...typography.title,
  },
  infoRow: {
    gap: 2,
    paddingVertical: spacing.xs,
  },
  infoLabel: {
    ...typography.caption,
  },
  infoValue: {
    ...typography.body,
    color: colors.text,
  },
  actions: {
    gap: spacing.sm,
    marginTop: 'auto',
    paddingTop: spacing.md,
  },
});
