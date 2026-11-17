import { StyleSheet, View } from 'react-native';

import { spacing } from '@/theme';
import type { DadosUsuarioValues, FormErrors } from '@/utils/usuarioForm';

import { FormSection } from './FormSection';
import { Input } from './Input';

/** Props comuns dos blocos de campos do usuário (cadastro e edição do perfil). */
interface UsuarioFieldsProps {
  values: DadosUsuarioValues;
  errors: FormErrors<DadosUsuarioValues>;
  onChange: (field: keyof DadosUsuarioValues, value: string) => void;
}

/** Nome e sobrenome (ficam dentro da seção "Seus dados" de cada formulário). */
export function NomeFields({ values, errors, onChange }: UsuarioFieldsProps) {
  return (
    <>
      <Input
        label="Nome"
        value={values.nome}
        onChangeText={(value) => onChange('nome', value)}
        error={errors.nome}
        autoComplete="given-name"
        textContentType="givenName"
      />
      <Input
        label="Sobrenome"
        value={values.sobrenome}
        onChangeText={(value) => onChange('sobrenome', value)}
        error={errors.sobrenome}
        autoComplete="family-name"
        textContentType="familyName"
      />
    </>
  );
}

export function ContatoSection({ values, errors, onChange }: UsuarioFieldsProps) {
  return (
    <FormSection title="Contato">
      <Input
        label="Celular ou telefone com DDD"
        value={values.telefone}
        onChangeText={(value) => onChange('telefone', value)}
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
        onChangeText={(value) => onChange('email', value)}
        error={errors.email}
        keyboardType="email-address"
        autoCapitalize="none"
        autoComplete="email"
        textContentType="emailAddress"
      />
    </FormSection>
  );
}

interface EnderecoSectionProps extends UsuarioFieldsProps {
  cepSearching: boolean;
  cepError: string | null;
}

/** Endereço com preenchimento automático pelo CEP (ViaCEP). */
export function EnderecoSection({
  values,
  errors,
  onChange,
  cepSearching,
  cepError,
}: EnderecoSectionProps) {
  return (
    <FormSection title="Endereço">
      <Input
        label="CEP"
        value={values.cep}
        onChangeText={(value) => onChange('cep', value)}
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
        onChangeText={(value) => onChange('logradouro', value)}
        error={errors.logradouro}
        textContentType="streetAddressLine1"
      />
      <Input
        label="Número"
        value={values.numero}
        onChangeText={(value) => onChange('numero', value)}
        error={errors.numero}
        keyboardType="number-pad"
        maxLength={6}
      />
      <Input
        label="Complemento"
        optional
        value={values.complemento}
        onChangeText={(value) => onChange('complemento', value)}
        error={errors.complemento}
        placeholder="Apto, bloco, casa..."
        textContentType="streetAddressLine2"
      />
      <Input
        label="Bairro"
        value={values.bairro}
        onChangeText={(value) => onChange('bairro', value)}
        error={errors.bairro}
      />
      <View style={styles.row}>
        <View style={styles.flex}>
          <Input
            label="Cidade"
            value={values.cidade}
            onChangeText={(value) => onChange('cidade', value)}
            error={errors.cidade}
            textContentType="addressCity"
          />
        </View>
        <View style={styles.uf}>
          <Input
            label="UF"
            value={values.uf}
            onChangeText={(value) => onChange('uf', value)}
            error={errors.uf}
            autoCapitalize="characters"
            maxLength={2}
            placeholder="SP"
          />
        </View>
      </View>
    </FormSection>
  );
}

const styles = StyleSheet.create({
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
});
