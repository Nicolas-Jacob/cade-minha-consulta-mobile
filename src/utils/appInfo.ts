import Constants from 'expo-constants';

export interface Integrante {
  nome: string;
  rm: string;
}

/** Equipe do projeto, exibida na tela "Sobre o app". Preencha nome e RM de cada integrante. */
export const EQUIPE: Integrante[] = [
  { nome: 'NOME DO INTEGRANTE 1', rm: 'RM00000' },
  { nome: 'NOME DO INTEGRANTE 2', rm: 'RM00000' },
  { nome: 'NOME DO INTEGRANTE 3', rm: 'RM00000' },
];

export const APP_NOME = Constants.expoConfig?.name ?? 'Cadê minha consulta';

export const APP_OBJETIVO =
  'No SUS, cerca de 1 em cada 4 pacientes falta à consulta com especialista sem avisar, e a vaga ' +
  'fica perdida. Com o app, você acompanha seus pedidos e consultas, confirma presença ou libera ' +
  'a vaga com um toque, e o sistema chama o próximo paciente da fila.';

export const APP_CONTEXTO = 'Global Solution FIAP 2026 · CitizenTech · ODS 3: Saúde e bem-estar';

export function getAppVersion(): string {
  return Constants.expoConfig?.version ?? '-';
}

/** Hash do commit gerado no app.config.js (EAS Build ou git local). */
export function getCommitHash(): string {
  const hash: unknown = Constants.expoConfig?.extra?.commitHash;
  return typeof hash === 'string' && hash ? hash : 'desconhecido';
}
