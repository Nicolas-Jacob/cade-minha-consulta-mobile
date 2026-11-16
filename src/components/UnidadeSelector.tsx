import { useCallback } from 'react';

import { useApiRequest } from '@/hooks/useApiRequest';
import { catalogoService } from '@/services/catalogoService';

import { EmptyState } from './EmptyState';
import { ErrorMessage } from './ErrorMessage';
import { Loading } from './Loading';
import { SelectableList } from './SelectableList';

interface UnidadeSelectorProps {
  especialidade: { id: number; nome: string };
  selectedId: number | null;
  onSelect: (id: number) => void;
}

/**
 * Busca e lista as unidades que atendem a especialidade (GET /unidades?especialidade=),
 * com loading, erro e estado vazio. Usado ao solicitar consulta e ao trocar de unidade.
 */
export function UnidadeSelector({ especialidade, selectedId, onSelect }: UnidadeSelectorProps) {
  const request = useCallback(
    () => catalogoService.listarUnidades(especialidade.id),
    [especialidade.id],
  );
  const { data: unidades, loading, error, reload } = useApiRequest(request);

  if (loading) return <Loading message="Buscando unidades..." />;
  if (error) return <ErrorMessage message={error} onRetry={reload} />;
  if (!unidades || unidades.length === 0) {
    return (
      <EmptyState
        icon="business-outline"
        title="Nenhuma unidade disponível"
        description={`Ainda não há unidade de saúde com atendimento em ${especialidade.nome}. Tente novamente mais tarde.`}
      />
    );
  }

  return (
    <SelectableList
      label="Unidades de saúde"
      items={unidades.map((unidade) => ({
        id: unidade.id,
        title: unidade.nome,
        description: unidade.endereco,
      }))}
      selectedId={selectedId}
      onSelect={onSelect}
    />
  );
}
