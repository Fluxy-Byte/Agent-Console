import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import type { AgentFormTabProps } from "./agent-form-types";

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

export function MessagesTab({ form, set, disabled }: AgentFormTabProps) {
  return (
    <div className="flex flex-col gap-6">
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
          <RequiredMessageField
            label="Mensagem para números bloqueados"
            helper="Enviada no lugar da IA/atendente quando o contato está bloqueado para este agente."
            value={form.blockedMessage}
            onChange={(v) => set("blockedMessage", v)}
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
    </div>
  );
}
