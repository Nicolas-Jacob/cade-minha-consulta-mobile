/**
 * Tipos da API, espelhando a seção 7 (DTOs) e a seção 5 (formato padrão)
 * de docs/CONTRATO_API.md. Qualquer mudança aqui deve partir do contrato.
 */

// ---------- Enums ----------

export type Credencial = 'CIDADAO' | 'GESTOR';
export type Sexo = 'F' | 'M';
export type StatusAtivo = 'ATIVO' | 'INATIVO';
export type StatusFila = 'AGUARDANDO' | 'AGENDADA' | 'CANCELADA';
export type StatusConsulta = 'AGENDADA' | 'CONFIRMADA' | 'CANCELADA' | 'PRESENTE' | 'FALTA';
export type NivelRisco = 'BAIXO' | 'MEDIO' | 'ALTO';
export type StatusPresenca = 'PRESENTE' | 'FALTA';
export type PeriodoConsulta = 'futuras' | 'historico';
export type OrigemOrientacao = 'IA' | 'PADRAO';

// ---------- Formato padrão ----------

/** Página no formato do Spring (todo GET de lista é paginado). */
export interface Page<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}

export interface PageParams {
  page?: number;
  size?: number;
  /** Ex.: "dataHora,asc" */
  sort?: string;
}

export interface ApiFieldError {
  campo: string;
  mensagem: string;
}

/** Erro padrão devolvido em todo 4xx e 5xx. */
export interface ApiErrorResponse {
  status: number;
  erro: string;
  mensagem: string;
  /** Só aparece em erros de validação (400). */
  campos?: ApiFieldError[];
  caminho: string;
  timestamp: string;
}

// ---------- Requests ----------

export interface LoginRequest {
  login: string;
  senha: string;
}

export interface EnderecoRequest {
  /** 8 dígitos, sem traço */
  cep: string;
  logradouro: string;
  numero: number;
  complemento?: string;
  bairro: string;
  cidade: string;
  /** 2 letras */
  uf: string;
}

export interface RegisterRequest {
  nome: string;
  sobrenome: string;
  /** 11 dígitos, sem pontuação */
  cpf: string;
  sexo: Sexo;
  /** yyyy-MM-dd */
  dataNascimento: string;
  nomeMae: string;
  nomePai?: string;
  /** máx. 20 caracteres */
  login: string;
  /** mín. 6 caracteres */
  senha: string;
  /** 10 ou 11 dígitos */
  telefone: string;
  email?: string;
  endereco: EnderecoRequest;
}

export interface UsuarioUpdateRequest {
  nome: string;
  sobrenome: string;
  telefone: string;
  email?: string;
  endereco: EnderecoRequest;
}

export interface EspecialidadeRequest {
  /** máx. 50 caracteres */
  nome: string;
  /** máx. 200 caracteres */
  descricao: string;
}

export interface UnidadeRequest {
  /** máx. 100 caracteres */
  nome: string;
  telefone: string;
  email?: string;
  endereco: EnderecoRequest;
  /** POST: padrão ATIVO; PUT: permite reativar */
  status?: StatusAtivo;
}

export interface MedicoRequest {
  nome: string;
  sobrenome: string;
  /** máx. 10 caracteres */
  crm: string;
  ufCrm: string;
  /** mín. 1 */
  idsEspecialidades: number[];
  /** mín. 1 */
  idsUnidades: number[];
  /** POST: padrão ATIVO; PUT: permite reativar */
  status?: StatusAtivo;
}

export interface FilaRequest {
  idEspecialidade: number;
  idUnidade: number;
}

export interface FilaUpdateRequest {
  idUnidade: number;
}

export interface PrioridadeRequest {
  /** 1 a 5 */
  prioridade: number;
}

export interface AgendamentoRequest {
  idMedico: number;
}

export interface PresencaRequest {
  status: StatusPresenca;
}

// ---------- Responses ----------

export interface UsuarioResumo {
  id: number;
  nome: string;
  credencial: Credencial;
}

export interface LoginResponse {
  token: string;
  usuario: UsuarioResumo;
}

export interface UsuarioResponse {
  id: number;
  nome: string;
  sobrenome: string;
  cpf: string;
  sexo: Sexo;
  dataNascimento: string;
  login: string;
  credencial: Credencial;
  telefone: string | null;
  email: string | null;
  endereco: EnderecoRequest | null;
}

export interface EspecialidadeResponse {
  id: number;
  nome: string;
  descricao: string;
}

export interface UnidadeResponse {
  id: number;
  nome: string;
  status: StatusAtivo;
  /** "Logradouro, 110 - Bairro, Cidade/UF" */
  endereco: string | null;
  telefone: string | null;
}

export interface Referencia {
  id: number;
  nome: string;
}

export interface MedicoResponse {
  id: number;
  nome: string;
  sobrenome: string;
  crm: string;
  ufCrm: string;
  status: StatusAtivo;
  especialidades: EspecialidadeResponse[];
  unidades: Referencia[];
}

export interface FilaResponse {
  id: number;
  status: StatusFila;
  prioridade: number;
  especialidade: Referencia;
  unidade: Referencia;
  dataEntrada: string;
  dataSaida: string | null;
  posicaoEstimada: number | null;
}

export interface ConsultaResponse {
  id: number;
  idFila: number;
  status: StatusConsulta;
  dataHora: string;
  diasAteConsulta: number;
  especialidade: Referencia;
  medico: { id: number; nome: string; crm: string };
  unidade: { id: number; nome: string; endereco: string | null };
  /** Só para o GESTOR */
  paciente?: { id: number; nome: string; telefone: string | null };
}

export interface OrientacaoResponse {
  idConsulta: number;
  mensagem: string;
  geradoEm: string;
  /** PADRAO = texto de reserva quando a IA está indisponível */
  origem: OrigemOrientacao;
  /** Texto de aviso a exibir sempre (muda conforme a origem). */
  aviso: string;
}

export interface RiscoFaltaResponse {
  idConsulta: number;
  paciente: string;
  dataHora: string;
  especialidade: string;
  /** 0 a 1; null enquanto o modelo de ML não estiver integrado */
  risco: number | null;
  /** null enquanto o modelo de ML não estiver integrado */
  nivel: NivelRisco | null;
}
