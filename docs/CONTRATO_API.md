# Cadê minha consulta — Contrato da API

> Fonte única da verdade entre a API Java (`cade-minha-consulta-api`) e o app mobile (`cade-minha-consulta-mobile`).
> Este arquivo existe nos DOIS repositórios, em `docs/CONTRATO_API.md`, e deve ser idêntico nos dois.
> Qualquer mudança aqui precisa ser replicada no outro repositório.

## 1. O produto

Global Solution FIAP 2026/2, tema CitizenTech (ODS 3: Saúde e bem-estar).

**Problema:** no SUS, cerca de 1 em cada 4 pacientes falta à consulta com especialista sem avisar. A vaga, que levou meses para sair, é desperdiçada enquanto outras pessoas seguem esperando na fila.

**Solução:** o cidadão acompanha suas solicitações e consultas pelo app. Ele confirma presença ou libera a vaga com um toque. Quando uma vaga é liberada, o sistema agenda automaticamente o próximo paciente compatível da fila. O gestor da unidade agenda pacientes da fila para médicos, acompanha as próximas consultas e registra presença ou falta. A IA generativa escreve lembretes e orientações de preparo em linguagem simples. Um modelo de ML (feito por outro integrante, integrado depois) prevê o risco de falta.

**Papéis** (coluna `credencial` de `TB_GS_USUARIO`):

- `CIDADAO`: paciente. Cadastra-se pelo app.
- `GESTOR`: regulador da unidade. Já existe na carga: login `gestor`, senha `SenhaGestor2026`.

## 2. Stack

| Camada | Tecnologia |
|---|---|
| API | Java 21, Spring Boot 4, Spring Data JPA, Spring Security + JWT via OAuth2 Resource Server (JwtEncoder/JwtDecoder Nimbus, HS256), Lombok, Spring AI, RabbitMQ, springdoc-openapi, Actuator |
| Banco | Oracle. O schema vem dos scripts em `/scripts`, NUNCA do Hibernate (`ddl-auto: none`) |
| Mobile | React Native com Expo, Expo Router, TypeScript, axios, expo-secure-store |

## 3. Modelo de dados (Oracle, já existente)

| Tabela | Entidade Java | Observações |
|---|---|---|
| TB_GS_USUARIO | Usuario | `senha` guarda hash BCrypt; `login` único na prática; `cpf` UNIQUE CHAR(11); `sexo_usuario` F/M |
| TB_GS_CONTATO | Contato | `obs_contato` PROPRIO / EMERGENCIA |
| TB_GS_ENDERECO | Endereco | `CEP` CHAR(8) sem traço; `UF_end` CHAR(2) |
| TB_GS_US_CONTATO_ENDERECO | UsuarioContatoEndereco | Ternária sem PK: usar @IdClass com as 3 FKs |
| TB_GS_UNIDADE | Unidade | `status_unidade` ATIVO / INATIVO |
| TB_GS_UN_CONTATO_ENDERECO | UnidadeContatoEndereco | Ternária sem PK: usar @IdClass com as 3 FKs |
| TB_GS_ESPECIALIDADE | Especialidade | |
| TB_GS_MEDICO | Medico | `status_medico` ATIVO / INATIVO; @ManyToMany com Especialidade e Unidade |
| TB_GS_MEDICO_ESPECIALIDADE | (join table) | |
| TB_GS_MEDICO_UNIDADE | (join table) | |
| TB_GS_FILA | Fila | `status_fila` AGUARDANDO / AGENDADA / CANCELADA; `prioridade_fila`: número maior = mais prioritário |
| TB_GS_CONSULTA | Consulta | `status_consulta` AGENDADA / CONFIRMADA / CANCELADA / PRESENTE / FALTA |
| TB_GS_AUDITORIA_DML | AuditoriaDml | Somente leitura, preenchida por trigger |

Regras de mapeamento:

