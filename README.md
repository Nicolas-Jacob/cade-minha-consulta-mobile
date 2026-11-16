# Cadê minha consulta — App mobile

Aplicativo do projeto **Cadê minha consulta** (Global Solution FIAP 2026/2, tema CitizenTech, ODS 3 — Saúde e bem-estar).

No SUS, cerca de 1 em cada 4 pacientes falta à consulta com especialista sem avisar, e a vaga que levou meses para sair é desperdiçada. Pelo app, o cidadão acompanha suas solicitações e consultas, confirma presença ou libera a vaga com um toque; quando uma vaga é liberada, o sistema agenda automaticamente o próximo paciente da fila.

O app consome a API Java do projeto (`cade-minha-consulta-api`). O contrato entre os dois está em [docs/CONTRATO_API.md](docs/CONTRATO_API.md).

## Stack

- [Expo](https://expo.dev) + [Expo Router](https://docs.expo.dev/router/introduction/) (rotas por arquivos em `src/app`)
- TypeScript
- axios (chamadas HTTP)
- expo-secure-store (token de acesso guardado com segurança no aparelho)
- expo-font com a fonte Atkinson Hyperlegible (Google Fonts, licença OFL), criada para leitura fácil por pessoas com baixa visão
- @expo/vector-icons (Ionicons)
- ESLint + Prettier

## Estrutura

```
src/
  app/          rotas (Expo Router): (auth) login/cadastro e (app) área logada com abas
  components/   componentes reutilizáveis (Button, Input, Card, Loading, ErrorMessage...)
  contexts/     AuthContext (sessão do usuário)
  hooks/        useAuth, useApiRequest, useCepLookup, useCadastroForm
  services/     instância axios, autenticação, usuário, ViaCEP, armazenamento do token
  theme/        cores, tipografia e espaçamentos
  types/        tipos da API (DTOs do contrato)
  utils/        máscaras, validações, datas e tratamento de erros
assets/
  fonts/        Atkinson Hyperlegible
  images/       ícone e splash
```

## Como rodar

Pré-requisitos: Node.js LTS, o app **Expo Go** no celular e a API rodando no seu computador.

1. Instale as dependências:

   ```bash
   npm install
   ```

2. Crie o arquivo `.env` a partir do exemplo e informe o endereço da API:

   ```bash
   cp .env.example .env
   ```

   ```
   EXPO_PUBLIC_API_URL=http://192.168.0.10:8080
   ```

   | Variável              | Descrição                                                                                                                                                                                                                                                   |
   | --------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
   | `EXPO_PUBLIC_API_URL` | Endereço da API Java, **sem** `/api` no final. No celular, use o IP do computador na rede local (no Windows, veja com `ipconfig`); `localhost` não funciona, porque aponta para o próprio celular. Celular e computador precisam estar na mesma rede Wi-Fi. |

   O `.env` não vai para o repositório. Depois de alterar o arquivo, reinicie o Expo com `npx expo start -c`.

3. Inicie o app e leia o QR Code com o Expo Go:

   ```bash
   npx expo start
   ```

Usuário de teste (criado pela carga do banco): `cidadao` / `Senha123`.

## Scripts

| Comando                | O que faz                       |
| ---------------------- | ------------------------------- |
| `npm start`            | Inicia o Expo                   |
| `npm run lint`         | ESLint                          |
| `npm run format`       | Formata o código com Prettier   |
| `npm run format:check` | Verifica a formatação           |
| `npm run typecheck`    | Checagem de tipos do TypeScript |
