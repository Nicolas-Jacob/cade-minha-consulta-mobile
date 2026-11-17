# Cadê minha consulta — App mobile

<p align="center">
  <img src="assets/images/icon.png" alt="Ícone do app: alfinete de mapa com uma cruz de saúde sobre fundo azul" width="120" />
</p>

Aplicativo Android/iOS do projeto **Cadê minha consulta**: Global Solution FIAP 2026/2, tema **CitizenTech**, alinhado à **ODS 3 (Saúde e bem-estar)**.

| Entrega                 | Link                                                                                              |
| ----------------------- | ------------------------------------------------------------------------------------------------- |
| Vídeo de demonstração   | LINK_VIDEO                                                                                        |
| API Java (repositório)  | [Nicolas-Jacob/cade-minha-consulta-api](https://github.com/Nicolas-Jacob/cade-minha-consulta-api) |
| API Java (deploy)       | https://cademinhaconsulta-rm564205.azurewebsites.net                                              |
| Versão publicada (hash) | `6c567c8` (Firebase App Distribution, versão 1.0.0)                                        |

## Problema

No SUS, cerca de **1 em cada 4 pacientes falta à consulta com especialista sem avisar**. A vaga, que levou meses para sair, é desperdiçada enquanto outras pessoas continuam esperando na fila. Hoje o paciente tem pouca informação sobre o próprio pedido e não tem um jeito simples de avisar que não vai.

## Solução

Pelo app, o cidadão:

- acompanha seus **pedidos de consulta** (posição estimada na fila) e suas **consultas** marcadas;
- **confirma presença** ou **libera a vaga** com um toque. Quando uma vaga é liberada, a API agenda automaticamente o próximo paciente compatível da fila;
- recebe **orientações de preparo** para a consulta, escritas por IA generativa em linguagem simples.

O gestor da unidade de saúde usa o mesmo app para ver as próximas consultas, **agendar o próximo paciente da fila** de um médico e acompanhar o **risco de falta** de cada consulta (modelo de Machine Learning integrado pela API).

## Público

- **Cidadão usuário do SUS** que espera ou já tem consulta com especialista. Muitos têm pouca familiaridade com tecnologia ou baixa visão: por isso, textos simples, fonte de alta legibilidade, bom contraste e botões grandes.
- **Gestor/regulador da unidade de saúde**, que organiza a agenda e a fila.

## Equipe

| Nome                           | RM       | Turma  |
| ------------------------------ | -------- | ------ |
| João Victor Vendrameto         | RM563665 | 2TDSPV |
| Nicolas de Oliveira Jacob      | RM564205 | 2TDSPX |
| Gabriel Ambrósio Saraiva       | RM566552 | 2TDSPV |
| Vinicius Romaguera Cardozo     | RM562308 | 2TDSPX |
| Yuri Fuzinatto Garzoli Barreto | RM561450 | 2TDSPX |

> Os mesmos nomes aparecem na tela "Sobre o app" (lista `EQUIPE` em [src/utils/appInfo.ts](src/utils/appInfo.ts)).

## Declaração de uso de IA

- **Claude (Anthropic):** apoio no planejamento da arquitetura, na geração de partes do código, na revisão de erros e na documentação.
- Todo o código foi revisado, testado e integrado pela equipe, que entende e responde pelo funcionamento da solução.
- **No produto:** a API usa IA generativa (Spring AI) para escrever as orientações de preparo. O app sempre mostra o aviso de que o texto não substitui a orientação médica.

## Funcionalidades

**Cidadão**

- Criar conta (o CEP preenche o endereço automaticamente via ViaCEP), entrar e sair.
- Ver a próxima consulta em destaque na tela inicial.
- Listar consultas futuras e o histórico.
- Ver os detalhes da consulta, confirmar presença, liberar a vaga e ler as orientações de preparo feitas por IA.
- Solicitar consulta com especialista (escolhendo especialidade e unidade), acompanhar a posição estimada na fila, trocar a unidade e desistir do pedido. **Este é o CRUD principal do app** (POST, GET, PUT e DELETE em `/api/filas`).
- Ver e editar o perfil (nome, contato e endereço, com o CEP preenchendo o endereço) e a tela "Sobre o app" (versão e hash do commit).

**Gestor**

- Painel com as consultas dos próximos 15 dias e o contato do paciente.
- Agendar o próximo paciente da fila de um médico.
- Lista de risco de falta das próximas consultas.
- Perfil (com edição dos dados) e "Sobre o app".

Toda chamada à API mostra carregamento, mensagem de erro (o campo `mensagem` devolvido pela API, com botão de tentar de novo) e estado vazio.

## Telas

| #   | Tela                 | Rota (`src/app`)         | Papel   | Print                               |
| --- | -------------------- | ------------------------ | ------- | ----------------------------------- |
| 1   | Login                | `(auth)/login`           | todos   | ![](docs/prints/login.png)          |
| 2   | Criar conta          | `(auth)/cadastro`        | todos   | ![](docs/prints/cadastro.png)       |
| 3   | Início               | `(app)/(tabs)/index`     | cidadão | ![](docs/prints/inicio.png)         |
| 4   | Minhas consultas     | `(app)/(tabs)/consultas` | cidadão | ![](docs/prints/consultas.png)      |
| 5   | Minhas solicitações  | `(app)/(tabs)/filas`     | cidadão | ![](docs/prints/filas.png)          |
| 6   | Perfil               | `(app)/(tabs)/perfil`    | todos   | ![](docs/prints/perfil.png)         |
| 7   | Detalhes da consulta | `(app)/consulta/[id]`    | cidadão | ![](docs/prints/consulta.png)       |
| 8   | Solicitar consulta   | `(app)/fila/nova`        | cidadão | ![](docs/prints/fila-nova.png)      |
| 9   | Detalhes do pedido   | `(app)/fila/[id]`        | cidadão | ![](docs/prints/fila.png)           |
| 10  | Editar perfil        | `(app)/perfil/editar`    | todos   | ![](docs/prints/perfil-editar.png)  |
| 11  | Painel do gestor     | `(app)/gestor/index`     | gestor  | ![](docs/prints/gestor-painel.png)  |
| 12  | Agendar pela fila    | `(app)/gestor/agendar`   | gestor  | ![](docs/prints/gestor-agendar.png) |
| 13  | Risco de falta       | `(app)/gestor/risco`     | gestor  | ![](docs/prints/gestor-risco.png)   |
| —   | Sobre o app          | `(app)/sobre`            | todos   | ![](docs/prints/sobre.png)          |

> Salve os prints em `docs/prints/` com os nomes acima.

## Identidade visual

- **Ícone e splash próprios:** um alfinete de mapa ("cadê?") com uma cruz de saúde, sobre o azul primário `#0B5CAD`. Os arquivos-fonte em SVG ficam em [assets/images/source/](assets/images/source/). Os PNG foram gerados com `npx sharp-cli` (sem dependência no projeto).
- **Paleta** ([src/theme/colors.ts](src/theme/colors.ts)): azul institucional da saúde, verde para confirmação, vermelho para ações destrutivas e âmbar para alertas. Todos os pares texto/fundo atendem ao contraste WCAG AA (4,5:1).
- **Fonte Atkinson Hyperlegible**, criada pelo Braille Institute para leitura fácil por pessoas com baixa visão.
- **Acessibilidade:** `accessibilityLabel` e `accessibilityRole` nos elementos interativos, área de toque mínima de 48 px e textos curtos em português simples.

## Stack e justificativa

| Biblioteca                                                           | Para que serve no app                                                                                              |
| -------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| **Expo** (SDK 58) + **React Native**                                 | Base do app multiplataforma. Permite testar no Expo Go e gerar o APK pelo EAS Build sem configurar Android Studio. |
| **Expo Router**                                                      | Navegação baseada em arquivos (`src/app`), com grupos para separar telas públicas e protegidas e abas por papel.   |
| **TypeScript**                                                       | Tipagem dos DTOs do contrato da API, evitando erros de campo e de status.                                          |
| **axios**                                                            | Cliente HTTP com interceptors: injeta o token JWT e faz logout automático em respostas 401.                        |
| **expo-secure-store**                                                | Guarda o token no armazenamento criptografado do aparelho (Keychain/Keystore), e não em texto puro.                |
| **expo-font** + Atkinson Hyperlegible                                | Fonte de alta legibilidade para o público do SUS.                                                                  |
| **expo-constants**                                                   | Lê a versão e o hash do commit (definidos em `app.config.js`) para a tela "Sobre o app".                           |
| **expo-splash-screen**                                               | Mantém a tela de abertura enquanto a fonte carrega e a sessão salva é verificada.                                  |
| **@expo/vector-icons** (Ionicons)                                    | Ícones das abas, botões e estados (já vem com o Expo).                                                             |
| expo-status-bar, expo-system-ui, expo-linking                        | Barra de status, cor de fundo do sistema e links (abrir o mapa da unidade). Padrão do template Expo.               |
| react-native-screens, safe-area-context, gesture-handler, reanimated | Dependências exigidas pelo Expo Router e pela navegação nativa.                                                    |
| **ESLint** (eslint-config-expo) + **Prettier**                       | Padrão de código e formatação automática.                                                                          |

## Arquitetura

```
app.config.js     configuração do Expo (pacote Android, versão, ícones, hash do commit)
eas.json          perfis do EAS Build (preview = APK para o Firebase App Distribution)
src/
  app/            NAVEGAÇÃO (Expo Router): cada arquivo é uma rota
    _layout.tsx     carrega a fonte, segura o splash e envolve tudo no AuthProvider
    (auth)/         telas públicas: login e cadastro. Com sessão, redireciona para a área do papel
    (app)/          área PROTEGIDA: sem sessão, qualquer rota redireciona para o login
      (tabs)/         abas do cidadão: início, consultas, solicitações, perfil
      gestor/         abas do gestor: painel, agendar, risco de falta, perfil (só GESTOR)
      consulta/, fila/  telas de detalhe e de solicitação
      perfil/editar.tsx edição dos dados do usuário (PUT /usuarios/me)
      sobre.tsx       Sobre o app (versão e hash do commit)
  services/       CAMADA DE API: instância axios (api.ts) e um serviço por recurso
                  (auth, usuário, fila, consultas, orientações, catálogo, gestor, ViaCEP, tokenStorage)
  contexts/       AUTENTICAÇÃO: AuthContext (login, cadastro, logout, restauração da sessão, logout em 401)
  hooks/          lógica reutilizável das telas: useAuth, useApiRequest (loading/erro/dados),
                  usePaginatedList, useRefreshOnFocus, useSuccessParam, useConsultaAcoes, useCepLookup,
                  useUsuarioForm (base dos formulários de usuário), useCadastroForm, useEditarPerfilForm
  components/     COMPONENTES de interface reutilizáveis: Button, Input, Card, Loading,
                  ErrorMessage, EmptyState, ConsultaCard, FilaCard, StatusBadge,
                  UsuarioFormFields (campos de nome, contato e endereço)
  theme/          TEMA: cores, tipografia, espaçamentos e opções de navegação
  types/          tipos dos DTOs do contrato da API
  utils/          funções puras: máscaras, validações, datas, erros da API, dados do app (appInfo)
assets/
  fonts/          Atkinson Hyperlegible (licença OFL)
  images/         ícone, ícone adaptativo do Android, splash e favicon (fonte SVG em source/)
docs/
  CONTRATO_API.md contrato com a API, idêntico nos dois repositórios
```

**Fluxo de uma chamada:** a tela usa um hook (`useApiRequest` ou `usePaginatedList`), que chama um serviço (`services/`), que usa a instância `api` do axios. O interceptor adiciona `Authorization: Bearer <token>`. Se a API responder 401 em uma rota protegida, o `AuthContext` encerra a sessão e o layout `(app)` manda o usuário para o login. Erros viram a `mensagem` do erro padrão da API (`utils/apiError.ts`).

## Integração com a API Java

- Repositório: https://github.com/Nicolas-Jacob/cade-minha-consulta-api
- Deploy (Azure): https://cademinhaconsulta-rm564205.azurewebsites.net
- O contrato (endpoints, DTOs, erros) está em [docs/CONTRATO_API.md](docs/CONTRATO_API.md), que é a fonte única da verdade.
- O app lê o endereço da API de `EXPO_PUBLIC_API_URL`: o `.env` no desenvolvimento e o `eas.json` no build publicado (HTTPS).

## Como rodar localmente

Pré-requisitos: Node.js LTS, o app **Expo Go** no celular e a API rodando no computador (ou na nuvem).

1. Instale as dependências:

   ```bash
   npm install
   ```

2. Crie o `.env` a partir do exemplo e informe o endereço da API:

   ```bash
   cp .env.example .env
   ```

   ```
   EXPO_PUBLIC_API_URL=http://192.168.0.10:8080
   ```

   | Variável              | Descrição                                                                                                                                                                                                                  |
   | --------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
   | `EXPO_PUBLIC_API_URL` | Endereço da API Java, **sem** `/api` no final. No celular, use o IP do computador na rede local (no Windows, veja com `ipconfig`): `localhost` aponta para o próprio celular. Pode ser também a URL HTTPS da API na nuvem. |

   O `.env` não vai para o repositório. Depois de alterar o arquivo, reinicie com `npx expo start -c`.

3. Inicie o app e leia o QR Code com o Expo Go:

   ```bash
   npx expo start
   ```

A tela "Sobre o app" (Perfil → Sobre o app) mostra o hash do commit local, obtido com `git rev-parse --short HEAD`.

### Usuários de teste

Criados pela carga do banco da API:

| Papel   | Login     | Senha             |
| ------- | --------- | ----------------- |
| Cidadão | `cidadao` | `Senha123`        |
| Gestor  | `gestor`  | `SenhaGestor2026` |

Também é possível criar um cidadão novo pela tela "Criar conta".

### Scripts

| Comando                | O que faz                       |
| ---------------------- | ------------------------------- |
| `npm start`            | Inicia o Expo                   |
| `npm run lint`         | ESLint                          |
| `npm run format`       | Formata o código com Prettier   |
| `npm run format:check` | Verifica a formatação           |
| `npm run typecheck`    | Checagem de tipos do TypeScript |

## Como gerar o build (APK)

O perfil `preview` do [eas.json](eas.json) gera um **APK** (`android.buildType: "apk"`) com `distribution: "internal"`, pronto para o Firebase App Distribution.

1. Instale o EAS CLI e entre na sua conta Expo:

   ```bash
   npm install -g eas-cli
   eas login
   ```

2. Vincule o projeto (só na primeira vez):

   ```bash
   eas init
   ```

   Como a configuração é dinâmica (`app.config.js`), o EAS não consegue gravar os valores sozinho. Eles já estão nas constantes `EAS_OWNER` e `EAS_PROJECT_ID` do [app.config.js](app.config.js).

3. O perfil `preview` do [eas.json](eas.json) já aponta `EXPO_PUBLIC_API_URL` para a API no Azure (https://cademinhaconsulta-rm564205.azurewebsites.net, sem `/api` no final).

4. Faça o commit das mudanças. O hash exibido no app é o do commit usado no build.

5. Gere o APK:

   ```bash
   eas build -p android --profile preview
   ```

   Ao final, o EAS mostra o link para baixar o `.apk`.

**Hash do commit no build:** o `app.config.js` usa a variável `EAS_BUILD_GIT_COMMIT_HASH`, que o EAS Build define automaticamente ([documentação](https://docs.expo.dev/eas/environment-variables/usage/)). Fora do EAS, usa `git rev-parse --short HEAD`. O valor vai para `extra.commitHash` e é lido com `expo-constants`.

## Publicação: Firebase App Distribution

1. No [Console do Firebase](https://console.firebase.google.com/), crie (ou abra) o projeto e adicione um app Android com o pacote **`br.com.fiap.cademinhaconsulta`**.
2. Em **Release & Monitor → App Distribution**, envie o `.apk` gerado pelo EAS.
3. Adicione os testadores (e-mail do professor e da equipe) e distribua a versão.
4. Os testadores recebem o convite por e-mail e instalam pelo app Firebase App Tester.

**Versão publicada:** 1.0.0, commit `6c567c8` (o mesmo que aparece em Perfil → Sobre o app no APK instalado).
