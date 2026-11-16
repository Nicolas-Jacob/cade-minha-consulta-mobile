import { CidadaoOnly, EmptyState, Screen } from '@/components';

// Placeholder: lista de solicitações (GET /filas/minhas) na próxima etapa.
export default function FilasScreen() {
  return (
    <CidadaoOnly>
      <Screen>
        <EmptyState
          icon="document-text-outline"
          title="Em breve"
          description="Aqui você vai acompanhar seus pedidos de consulta e sua posição na fila."
        />
      </Screen>
    </CidadaoOnly>
  );
}