- IDs: `@SequenceGenerator` com as sequences existentes (ex.: `TB_GS_CONSULTA_id_consulta_SEQ`) e `allocationSize = 1`. As triggers só geram o ID quando ele vem NULL.
- `INTEGER` vira `Long`; `DATE` vira `LocalDateTime` (o DATE do Oracle guarda hora); colunas CHAR viram `String`.
- Enums com `@Enumerated(EnumType.STRING)`.

Objetos PL/SQL usados pela API:

- `PKG_GS_GESTAO_CONSULTAS.PRC_AGENDAR_CONSULTA(p_id_medico)`: escolhe o próximo da fila (prioridade + antiguidade) e agenda no primeiro horário útil livre (8h–17h, seg–sex, a partir de SYSDATE+5). Faz COMMIT interno, então deve ser chamada FORA de `@Transactional`.
- `PKG_GS_CONSULTA_DADOS.FN_DADOS_PREVISAO_FALTA(p_dias)`: dados de entrada para o modelo de risco de falta.
- Trigger `TRG_GS_CONSULTA_FUTURA`: consultas AGENDADA, CONFIRMADA ou CANCELADA precisam ter data futura.

Erros do Oracle e o HTTP correspondente na API:

| Código | Significado | HTTP |
|---|---|---|
| -20001 | Médico não encontrado | 404 |
| -20002 | Médico inativo | 409 |
| -20003 | Não há pacientes aguardando para o médico | 422 |
| -20004 | Fila alterada durante o agendamento | 409 |
| -20005 | Sem horário livre para o médico | 409 |
| -20006 | Falha ao atualizar a fila | 409 |
| -20007 | Data da consulta precisa ser futura (trigger) | 422 |

Situação dos ajustes no banco:

1. FEITO: `PRC_AGENDAR_CONSULTA` tem duas versões (overload). A API usa a de dois parâmetros, `(p_id_medico IN, p_id_consulta OUT)`, que devolve o ID da consulta criada. Por causa do overload, a chamada no Java deve usar `SimpleJdbcCall` com `withoutProcedureColumnMetaDataAccess()` e declarar explicitamente os dois parâmetros (`SqlParameter` para P_ID_MEDICO e `SqlOutParameter` para P_ID_CONSULTA). Sem isso, o Spring pode escolher a versão errada.
2. FEITO: a carga cria o cidadão fixo de teste (login `cidadao`, senha `Senha123`, CPF `00000000001`) com uma consulta futura AGENDADA.
3. FEITO: a `TRG_GS_CONSULTA_FUTURA` usa o código -20007, que não colide com o -20003 ("fila vazia") da procedure.
4. As senhas da carga estão em texto puro. A API converte para BCrypt na inicialização (`SenhaHashRunner`): todo valor de `senha` que não começa com `$2` vira hash.

Usuários de teste: `gestor` / `SenhaGestor2026` (GESTOR) e `cidadao` / `Senha123` (CIDADAO).

## 4. Autenticação

- `POST /api/auth/login` devolve um JWT (HS256), gerado com o `JwtEncoder` do Spring Security (OAuth2 Resource Server) e validado pelo `JwtDecoder`. Validade: 8 horas (`jwt.expiration-seconds: 28800`).
- Claims: `sub` = login, `id` = id_usuario, `credencial` = CIDADAO ou GESTOR. Um `JwtAuthenticationConverter` transforma `credencial` na authority `ROLE_<credencial>`.
- O mobile envia o token em todas as rotas protegidas: `Authorization: Bearer <token>`.
- Uma resposta 401 no mobile faz logout e volta para a tela de login.
- Roles no Spring: `ROLE_CIDADAO` e `ROLE_GESTOR`.

## 5. Formato padrão

- Datas em ISO 8601 sem fuso: `"2026-11-23T08:00:00"`, no horário de Brasília. Datas sem hora: `"1990-05-10"`.
- Todo GET de lista é paginado: `?page=0&size=10&sort=campo,asc`. A resposta usa o formato de página do Spring (`content`, `totalElements`, `totalPages`, `number`, `size`).
- Erro padrão, para TODO 4xx e 5xx:

