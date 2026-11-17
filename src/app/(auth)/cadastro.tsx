import { StyleSheet, Text } from 'react-native';

import {
  Button,
  ContatoSection,
  EnderecoSection,
  ErrorMessage,
  FormSection,
  Input,
  NomeFields,
  OptionGroup,
  Screen,
} from '@/components';
import { useCadastroForm } from '@/hooks/useCadastroForm';
import { colors, spacing, typography } from '@/theme';
import type { Sexo } from '@/types/api';

const SEXO_OPTIONS: { value: Sexo; label: string }[] = [
  { value: 'F', label: 'Feminino' },
  { value: 'M', label: 'Masculino' },
];

export default function CadastroScreen() {
  const { values, errors, setField, submit, submitting, submitError, cepSearching, cepError } =
    useCadastroForm();
  const fieldProps = { values, errors, onChange: setField };

  return (
    <Screen scroll edges={['bottom', 'left', 'right']}>
      <Text style={styles.intro}>
        Preencha seus dados para acompanhar suas consultas. Campos sem “(opcional)” são
        obrigatórios.
      </Text>

      <FormSection title="Seus dados">
        <NomeFields {...fieldProps} />
        <Input
          label="CPF"
          value={values.cpf}
          onChangeText={(value) => setField('cpf', value)}
          error={errors.cpf}
          placeholder="000.000.000-00"
          keyboardType="number-pad"
          maxLength={14}
        />
        <OptionGroup
          label="Sexo"
          options={SEXO_OPTIONS}
          value={values.sexo}
          onChange={(value) => setField('sexo', value)}
          error={errors.sexo}
        />
        <Input
          label="Data de nascimento"
          value={values.dataNascimento}
          onChangeText={(value) => setField('dataNascimento', value)}
          error={errors.dataNascimento}
          placeholder="dd/mm/aaaa"
          keyboardType="number-pad"
          maxLength={10}
        />
        <Input
          label="Nome da mãe"
          value={values.nomeMae}
          onChangeText={(value) => setField('nomeMae', value)}
          error={errors.nomeMae}
        />
        <Input
          label="Nome do pai"
          optional
          value={values.nomePai}
          onChangeText={(value) => setField('nomePai', value)}
          error={errors.nomePai}
        />
      </FormSection>

      <ContatoSection {...fieldProps} />
      <EnderecoSection {...fieldProps} cepSearching={cepSearching} cepError={cepError} />

      <FormSection title="Acesso ao aplicativo">
        <Input
          label="Usuário"
          value={values.login}
          onChangeText={(value) => setField('login', value)}
          error={errors.login}
          hint="Você vai usar para entrar. Até 20 caracteres."
          autoCapitalize="none"
          autoCorrect={false}
          autoComplete="username-new"
          textContentType="username"
          maxLength={20}
        />
        <Input
          label="Senha"
          password
          value={values.senha}
          onChangeText={(value) => setField('senha', value)}
          error={errors.senha}
          hint="Pelo menos 6 caracteres."
          autoCapitalize="none"
          autoCorrect={false}
          autoComplete="new-password"
          textContentType="newPassword"
        />
        <Input
          label="Confirme a senha"
          password
          value={values.confirmarSenha}
          onChangeText={(value) => setField('confirmarSenha', value)}
          error={errors.confirmarSenha}
          autoCapitalize="none"
          autoCorrect={false}
          autoComplete="new-password"
          textContentType="newPassword"
        />
      </FormSection>

      {submitError && <ErrorMessage message={submitError} />}

      <Button
        title="Criar conta"
        icon="checkmark-circle-outline"
        onPress={submit}
        loading={submitting}
        accessibilityHint="Envia seus dados e entra no aplicativo"
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
