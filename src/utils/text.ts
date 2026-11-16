/** Acentos soltos que a normalização NFD separa das letras (U+0300 a U+036F). */
const COMBINING_ACCENTS = new RegExp(
  `[${String.fromCharCode(0x0300)}-${String.fromCharCode(0x036f)}]`,
  'g',
);

/** Minúsculas e sem acentos, para buscas por nome ("cardio" encontra "Cardiologia"). */
export function normalizeSearch(value: string) {
  return value.normalize('NFD').replace(COMBINING_ACCENTS, '').toLowerCase().trim();
}