```json
{
  "status": 422,
  "erro": "Unprocessable Entity",
  "mensagem": "Nao ha pacientes aguardando para as especialidades e unidades deste medico.",
  "campos": [{ "campo": "cpf", "mensagem": "CPF deve ter 11 digitos" }],
  "caminho": "/api/gestor/agendamentos",
  "timestamp": "2026-11-15T22:40:00"
}
```

`campos` só aparece em erros de validação (400). O mobile sempre mostra `mensagem` ao usuário.

## 6. Endpoints

Legenda de papel: **pub** = público; **logado** = qualquer usuário autenticado; **CID** = CIDADAO; **GES** = GESTOR; **dono** = o recurso pertence ao usuário do token.

### Auth e usuário

| Método | Rota | Papel | Request | Response |
|---|---|---|---|---|
| POST | `/api/auth/register` | pub | RegisterRequest | 201 LoginResponse |
| POST | `/api/auth/login` | pub | LoginRequest | 200 LoginResponse |
| GET | `/api/usuarios/me` | logado | — | 200 UsuarioResponse |
| PUT | `/api/usuarios/me` | logado | UsuarioUpdateRequest | 200 UsuarioResponse |

### Catálogo

| Método | Rota | Papel | Observação |
|---|---|---|---|
| GET | `/api/especialidades` | logado | Paginado |
| GET | `/api/especialidades/{id}` | logado | |
| POST / PUT / DELETE | `/api/especialidades[/{id}]` | GES | CRUD |
| GET | `/api/unidades` | logado | Paginado, só ATIVO para o CID, com endereço |
| GET | `/api/unidades/{id}` | logado | |
| POST / PUT / DELETE | `/api/unidades[/{id}]` | GES | DELETE = status INATIVO |
| GET | `/api/medicos?especialidade=&unidade=` | GES | Paginado |
| POST / PUT / DELETE | `/api/medicos[/{id}]` | GES | DELETE = status INATIVO |

### Fila (solicitações de consulta): CRUD principal do app

| Método | Rota | Papel | Regra |
|---|---|---|---|
| POST | `/api/filas` | CID | Body `{idEspecialidade, idUnidade}`. Cria prioridade 1, AGUARDANDO, data_entrada = agora. 409 se já existir solicitação AGUARDANDO para a mesma especialidade |
| GET | `/api/filas/minhas` | CID | Paginado. Inclui `posicaoEstimada` |
| GET | `/api/filas/{id}` | CID dono ou GES | |
| PUT | `/api/filas/{id}` | CID dono | Body `{idUnidade}`. Só se AGUARDANDO |
| DELETE | `/api/filas/{id}` | CID dono | Desistência: status CANCELADA + data_saida. 204 |
| GET | `/api/filas?status=&especialidade=&unidade=` | GES | Paginado |
| PATCH | `/api/filas/{id}/prioridade` | GES | Body `{prioridade}` (1 a 5) |

Regras do catálogo: excluir uma especialidade em uso (por médico ou fila) devolve 409. Criar ou editar uma unidade grava também o contato e o endereço dela (TB_GS_UN_CONTATO_ENDERECO). POST de especialidade, unidade e médico devolve 201 com o recurso criado.

`posicaoEstimada` = 1 + quantidade de filas AGUARDANDO na mesma especialidade e unidade com `data_entrada` anterior. É uma estimativa: a prioridade pode alterar a ordem real.

### Consultas

