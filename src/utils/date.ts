/**
 * Converte "dd/mm/aaaa" em "yyyy-MM-dd".
 * Devolve null se a data não existir no calendário (ex.: 31/02/2000).
 */
export function brDateToIso(value: string): string | null {
  const match = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(value);
  if (!match) return null;

  const [, day, month, year] = match;
  const date = new Date(Number(year), Number(month) - 1, Number(day));
  const exists =
    date.getFullYear() === Number(year) &&
    date.getMonth() === Number(month) - 1 &&
    date.getDate() === Number(day);

  return exists ? `${year}-${month}-${day}` : null;
}

/** Converte "yyyy-MM-dd" (ou ISO com hora) em "dd/mm/aaaa". */
export function isoToBrDate(value: string) {
  const [year, month, day] = value.slice(0, 10).split('-');
  return `${day}/${month}/${year}`;
}
