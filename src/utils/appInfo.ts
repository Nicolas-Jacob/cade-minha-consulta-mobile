import Constants from 'expo-constants';

export interface Integrante {
  nome: string;
  rm: string;
  turma: string;
}

/** Equipe do projeto, exibida na tela "Sobre o app". */
export const EQUIPE: Integrante[] = [
  { nome: 'João Victor Vendrameto', rm: 'RM563665', turma: '2TDSPV' },
  { nome: 'Nicolas de Oliveira Jacob', rm: 'RM564205', turma: '2TDSPX' },
  { nome: 'Gabriel Ambrósio Saraiva', rm: 'RM566552', turma: '2TDSPV' },
  { nome: 'Vinicius Romaguera Cardozo', rm: 'RM562308', turma: '2TDSPX' },
  { nome: 'Yuri Fuzinatto Garzoli Barreto', rm: 'RM561450', turma: '2TDSPX' },
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
