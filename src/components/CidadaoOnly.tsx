import type { ReactNode } from 'react';

import { useAuth } from '@/hooks/useAuth';

import { EmptyState } from './EmptyState';
import { Screen } from './Screen';

/**
 * Mostra o conteúdo só para o CIDADAO. O GESTOR vê um aviso, em vez de a tela
 * chamar endpoints do cidadão que devolveriam 403 (a área do gestor é da fase 2).
 */
export function CidadaoOnly({ children }: { children: ReactNode }) {
  const { usuario } = useAuth();

  if (usuario?.credencial === 'GESTOR') {
    return (
      <Screen>
        <EmptyState
          icon="briefcase-outline"
          title="Área do gestor disponível em breve"
          description="Esta tela é para cidadãos. As ferramentas da unidade de saúde estão em construção."
        />
      </Screen>
    );
  }

  return children;
}