| Método | Rota | Papel | Regra |
|---|---|---|---|
| GET | `/api/consultas/minhas?periodo=futuras` | CID | `futuras` (padrão): AGENDADA/CONFIRMADA com data futura. `historico`: o resto. Paginado |
| GET | `/api/consultas/{id}` | CID dono ou GES | |
| PATCH | `/api/consultas/{id}/confirmar` | CID dono | AGENDADA → CONFIRMADA. 409 se em outro status |
| PATCH | `/api/consultas/{id}/cancelar` | CID dono | AGENDADA/CONFIRMADA futura → CANCELADA; a fila vira CANCELADA; publica o evento `vaga.liberada` |
| GET | `/api/consultas/{id}/orientacoes` | CID dono ou GES | Spring AI. Response OrientacaoResponse |

### Gestor

| Método | Rota | Regra |
|---|---|---|
| POST | `/api/gestor/agendamentos` | Body `{idMedico}`. Chama `PRC_AGENDAR_CONSULTA`. 201 ConsultaResponse |
| GET | `/api/gestor/consultas/proximas?dias=15` | Paginado. ConsultaResponse + contato do paciente |
| PATCH | `/api/gestor/consultas/{id}/presenca` | Body `{status: "PRESENTE" \| "FALTA"}`. Só para consultas cuja data já passou |
| GET | `/api/gestor/consultas/risco-falta?dias=15` | RiscoFaltaResponse. Enquanto o modelo de ML não estiver integrado, `risco` = null |

### Infra

| Método | Rota | Papel |
|---|---|---|
| GET | `/actuator/health` | pub |
| GET | `/swagger-ui.html` | pub |

## 7. DTOs

```ts
// Requests
LoginRequest         { login: string; senha: string }
RegisterRequest      {
  nome: string; sobrenome: string; cpf: string /* 11 dígitos */;
  sexo: "F" | "M"; dataNascimento: string /* yyyy-MM-dd */;
  nomeMae: string; nomePai?: string;
  login: string /* máx. 20 */; senha: string /* mín. 6 */;
  telefone: string /* 10 ou 11 dígitos */; email?: string;
  endereco: { cep: string; logradouro: string; numero: number; complemento?: string;
              bairro: string; cidade: string; uf: string }
}
UsuarioUpdateRequest { nome: string; sobrenome: string; telefone: string; email?: string;
                       endereco: RegisterRequest["endereco"] }
EspecialidadeRequest { nome: string /* máx. 50 */; descricao: string /* máx. 200 */ }
UnidadeRequest       { nome: string /* máx. 100 */; telefone: string; email?: string;
                       endereco: RegisterRequest["endereco"] }
MedicoRequest        { nome: string; sobrenome: string; crm: string /* máx. 10 */; ufCrm: string;
                       idsEspecialidades: number[] /* mín. 1 */; idsUnidades: number[] /* mín. 1 */ }
FilaRequest          { idEspecialidade: number; idUnidade: number }
FilaUpdateRequest    { idUnidade: number }
PrioridadeRequest    { prioridade: number /* 1 a 5 */ }

// Responses
LoginResponse        { token: string; usuario: { id: number; nome: string; credencial: "CIDADAO" | "GESTOR" } }
UsuarioResponse      { id: number; nome: string; sobrenome: string; cpf: string; sexo: "F" | "M";
                       dataNascimento: string; login: string; credencial: "CIDADAO" | "GESTOR";
                       telefone: string | null; email: string | null;
                       endereco: RegisterRequest["endereco"] | null }
EspecialidadeResponse { id: number; nome: string; descricao: string }
UnidadeResponse      { id: number; nome: string; status: "ATIVO" | "INATIVO";
                       endereco: string | null /* "Logradouro, 110 - Bairro, Cidade/UF" */; telefone: string | null }
MedicoResponse       { id: number; nome: string; sobrenome: string; crm: string; ufCrm: string;
                       status: "ATIVO" | "INATIVO"; especialidades: EspecialidadeResponse[];
                       unidades: { id: number; nome: string }[] }
FilaResponse         { id: number; status: "AGUARDANDO" | "AGENDADA" | "CANCELADA"; prioridade: number;
                       especialidade: { id: number; nome: string }; unidade: { id: number; nome: string };
                       dataEntrada: string; dataSaida: string | null; posicaoEstimada: number | null }
ConsultaResponse     { id: number; idFila: number;
                       status: "AGENDADA" | "CONFIRMADA" | "CANCELADA" | "PRESENTE" | "FALTA";
                       dataHora: string; diasAteConsulta: number;
                       especialidade: { id: number; nome: string };
                       medico: { id: number; nome: string; crm: string };
                       unidade: { id: number; nome: string; endereco: string | null };
                       paciente?: { id: number; nome: string; telefone: string | null } /* só para o GES */ }
OrientacaoResponse   { idConsulta: number; mensagem: string; geradoEm: string; aviso: string
                       /* "Orientação gerada por IA. Não substitui a orientação médica." */ }
RiscoFaltaResponse   { idConsulta: number; paciente: string; dataHora: string; especialidade: string;
                       risco: number | null /* 0 a 1 */; nivel: "BAIXO" | "MEDIO" | "ALTO" | null }
```

