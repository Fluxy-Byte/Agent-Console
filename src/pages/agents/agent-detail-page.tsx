import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useSWR from "swr";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useCan } from "@/hooks/use-can";
import { PermissionAction } from "@/domain/permission-action";
import { api, ApiError } from "@/lib/api";
import type { Agent } from "@/types/domain";

interface FormState {
  name: string;
  isActive: boolean;
  welcomeMessage: string;
  welcomeEnabled: boolean;
  processingMessage: string;
  transferMessage: string;
  unsupportedFormatMessage: string;
  outOfHoursMessage: string;
  outOfHoursEnabled: boolean;
  closingMessage: string;
  closingEnabled: boolean;
  errorMessage: string;
  errorEnabled: boolean;
}

const EMPTY_FORM: FormState = {
  name: "Assistente Virtual",
  isActive: true,
  welcomeMessage:
    "Olá! 😊 Seja muito bem-vindo(a) ao nosso atendimento. Eu sou o assistente virtual e estou aqui para te ajudar com informações, dúvidas ou o que você precisar. Caso seja necessário, também posso te encaminhar para um de nossos atendentes. Como posso te ajudar hoje?",
  welcomeEnabled: true,
  processingMessage:
    "Só um momento, por favor. Estou analisando cuidadosamente sua mensagem para te dar a resposta mais completa e precisa possível. Já retorno com as informações!",
  transferMessage:
    "Entendido! Para garantir que você receba o melhor atendimento, vou transferir esta conversa para um de nossos atendentes, que dará continuidade a partir daqui. Por favor, aguarde só mais um instante — em breve alguém da nossa equipe vai falar com você.",
  unsupportedFormatMessage:
    "Desculpe, ainda não consigo processar esse tipo de arquivo ou mídia que você enviou. Para que eu possa te ajudar da melhor forma, poderia, por gentileza, reenviar sua solicitação em texto?",
  outOfHoursMessage:
    "Agradecemos o seu contato! No momento estamos fora do nosso horário de atendimento humano, mas já registramos sua mensagem. Assim que nossa equipe retornar, um de nossos atendentes vai falar com você o quanto antes.",
  outOfHoursEnabled: true,
  closingMessage:
    "Foi um prazer poder te ajudar hoje! Se surgir alguma nova dúvida ou precisar de suporte novamente, é só me chamar por aqui a qualquer momento. Agradecemos o contato e desejamos um ótimo dia! 👋",
  closingEnabled: true,
  errorMessage:
    "Peço desculpas, mas encontrei um problema inesperado ao tentar processar sua solicitação. Poderia tentar novamente, por favor? Caso o problema persista, um de nossos atendentes poderá te ajudar diretamente.",
  errorEnabled: true,
};

function toForm(agent: Agent): FormState {
  return {
    name: agent.name,
    isActive: agent.isActive,
    welcomeMessage: agent.welcomeMessage,
    welcomeEnabled: agent.welcomeEnabled,
    processingMessage: agent.processingMessage,
    transferMessage: agent.transferMessage,
    unsupportedFormatMessage: agent.unsupportedFormatMessage,
    outOfHoursMessage: agent.outOfHoursMessage,
    outOfHoursEnabled: agent.outOfHoursEnabled,
    closingMessage: agent.closingMessage,
    closingEnabled: agent.closingEnabled,
    errorMessage: agent.errorMessage,
    errorEnabled: agent.errorEnabled,
  };
}

/// Campo de mensagem obrigatório, sem toggle de desativação (regra do
/// EscopoSaas: processando / transbordo / formato não suportado).
function RequiredMessageField(props: {
  label: string;
  helper: string;
  value: string;
  onChange: (value: string) => void;
  disabled: boolean;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label>
        {props.label} <span className="text-destructive">*</span>
      </Label>
      <p className="text-muted-foreground text-xs">{props.helper}</p>
      <Textarea
        required
        value={props.value}
        disabled={props.disabled}
        onChange={(e) => props.onChange(e.target.value)}
      />
    </div>
  );
}

/// Campo de mensagem com switch — quando desativado, a IA responde livremente
/// nesse cenário (aviso explícito, regra do EscopoSaas).
function ToggleableMessageField(props: {
  label: string;
  value: string;
  enabled: boolean;
  onChangeValue: (value: string) => void;
  onChangeEnabled: (enabled: boolean) => void;
  disabled: boolean;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between">
        <Label>{props.label}</Label>
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground text-xs">{props.enabled ? "Ativado" : "Desativado"}</span>
          <Switch checked={props.enabled} onCheckedChange={props.onChangeEnabled} disabled={props.disabled} />
        </div>
      </div>
      <Textarea
        value={props.value}
        disabled={props.disabled || !props.enabled}
        onChange={(e) => props.onChangeValue(e.target.value)}
      />
      {!props.enabled && (
        <p className="text-warning text-xs">
          Desativado: a Inteligência Artificial pode gerar qualquer resposta neste cenário.
        </p>
      )}
    </div>
  );
}

