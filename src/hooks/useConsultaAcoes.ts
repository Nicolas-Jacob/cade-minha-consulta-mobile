import { useCallback, useState } from 'react';
import { Alert } from 'react-native';

import { consultaService } from '@/services/consultaService';
import type { ConsultaResponse } from '@/types/api';
import { getErrorMessage } from '@/utils/apiError';
import { isoToBrDateTime } from '@/utils/date';

const AVISO_CONFIRMADA = 'Presença confirmada! Esperamos você no dia da consulta.';
const AVISO_VAGA_LIBERADA = 'Vaga liberada. Obrigado por avisar!';

type Acao = 'confirmando' | 'liberando' | null;

/**
 * Ações do cidadão sobre uma consulta: confirmar presença e liberar a vaga.
 * `onUpdated` recebe a consulta atualizada devolvida pela API e deve ser estável.
 * Erros (403, 404, 409...) viram `erro` com a mensagem da API.
 */
export function useConsultaAcoes(onUpdated: (consulta: ConsultaResponse) => void) {
  const [acao, setAcao] = useState<Acao>(null);
  const [erro, setErro] = useState<string | null>(null);
  const [aviso, setAviso] = useState<string | null>(null);

  const executar = useCallback(
    async (
      novaAcao: Exclude<Acao, null>,
      chamada: () => Promise<ConsultaResponse>,
      mensagem: string,
    ) => {
      setAcao(novaAcao);
      setErro(null);
      setAviso(null);
      try {
        onUpdated(await chamada());
        setAviso(mensagem);
      } catch (error) {
        setErro(getErrorMessage(error));
      } finally {
        setAcao(null);
      }
    },
    [onUpdated],
  );

  const confirmar = useCallback(
    (consulta: ConsultaResponse) =>
      executar('confirmando', () => consultaService.confirmar(consulta.id), AVISO_CONFIRMADA),
    [executar],
  );

  /** Pede confirmação antes de liberar a vaga, porque não dá para desfazer. */
  const liberarVaga = useCallback(
    (consulta: ConsultaResponse) => {
      Alert.alert(
        'Liberar a vaga?',
        `Sua consulta de ${consulta.especialidade.nome} em ${isoToBrDateTime(consulta.dataHora)} ` +
          'será cancelada e a vaga vai para a próxima pessoa da fila. Isso não pode ser desfeito.',
        [
          { text: 'Voltar', style: 'cancel' },
          {
            text: 'Liberar vaga',
            style: 'destructive',
            onPress: () =>
              void executar(
                'liberando',
                () => consultaService.cancelar(consulta.id),
                AVISO_VAGA_LIBERADA,
              ),
          },
        ],
      );
    },
    [executar],
  );

  const limparAviso = useCallback(() => setAviso(null), []);

  return {
    confirmar,
    liberarVaga,
    confirmando: acao === 'confirmando',
    liberando: acao === 'liberando',
    ocupado: acao !== null,
    erro,
    aviso,
    limparAviso,
  };
}
