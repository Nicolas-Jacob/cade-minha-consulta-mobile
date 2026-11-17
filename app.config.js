// Configuração do app (dinâmica para incluir o hash do commit). Documentação:
// https://docs.expo.dev/workflow/configuration/
const { execSync } = require('node:child_process');

const PRIMARY_COLOR = '#0B5CAD';

/**
 * ID do projeto no Expo (EAS). Rode `eas init` uma vez e cole aqui o ID que ele mostrar.
 * Como esta configuração é dinâmica (.js), o EAS não consegue gravar o ID sozinho.
 */
const EAS_PROJECT_ID = '';

/**
 * Hash curto do commit desta versão, exibido na tela "Sobre o app".
 * - No EAS Build: variável EAS_BUILD_GIT_COMMIT_HASH, definida pelo próprio EAS.
 * - Local (Expo Go): `git rev-parse --short HEAD`.
 */
function getCommitHash() {
  const easHash = process.env.EAS_BUILD_GIT_COMMIT_HASH;
  if (easHash) return easHash.slice(0, 7);

  try {
    return execSync('git rev-parse --short HEAD', { stdio: ['ignore', 'pipe', 'ignore'] })
      .toString()
      .trim();
  } catch {
    return 'desconhecido';
  }
}

/** @type {import('expo/config').ExpoConfig} */
module.exports = {
  name: 'Cadê minha consulta',
  slug: 'cade-minha-consulta-mobile',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/images/icon.png',
  scheme: 'cademinhaconsulta',
  userInterfaceStyle: 'light',
  android: {
    package: 'br.com.fiap.cademinhaconsulta',
    versionCode: 1,
    adaptiveIcon: {
      backgroundColor: PRIMARY_COLOR,
      foregroundImage: './assets/images/android-icon-foreground.png',
      backgroundImage: './assets/images/android-icon-background.png',
      monochromeImage: './assets/images/android-icon-monochrome.png',
    },
    predictiveBackGestureEnabled: false,
  },
  web: {
    output: 'static',
    favicon: './assets/images/favicon.png',
  },
  plugins: [
    'expo-router',
    [
      'expo-splash-screen',
      {
        backgroundColor: PRIMARY_COLOR,
        image: './assets/images/splash-icon.png',
        imageWidth: 200,
      },
    ],
    'expo-secure-store',
  ],
  experiments: {
    typedRoutes: true,
    reactCompiler: true,
  },
  extra: {
    commitHash: getCommitHash(),
    ...(EAS_PROJECT_ID ? { eas: { projectId: EAS_PROJECT_ID } } : {}),
  },
};
