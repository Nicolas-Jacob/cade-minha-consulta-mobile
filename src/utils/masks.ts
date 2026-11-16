/** Remove tudo que não for dígito. */
export function onlyDigits(value: string) {
  return value.replace(/\D/g, '');
}

/** 000.000.000-00 */
export function maskCpf(value: string) {
  return onlyDigits(value)
    .slice(0, 11)
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
}

/** (00) 0000-0000 ou (00) 00000-0000 */
export function maskPhone(value: string) {
  const digits = onlyDigits(value).slice(0, 11);
  if (digits.length <= 2) return digits.replace(/(\d{1,2})/, '($1');
  const middleLength = digits.length === 11 ? 5 : 4;
  const ddd = digits.slice(0, 2);
  const middle = digits.slice(2, 2 + middleLength);
  const end = digits.slice(2 + middleLength);
  return `(${ddd}) ${middle}${end ? `-${end}` : ''}`;
}

/** 00000-000 */
export function maskCep(value: string) {
  return onlyDigits(value)
    .slice(0, 8)
    .replace(/(\d{5})(\d{1,3})$/, '$1-$2');
}

/** dd/mm/aaaa */
export function maskDate(value: string) {
  return onlyDigits(value)
    .slice(0, 8)
    .replace(/(\d{2})(\d)/, '$1/$2')
    .replace(/(\d{2})(\d)/, '$1/$2');
}
