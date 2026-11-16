import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';

import {
  Button,
  Card,
  EmptyState,
  ErrorMessage,
  InfoRow,
  Input,
  Loading,
  Screen,
  SelectableList,
  SuccessMessage,
} from '@/components';
import { useApiRequest } from '@/hooks/useApiRequest';
import { catalogoService } from '@/services/catalogoService';
import { gestorService } from '@/services/gestorService';
import { spacing, typography } from '@/theme';
import type { ConsultaResponse, MedicoResponse } from '@/types/api';
import { getErrorMessage } from '@/utils/apiError';
import { dataHoraPorExtenso } from '@/utils/consulta';
import { maskPhone } from '@/utils/masks';
import { normalizeSearch } from '@/utils/text';

function nomeMedico(medico: MedicoResponse) {
  return `Dr(a). ${medico.nome} ${medico.sobrenome}`;
}

/** Especialidades e unidades em que o médico atende (a fila dele é a dessas combinações). */
function descricaoMedico(medico: MedicoResponse) {
  const especialidades = medico.especialidades.map((item) => item.nome).join(', ');
  const unidades = medico.unidades.map((item) => item.nome).join(', ');
  return `${especialidades}\n${unidades}`;
}

/**
 * O gestor escolhe um médico ativo e a API agenda o próximo paciente compatível da fila
 * (por prioridade e antiguidade) no primeiro horário livre do médico.
 */
export default function AgendarScreen() {
  const [agendando, setAgendando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [criada, setCriada] = useState<ConsultaResponse | null>(null);

  async function agendar(medico: MedicoResponse) {
    setAgendando(true);
    setErro(null);
    try {
      setCriada(await gestorService.agendar({ idMedico: medico.id }));
    } catch (error) {
      // 422 (fila vazia) e 409 (médico inativo, sem horário...) chegam com a mensagem da API.
      setErro(getErrorMessage(error));
    } finally {
      setAgendando(false);
    }
  }

  function confirmarAgendamento(medico: MedicoResponse) {
    if (agendando) return;
    Alert.alert(
      'Agendar consulta',
      `Agendar o próximo paciente da fila para ${nomeMedico(medico)}?`,
      [
        { text: 'Voltar', style: 'cancel' },
        { text: 'Agendar', onPress: () => void agendar(medico) },
      ],
    );
  }

  if (criada) {
    return (
      <Screen scroll>
        <SuccessMessage message="Consulta agendada! O paciente já pode vê-la no aplicativo." />
        <ResumoConsulta consulta={criada} />
        <Button
          title="Ver no Painel"
          icon="grid-outline"
          onPress={() => router.navigate('/gestor')}
          accessibilityHint="Mostra as próximas consultas da unidade"
        />
        <Button
          title="Agendar outro paciente"
          variant="secondary"
          icon="add-circle-outline"
          onPress={() => setCriada(null)}
        />
      </Screen>
    );
  }

  return (
    <Screen scroll>
      <Text style={styles.intro}>
        Escolha o médico. O próximo paciente da fila dele (por prioridade e ordem de chegada) será
        agendado no primeiro horário livre.
      </Text>
      {erro && <ErrorMessage message={erro} />}
      {agendando && <Loading message="Agendando o próximo paciente da fila..." />}
      {/* Enquanto agenda, a lista só fica oculta: a tela volta ao topo (carregamento e erro
          visíveis) e, se falhar, a lista reaparece sem nova busca e com o mesmo filtro. */}
      <View style={[styles.lista, agendando && styles.oculta]}>
        <MedicoPicker onSelect={confirmarAgendamento} />
      </View>
    </Screen>
  );
}

function ResumoConsulta({ consulta }: { consulta: ConsultaResponse }) {
  const { paciente } = consulta;

  return (
    <Card>
      <Text style={styles.titulo} accessibilityRole="header">
        {consulta.especialidade.nome}
      </Text>
      <InfoRow label="Paciente" value={paciente?.nome ?? null} />
      <InfoRow
        label="Telefone do paciente"
        value={paciente?.telefone ? maskPhone(paciente.telefone) : null}
      />
      <InfoRow label="Data e hora" value={dataHoraPorExtenso(consulta.dataHora)} />
      <InfoRow label="Unidade de saúde" value={consulta.unidade.nome} />
      <InfoRow label="Médico(a)" value={consulta.medico.nome} />
    </Card>
  );
}

function MedicoPicker({ onSelect }: { onSelect: (medico: MedicoResponse) => void }) {
  const {
    data: medicos,
    loading,
    error,
    reload,
  } = useApiRequest(catalogoService.listarMedicosAtivos);
  const [busca, setBusca] = useState('');

  const filtrados = useMemo(() => {
    const termo = normalizeSearch(busca);
    if (!medicos || !termo) return medicos ?? [];
    return medicos.filter((medico) =>
      normalizeSearch(`${medico.nome} ${medico.sobrenome}`).includes(termo),
    );
  }, [busca, medicos]);

  if (loading) return <Loading message="Buscando médicos..." />;
  if (error) return <ErrorMessage message={error} onRetry={reload} />;
  if (!medicos || medicos.length === 0) {
    return (
      <EmptyState
        icon="medkit-outline"
        title="Nenhum médico ativo"
        description="Não há médicos ativos cadastrados para receber pacientes da fila."
      />
    );
  }

  return (
    <>
      <Input
        label="Buscar médico pelo nome"
        placeholder="Ex.: Ana"
        value={busca}
        onChangeText={setBusca}
        autoCorrect={false}
        returnKeyType="search"
      />
      {filtrados.length === 0 ? (
        <Text style={styles.hint} accessibilityLiveRegion="polite">
          Nenhum médico encontrado para “{busca.trim()}”.
        </Text>
      ) : (
        <SelectableList
          label="Médicos ativos"
          items={filtrados.map((medico) => ({
            id: medico.id,
            title: nomeMedico(medico),
            description: descricaoMedico(medico),
          }))}
          selectedId={null}
          onSelect={(id) => {
            const escolhido = medicos.find((medico) => medico.id === id);
            if (escolhido) onSelect(escolhido);
          }}
        />
      )}
    </>
  );
}

const styles = StyleSheet.create({
  intro: {
    ...typography.body,
  },
  lista: {
    flexGrow: 1,
    gap: spacing.md,
  },
  oculta: {
    display: 'none',
  },
  titulo: {
    ...typography.subtitle,
  },
  hint: {
    ...typography.caption,
  },
});
