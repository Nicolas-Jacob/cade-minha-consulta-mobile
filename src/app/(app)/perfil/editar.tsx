import { router } from 'expo-router';
import { StyleSheet, Text } from 'react-native';

import {
  Button,
  ContatoSection,
  EmptyState,
  EnderecoSection,
  ErrorMessage,
  FormSection,
  Loading,
  NomeFields,
  Screen,
} from '@/components';
import { useApiRequest } from '@/hooks/useApiRequest';
import { useEditarPerfilForm } from '@/hooks/useEditarPerfilForm';
import { usuarioService } from '@/services/usuarioService';
import { colors, spacing, typography } from '@/theme';
import type { UsuarioResponse } from '@/types/api';
import { rotaPerfil } from '@/utils/rotas';

/** Editar perfil: busca os dados atuais (GET /usuarios/me) e só então monta o formulário. */
export default function EditarPerfilScreen() {
  const { data: usuario, loading, error, reload } = useApiRequest(usuarioService.getMe);

  if (usuario) return <EditarPerfilForm usuario={usuario} />;

  return (
    <Screen edges={['bottom', 'left', 'right']}>
      {loading && <Loading message="Carregando seus dados..." />}
      {!loading && error && <ErrorMessage message={error} onRetry={reload} />}
      {!loading && !error && (
        <EmptyState icon="person-outline" title="Não encontramos seus dados" />
      )}
    </Screen>
  );
}

function EditarPerfilForm({ usuario }: { usuario: UsuarioResponse }) {
  const { values, errors, setField, submit, submitting, submitError, cepSearching, cepError } =
    useEditarPerfilForm(usuario);
  const fieldProps = { values, errors, onChange: setField };

  async function salvar() {
    const salvou = await submit();
    if (salvou) {
      router.dismissTo({
        pathname: rotaPerfil(usuario.credencial),
        params: { sucesso: 'atualizado' },
      });
    }
  }

  return (
    <Screen scroll edges={['bottom', 'left', 'right']}>
      <Text style={styles.intro}>
        Atualize seus dados de contato e endereço. CPF, data de nascimento e usuário não podem ser
        alterados.
      </Text>

      <FormSection title="Seus dados">
        <NomeFields {...fieldProps} />
      </FormSection>
      <ContatoSection {...fieldProps} />
      <EnderecoSection {...fieldProps} cepSearching={cepSearching} cepError={cepError} />

      {submitError && <ErrorMessage message={submitError} />}

      <Button
        title="Salvar alterações"
        icon="checkmark-circle-outline"
        onPress={salvar}
        loading={submitting}
        accessibilityHint="Grava os novos dados e volta para o perfil"
        style={styles.submit}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  intro: {
    ...typography.body,
    color: colors.textSecondary,
  },
  submit: {
    marginBottom: spacing.lg,
  },
});
