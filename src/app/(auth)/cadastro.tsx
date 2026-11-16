import { StyleSheet, Text, View } from 'react-native';

import { Button, ErrorMessage, FormSection, Input, OptionGroup, Screen } from '@/components';
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

  return (
    <Screen scroll edges={['bottom', 'left', 'right']}>
      <Text style={styles.intro}>
        Preencha seus dados para acompanhar suas consultas. Campos sem “(opcional)” são
        obrigatórios.
      </Text>

      <FormSection title="Seus dados">
        <Input
          label="Nome"
          value={values.nome}
          onChangeText={(value) => setField('nome', value)}
          error={errors.nome}
          autoComplete="given-name"
          textContentType="givenName"
        />
        <Input
          label="Sobrenome"
          value={values.sobrenome}
          onChangeText={(value) => setField('sobrenome', value)}
          error={errors.sobrenome}
          autoComplete="family-name"
          textContentType="familyName"
        />
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

      <FormSection title="Contato">
        <Input
          label="Celular ou telefone com DDD"
          value={values.telefone}
          onChangeText={(value) => setField('telefone', value)}
          error={errors.telefone}
          placeholder="(11) 91234-5678"
          keyboardType="phone-pad"
          autoComplete="tel"
          textContentType="telephoneNumber"
          maxLength={15}
        />
        <Input
          label="E-mail"
          optional
          value={values.email}
          onChangeText={(value) => setField('email', value)}
          error={errors.email}
          keyboardType="email-address"
          autoCapitalize="none"
          autoComplete="email"
          textContentType="emailAddress"
        />
      </FormSection>

      <FormSection title="Endereço">
        <Input
          label="CEP"
          value={values.cep}
          onChangeText={(value) => setField('cep', value)}
          error={errors.cep ?? cepError}
          hint={cepSearching ? 'Buscando endereço...' : 'O endereço é preenchido pelo CEP.'}
          placeholder="00000-000"
          keyboardType="number-pad"
          autoComplete="postal-code"
          textContentType="postalCode"
          maxLength={9}
        />
        <Input
          label="Rua / logradouro"
          value={values.logradouro}
          onChangeText={(value) => setField('logradouro', value)}
          error={errors.logradouro}
          textContentType="streetAddressLine1"
        />
        <Input
          label="Número"
          value={values.numero}
          onChangeText={(value) => setField('numero', value)}
          error={errors.numero}
          keyboardType="number-pad"
          maxLength={6}
        />
        <Input
          label="Complemento"
          optional
          value={values.complemento}
          onChangeText={(value) => setField('complemento', value)}
          error={errors.complemento}
          placeholder="Apto, bloco, casa..."
          textContentType="streetAddressLine2"
        />
        <Input
          label="Bairro"
          value={values.bairro}
          onChangeText={(value) => setField('bairro', value)}
          error={errors.bairro}
        />
        <View style={styles.row}>
          <View style={styles.flex}>
            <Input
              label="Cidade"
              value={values.cidade}
              onChangeText={(value) => setField('cidade', value)}
              error={errors.cidade}
              textContentType="addressCity"
            />
          </View>
          <View style={styles.uf}>
            <Input
              label="UF"
              value={values.uf}
              onChangeText={(value) => setField('uf', value)}
              error={errors.uf}
              autoCapitalize="characters"
              maxLength={2}
              placeholder="SP"
            />
          </View>
        </View>
      </FormSection>

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
  row: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  flex: {
    flex: 1,
  },
  uf: {
    width: 80,
  },
  submit: {
    marginBottom: spacing.lg,
  },
});
