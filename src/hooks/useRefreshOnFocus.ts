import { useFocusEffect } from 'expo-router';
import { useCallback, useRef } from 'react';

/**
 * Chama `refresh` sempre que a tela volta a ficar em foco (ex.: ao voltar de outra tela).
 * O primeiro foco é ignorado porque a tela já faz a carga inicial ao montar.
 * `onBlur` (opcional) roda quando a tela perde o foco. As duas funções devem ser estáveis.
 */
export function useRefreshOnFocus(refresh: () => unknown, onBlur?: () => void) {
  const firstFocus = useRef(true);

  useFocusEffect(
    useCallback(() => {
      if (firstFocus.current) firstFocus.current = false;
      else void refresh();
      return onBlur;
    }, [refresh, onBlur]),
  );
}
