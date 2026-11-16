import type { StatusConsulta } from '@/types/api';

// Nomes escritos à mão: o Intl em pt-BR nem sempre está disponível no Hermes do Android.
const DIAS_DA_SEMANA = [
  'domingo',
  'segunda-feira',
  'terça-feira',
  'quarta-feira',
  'quinta-feira',
  'sexta-feira',
  'sábado',
];

const MESES = [
  'janeiro',
  'fevereiro',
  'março',
  'abril',
  'maio',
  'junho',
  'julho',
  'agosto',
  'setembro',
  'outubro',
  'novembro',
  'dezembro',
];

/**
 * "2026-11-23T08:00:00" → "segunda-feira, 23 de novembro de 2026, às 8h00".
 * Lê os números direto do texto (a API já envia no horário de Brasília), sem conversão de fuso.
 */
export function dataHoraPorExtenso(value: string) {
  const [year, month, day] = value.slice(0, 10).split('-').map(Number);
  const [hour = 0, minute = 0] = value.slice(11, 16).split(':').map(Number);
  // Só para descobrir o dia da semana: usa a data local, sem hora.
  const diaDaSemana = DIAS_DA_SEMANA[new Date(year, month - 1, day).getDay()];
  const minutos = String(minute).padStart(2, '0');

  return `${diaDaSemana}, ${day} de ${MESES[month - 1]} de ${year}, às ${hour}h${minutos}`;
}

/** "Hoje", "Amanhã" ou "Em X dias"; null para datas que já passaram. */
export function textoDiasAteConsulta(dias: number) {
  if (dias < 0) return null;
  if (dias === 0) return 'Hoje';
  if (dias === 1) return 'Amanhã';
  return `Em ${dias} dias`;
}

/** Só a consulta AGENDADA pode ser confirmada. */
export function podeConfirmar(status: StatusConsulta) {
  return status === 'AGENDADA';
}

/** A vaga pode ser liberada enquanto a consulta está AGENDADA ou CONFIRMADA. */
export function podeLiberarVaga(status: StatusConsulta) {
  return status === 'AGENDADA' || status === 'CONFIRMADA';
}
