import { Linking, Platform } from 'react-native';

/**
 * Abre o aplicativo de mapas do celular buscando o endereço.
 * Se o app nativo não abrir, tenta o Google Maps no navegador.
 * Rejeita a Promise se nenhuma das duas opções funcionar.
 */
export async function abrirMapa(endereco: string) {
  const query = encodeURIComponent(endereco);
  const webUrl = `https://www.google.com/maps/search/?api=1&query=${query}`;
  if (Platform.OS === 'web') {
    await Linking.openURL(webUrl);
    return;
  }

  const nativeUrl =
    Platform.OS === 'ios' ? `https://maps.apple.com/?q=${query}` : `geo:0,0?q=${query}`;
  try {
    await Linking.openURL(nativeUrl);
  } catch {
    await Linking.openURL(webUrl);
  }
}
