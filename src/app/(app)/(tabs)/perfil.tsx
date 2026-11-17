import { router } from 'expo-router';
import { Alert, StyleSheet, Text, View } from 'react-native';

import {
  Button,
  Card,
  EmptyState,
  ErrorMessage,
  InfoRow,
  Loading,
  Screen,
  SuccessMessage,
} from '@/components';
import { useApiRequest } from '@/hooks/useApiRequest';
import { useAuth } from '@/hooks/useAuth';
import { useRefreshOnFocus } from '@/hooks/useRefreshOnFocus';
import { useSuccessParam } from '@/hooks/useSuccessParam';
import { usuarioService } from '@/services/usuarioService';
import { spacing, typography } from '@/theme';
import type { UsuarioResponse } from '@/types/api';
import { isoToBrDate } from '@/utils/date';
import { maskCep, maskCpf, maskPhone } from '@/utils/masks';

/** Avisos recebidos pelo parâmetro `sucesso` ao voltar da edição. */
const SUCCESS_MESSAGES: Record<string, string> = {
  atualizado: 'Seus dados foram atualizados.',
};

function formatEndereco(endereco: UsuarioResponse['endereco']) {
  if (!endereco) return null;
  const { logradouro, numero, complemento, bairro, cidade, uf, cep } = endereco;
  const linha1 = `${logradouro}, ${numero}${complemento ? ` - ${complemento}` : ''}`;
  return `${linha1}\n${bairro}, ${cidade}/${uf}\nCEP ${maskCep(cep)}`;
}

export default function PerfilScreen() {
  const { signOut } = useAuth();
  const { data: usuario, loading, error, reload } = useApiRequest(usuarioService.getMe);
  const { aviso, limparAviso } = useSuccessParam(SUCCESS_MESSAGES);

  // Ao voltar da edição (ou de outra tela), busca os dados de novo. Ao sair, o aviso some.
  useRefreshOnFocus(reload, limparAviso);

  function confirmSignOut() {
    Alert.alert('Sair do aplicativo', 'Deseja mesmo sair? Você vai precisar entrar de novo.', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Sair', style: 'destructive', onPress: () => void signOut() },
    ]);
  }

  function renderContent() {
    // Na recarga ao voltar para a aba, os dados atuais continuam na tela até chegar a resposta.
    if (loading && !usuario) return <Loading message="Carregando seus dados..." />;
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
      {aviso && <SuccessMessage message={aviso} onDismiss={limparAviso} />}
      {renderContent()}

      <View style={styles.actions}>
        {usuario && (
          <Button
            title="Editar dados"
            icon="create-outline"
            onPress={() => router.push('/perfil/editar')}
            accessibilityLabel="Editar meus dados"
          />
        )}
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
  actions: {
    gap: spacing.sm,
    marginTop: 'auto',
    paddingTop: spacing.md,
  },
});
