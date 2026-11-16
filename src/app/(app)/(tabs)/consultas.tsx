import { router } from 'expo-router';
import { useCallback, useState } from 'react';

import {
  ConsultaCard,
  EmptyState,
  ErrorMessage,
  Loading,
  OptionGroup,
  PaginatedList,
  Screen,
} from '@/components';
import { usePaginatedList } from '@/hooks/usePaginatedList';
import { useRefreshOnFocus } from '@/hooks/useRefreshOnFocus';
import { consultaService } from '@/services/consultaService';
import type { PageParams, PeriodoConsulta } from '@/types/api';

const PERIODOS: { value: PeriodoConsulta; label: string }[] = [
  { value: 'futuras', label: 'Próximas' },
  { value: 'historico', label: 'Histórico' },
];

export default function ConsultasScreen() {
  const [periodo, setPeriodo] = useState<PeriodoConsulta>('futuras');

  return (
    <Screen>
      <OptionGroup
        label="Quais consultas mostrar"
        hideLabel
        options={PERIODOS}
        value={periodo}
        onChange={setPeriodo}
      />
      {/* A key recria a lista ao trocar o período: começa do zero, com o carregamento visível. */}
      <ListaConsultas key={periodo} periodo={periodo} />
    </Screen>
  );
}

function ListaConsultas({ periodo }: { periodo: PeriodoConsulta }) {
  const fetchPage = useCallback(
    (params: PageParams) => consultaService.listarMinhas(periodo, params),
    [periodo],
  );
  const lista = usePaginatedList(fetchPage);
  const { items, loading, refreshing, error, refresh, retry } = lista;

  // Ao voltar do detalhe (depois de confirmar ou liberar a vaga), busca a lista de novo.
  useRefreshOnFocus(refresh);

  if (loading) return <Loading message="Carregando suas consultas..." />;
  if (error && items.length === 0) return <ErrorMessage message={error} onRetry={retry} />;
  if (!refreshing && !error && items.length === 0) {
    return periodo === 'futuras' ? (
      <EmptyState
        icon="calendar-clear-outline"
        title="Você não tem consultas marcadas"
        description="Quando a unidade de saúde agendar sua consulta, ela aparece aqui."
        action={{ label: 'Ver minhas solicitações', onPress: () => router.navigate('/filas') }}
      />
    ) : (
      <EmptyState
        icon="time-outline"
        title="Seu histórico está vazio"
        description="Consultas que já passaram ou foram canceladas aparecem aqui."
      />
    );
  }

  return (
    <PaginatedList
      list={lista}
      loadingMoreLabel="Carregando mais consultas"
      renderItem={(consulta) => (
        <ConsultaCard
          consulta={consulta}
          onPress={() => router.push({ pathname: '/consulta/[id]', params: { id: consulta.id } })}
        />
      )}
    />
  );
}