## 8. Mensageria (RabbitMQ)

- Exchange `consultas.exchange` (topic), routing key `vaga.liberada`, fila `vaga.liberada.queue`.
- Evento: `VagaLiberadaEvent { idConsulta, idMedico, idUnidade, idEspecialidade, dataHora }`.
- O consumidor chama `PRC_AGENDAR_CONSULTA(idMedico)`. Erro -20003 (fila vazia) só gera log, sem reprocessar (`default-requeue-rejected: false`).

## 9. Variáveis de ambiente

Nenhuma credencial vai para o repositório. Os dois projetos têm um `.env.example` commitado e um `.env` no `.gitignore`.

API (`.env`, lido com `spring.config.import=optional:file:.env[.properties]`):

```
DB_URL=jdbc:oracle:thin:@HOST:1521:SID
DB_USERNAME=
DB_PASSWORD=
# JWT_SECRET: mínimo de 32 caracteres (HS256)
JWT_SECRET=
AI_API_KEY=
AI_BASE_URL=https://api.openai.com/v1
AI_MODEL=gpt-4o-mini
RABBITMQ_HOST=localhost
RABBITMQ_PORT=5672
RABBITMQ_USERNAME=guest
RABBITMQ_PASSWORD=guest
```

Mobile (`.env`):

```
EXPO_PUBLIC_API_URL=http://SEU_IP_LOCAL:8080
```

## 10. Telas do mobile

| # | Rota (Expo Router) | Tela | Endpoints |
|---|---|---|---|
| 1 | `(auth)/login` | Login | POST /auth/login |
| 2 | `(auth)/cadastro` | Cadastro (CEP preenche o endereço via ViaCEP) | POST /auth/register |
| 3 | `(app)/(tabs)/index` | Início: próxima consulta em destaque + atalhos | GET /consultas/minhas |
| 4 | `(app)/(tabs)/consultas` | Minhas consultas (futuras / histórico) | GET /consultas/minhas |
| 5 | `(app)/(tabs)/filas` | Minhas solicitações | GET /filas/minhas |
| 6 | `(app)/(tabs)/perfil` | Perfil + logout | GET /usuarios/me |
| 7 | `(app)/consulta/[id]` | Detalhe: confirmar, liberar vaga, orientações da IA | GET, PATCH /consultas/{id}/... |
| 8 | `(app)/fila/nova` | Solicitar consulta | GET /especialidades, GET /unidades, POST /filas |
| 9 | `(app)/fila/[id]` | Editar unidade / desistir | GET, PUT, DELETE /filas/{id} |
| 10 | `(app)/perfil/editar` | Editar perfil | PUT /usuarios/me |
| — | `(app)/sobre` | Sobre o App (hash do commit). Não conta nas 6 telas | — |
| fase 2 | `(app)/gestor/*` | Agendar próximo, próximas consultas, risco de falta (só GESTOR) | /api/gestor/* |