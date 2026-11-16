import { CidadaoOnly, EmptyState, Screen } from '@/components';

// Placeholder: lista de consultas futuras e histórico (GET /consultas/minhas) na próxima etapa.
export default function ConsultasScreen() {
  return (
    <CidadaoOnly>
      <Screen>
        <EmptyState
          icon="calendar-outline"
          title="Em breve"
          description="Aqui você vai ver suas consultas marcadas e o histórico."
        />
      </Screen>
    </CidadaoOnly>
  );
}