export function AgentDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const can = useCan();
  // A rota /agents/new não tem segmento :id (é estática, só /agents/:id tem),
  // então `id` vem undefined nela — não "new" literal.
  const isNew = !id;

  const { data: agent } = useSWR<Agent>(!isNew && id ? `/api/agents/${id}` : null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (agent) setForm(toForm(agent));
  }, [agent]);

  const canWrite = can(PermissionAction.AGENTS_WRITE);
  const disabled = !canWrite || saving;

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    setSaving(true);
    try {
      if (isNew) {
        const created = await api.post<Agent>("/api/agents", form);
        toast.success("Agente criado.");
        navigate(`/agents/${created.id}`, { replace: true });
      } else {
        await api.put<Agent>(`/api/agents/${id}`, form);
        toast.success("Agente atualizado.");
      }
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Não foi possível salvar o agente.");
    } finally {
      setSaving(false);
    }
  }

  if (!isNew && !agent) {
    return <div className="p-6 text-sm text-muted-foreground">Carregando…</div>;
  }

  return (
    <div className="p-6">
      <form onSubmit={handleSubmit} className="mx-auto flex max-w-2xl flex-col gap-6">
        <div>
          <h1 className="font-[family-name:var(--font-display)] text-2xl font-semibold">
            {isNew ? "Novo agente" : form.name || "Agente"}
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Configure a identidade e as mensagens automáticas deste agente.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Identidade</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="agent-name">Nome</Label>
              <Input
                id="agent-name"
                required
                disabled={disabled}
                value={form.name}
                onChange={(e) => set("name", e.target.value)}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label>Agente ativo</Label>
              <Switch checked={form.isActive} onCheckedChange={(v) => set("isActive", v)} disabled={disabled} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Mensagens obrigatórias</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-5">
            <RequiredMessageField
              label="Mensagem de processando"
              helper="Enviada enquanto o agente está pensando na resposta."
              value={form.processingMessage}
              onChange={(v) => set("processingMessage", v)}
              disabled={disabled}
            />
            <RequiredMessageField
              label="Mensagem de transbordo ao atendimento humano"
              helper="Enviada uma única vez, quando o ticket é criado para um atendente."
              value={form.transferMessage}
              onChange={(v) => set("transferMessage", v)}
              disabled={disabled}
            />
            <RequiredMessageField
              label="Mensagem de formato não suportado"
              helper="Enviada quando o cliente manda um tipo de mensagem que o agente não processa."
              value={form.unsupportedFormatMessage}
              onChange={(v) => set("unsupportedFormatMessage", v)}
              disabled={disabled}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Mensagens opcionais</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-5">
            <ToggleableMessageField
              label="Mensagem de boas-vindas"
              value={form.welcomeMessage}
              enabled={form.welcomeEnabled}
              onChangeValue={(v) => set("welcomeMessage", v)}
              onChangeEnabled={(v) => set("welcomeEnabled", v)}
              disabled={disabled}
            />
            <ToggleableMessageField
              label="Mensagem de fora de horário de atendimento humano"
              value={form.outOfHoursMessage}
              enabled={form.outOfHoursEnabled}
              onChangeValue={(v) => set("outOfHoursMessage", v)}
              onChangeEnabled={(v) => set("outOfHoursEnabled", v)}
              disabled={disabled}
            />
            <ToggleableMessageField
              label="Mensagem de finalização"
              value={form.closingMessage}
              enabled={form.closingEnabled}
              onChangeValue={(v) => set("closingMessage", v)}
              onChangeEnabled={(v) => set("closingEnabled", v)}
              disabled={disabled}
            />
            <ToggleableMessageField
              label="Mensagem de erro"
              value={form.errorMessage}
              enabled={form.errorEnabled}
              onChangeValue={(v) => set("errorMessage", v)}
              onChangeEnabled={(v) => set("errorEnabled", v)}
              disabled={disabled}
            />
          </CardContent>
        </Card>

        {error && <p className="text-destructive text-sm">{error}</p>}

        {canWrite && (
          <div className="flex justify-end gap-2">
            <Button type="submit" disabled={saving}>
              {saving ? "Salvando…" : isNew ? "Criar agente" : "Salvar alterações"}
            </Button>
          </div>
        )}
      </form>
    </div>
  );
}
