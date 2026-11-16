import { brDateToIso } from './date';
import { onlyDigits } from './masks';

export const UFS = [
  'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG', 'PA',
  'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO',
]; // prettier-ignore

/** Valida o CPF pelos dígitos verificadores. */
export function isValidCpf(value: string) {
  const cpf = onlyDigits(value);
  if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;

  const checkDigit = (length: number) => {
    let sum = 0;
    for (let i = 0; i < length; i++) {
      sum += Number(cpf[i]) * (length + 1 - i);
    }
    const rest = (sum * 10) % 11;
    return rest === 10 ? 0 : rest;
  };

  return checkDigit(9) === Number(cpf[9]) && checkDigit(10) === Number(cpf[10]);
}

export function isValidPhone(value: string) {
  const length = onlyDigits(value).length;
  return length === 10 || length === 11;
}

export function isValidCep(value: string) {
  return onlyDigits(value).length === 8;
}

export function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

export function isValidUf(value: string) {
  return UFS.includes(value.toUpperCase());
}

/** Data de nascimento válida: existe, não está no futuro e é posterior a 1900. */
export function isValidBirthDate(value: string) {
  const iso = brDateToIso(value);
  if (!iso) return false;
  const date = new Date(`${iso}T00:00:00`);
  return date.getFullYear() >= 1900 && date <= new Date();
}
