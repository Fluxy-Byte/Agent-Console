import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useSWR from "swr";
import { toast } from "sonner";
import { BadgeCheck, BarChart3, Gauge, Send, ShieldCheck, Wifi, type LucideIcon } from "lucide-react";
import { PageBreadcrumb } from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCan } from "@/hooks/use-can";
import { PermissionAction } from "@/domain/permission-action";
import { api, ApiError } from "@/lib/api";
import { cn } from "@/lib/utils";
import type { Agent, MonthlyConversations, WhatsappChannel, WhatsappChannelStatus } from "@/types/domain";
import { MonthlyConversationsChart } from "./monthly-conversations-chart";

type StatusSeverity = "success" | "warning" | "destructive" | "neutral";

const GOOD_STATUSES = new Set(["CONNECTED", "GREEN", "VERIFIED", "APPROVED", "AVAILABLE_WITHOUT_REVIEW"]);
const BAD_STATUSES = new Set(["RED", "FLAGGED", "RESTRICTED", "RATE_LIMITED", "BANNED", "DECLINED", "EXPIRED"]);
const WARN_STATUSES = new Set(["YELLOW", "PENDING", "PENDING_REVIEW", "NOT_VERIFIED"]);

function statusSeverity(value?: string): StatusSeverity {
  if (!value) return "neutral";
  if (GOOD_STATUSES.has(value)) return "success";
  if (BAD_STATUSES.has(value)) return "destructive";
  if (WARN_STATUSES.has(value)) return "warning";
  return "neutral";
}

const SEVERITY_ICON_CLASS: Record<StatusSeverity, string> = {
  success: "bg-success/15 text-success",
  warning: "bg-warning/15 text-warning",
  destructive: "bg-destructive/15 text-destructive",
  neutral: "bg-muted text-muted-foreground",
};

const SEVERITY_TEXT_CLASS: Record<StatusSeverity, string> = {
  success: "text-success",
  warning: "text-warning",
  destructive: "text-destructive",
  neutral: "text-foreground",
};

/// Valores brutos que a Graph API da Meta devolve pros campos de status do
/// número — sempre em inglês. Um único dicionário cobre todos os campos: os
/// valores não colidem em significado entre eles (ex: EXPIRED sempre quer
/// dizer "expirado", não importa em qual campo apareça).
const STATUS_VALUE_LABEL: Record<string, string> = {
  CONNECTED: "Conectado",
  PENDING: "Pendente",
  FLAGGED: "Sinalizado",
  RESTRICTED: "Restrito",
  RATE_LIMITED: "Taxa limitada",
  BANNED: "Banido",
  DELETED: "Excluído",
  MIGRATED: "Migrado",
  UNKNOWN: "Desconhecido",
  UNVERIFIED: "Não verificado",
  GREEN: "Alta",
  YELLOW: "Média",
  RED: "Baixa",
  NA: "Não disponível",
  APPROVED: "Aprovado",
  AVAILABLE_WITHOUT_REVIEW: "Disponível sem revisão",
  DECLINED: "Recusado",
  EXPIRED: "Expirado",
  PENDING_REVIEW: "Em revisão",
  NONE: "Nenhum",
  VERIFIED: "Verificado",
  NOT_VERIFIED: "Não verificado",
  TIER_50: "Até 50 conversas/dia",
  TIER_250: "Até 250 conversas/dia",
  TIER_1K: "Até 1 mil conversas/dia",
  TIER_10K: "Até 10 mil conversas/dia",
  TIER_100K: "Até 100 mil conversas/dia",
  TIER_UNLIMITED: "Ilimitado",
};

function translateStatusValue(value: string): string {
  return STATUS_VALUE_LABEL[value] ?? value.replaceAll("_", " ");
}

const STATUS_FIELD_META: Record<string, { label: string; icon: LucideIcon }> = {
  status: { label: "Status da conexão", icon: Wifi },
  quality_rating: { label: "Qualidade", icon: Gauge },
  name_status: { label: "Nome do perfil", icon: BadgeCheck },
  code_verification_status: { label: "Verificação", icon: ShieldCheck },
  messaging_limit_tier: { label: "Limite de envio", icon: Send },
};

function StatusTile({ icon: Icon, label, value }: { icon: LucideIcon; label: string; value: string }) {
  const severity = statusSeverity(value);
  return (
    <div className="border-border bg-card flex items-center gap-3 rounded-xl border p-4">
      <div className={cn("flex size-11 shrink-0 items-center justify-center rounded-full", SEVERITY_ICON_CLASS[severity])}>
        <Icon className="size-5" />
      </div>
      <div className="min-w-0">
        <p className="text-muted-foreground text-xs">{label}</p>
        <p className={cn("truncate text-base font-semibold", SEVERITY_TEXT_CLASS[severity])}>
          {translateStatusValue(value)}
        </p>
      </div>
    </div>
  );
}

export function WhatsappChannelDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const can = useCan();
  const canWrite = can(PermissionAction.WABAS_WRITE);

  const { data: channel } = useSWR<WhatsappChannel>(id ? `/api/wc/${id}` : null);
  const { data: agents } = useSWR<Agent[]>(canWrite ? "/api/agents" : null);
  const { data: status, error: statusError } = useSWR<WhatsappChannelStatus>(
    id && channel?.hasMetaAccessToken ? `/api/wc/${id}/status` : null,
  );
  const { data: conversations } = useSWR<MonthlyConversations>(id ? `/api/wc/${id}/conversations-by-month` : null);

  const [form, setForm] = useState({ agentId: "", phoneNumberId: "", displayNumber: "", wabaId: "" });
  const [metaAccessToken, setMetaAccessToken] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (channel) {
      setForm({
        agentId: channel.agentId,
        phoneNumberId: channel.phoneNumberId,
        displayNumber: channel.displayNumber,
        wabaId: channel.wabaId,
      });
    }
  }, [channel]);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    setSaving(true);
    try {
      // Campo em branco = não mexe no token já salvo — só envia se o usuário
      // digitou um novo.
      await api.put(`/api/wc/${id}`, metaAccessToken ? { ...form, metaAccessToken } : form);
      setMetaAccessToken("");
      toast.success("WhatsApp Channel atualizado.");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Não foi possível salvar.");
    } finally {
      setSaving(false);
    }
  }

  if (!channel) return <div className="p-6 text-sm text-muted-foreground">Carregando…</div>;

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6 p-6">
      <PageBreadcrumb items={[{ label: "WhatsApp Channel", to: "/wc" }, { label: channel.displayNumber }]} />

      <div>
        <h1 className="font-[family-name:var(--font-display)] text-2xl font-semibold">{channel.displayNumber}</h1>
        <p className="text-muted-foreground mt-1 text-sm">Configurações do WhatsApp Channel.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Canal</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="wc-agent">Agente</Label>
            <Select
              value={form.agentId || channel.agentId}
              onValueChange={(value) => setForm((f) => ({ ...f, agentId: value }))}
              disabled={!canWrite || saving}
            >
              <SelectTrigger id="wc-agent" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {agents
                  ? agents.map((a) => (
                      <SelectItem key={a.id} value={a.id}>
                        {a.name}
                      </SelectItem>
                    ))
                  : (
                      <SelectItem value={form.agentId || channel.agentId}>
                        {channel.agent?.name ?? form.agentId}
                      </SelectItem>
                    )}
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="wc-phone-number-id">Phone Number ID</Label>
            <Input
              id="wc-phone-number-id"
              disabled={!canWrite || saving}
              value={form.phoneNumberId}
              onChange={(e) => setForm((f) => ({ ...f, phoneNumberId: e.target.value }))}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="wc-display-number">Número de exibição</Label>
            <Input
              id="wc-display-number"
              disabled={!canWrite || saving}
              value={form.displayNumber}
              onChange={(e) => setForm((f) => ({ ...f, displayNumber: e.target.value }))}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="wc-waba-id">WhatsApp Business Account ID</Label>
            <Input
              id="wc-waba-id"
              disabled={!canWrite || saving}
              value={form.wabaId}
              onChange={(e) => setForm((f) => ({ ...f, wabaId: e.target.value }))}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="wc-meta-access-token">Token de acesso da Meta</Label>
            <Input
              id="wc-meta-access-token"
              type="password"
              disabled={!canWrite || saving}
              placeholder={channel.hasMetaAccessToken ? "•••• configurado — digite para trocar" : "Nenhum token configurado"}
              value={metaAccessToken}
              onChange={(e) => setMetaAccessToken(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {channel.hasMetaAccessToken && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="bg-primary/15 text-primary flex size-7 items-center justify-center rounded-lg">
                <ShieldCheck className="size-4" />
              </div>
              Status do número na Meta
            </CardTitle>
          </CardHeader>
          <CardContent>
            {!status && !statusError && <p className="text-muted-foreground text-sm">Consultando a Meta…</p>}
            {statusError && (
              <p className="text-destructive text-sm">
                {statusError instanceof ApiError ? statusError.message : "Não foi possível consultar o status."}
              </p>
            )}
            {status && (
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {Object.entries(STATUS_FIELD_META).map(([field, meta]) => {
                  const value = status[field as keyof WhatsappChannelStatus] as string | undefined;
                  if (!value) return null;
                  return <StatusTile key={field} icon={meta.icon} label={meta.label} value={value} />;
                })}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {conversations && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="bg-primary/15 text-primary flex size-7 items-center justify-center rounded-lg">
                <BarChart3 className="size-4" />
              </div>
              Conversas por mês em {conversations.year}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <MonthlyConversationsChart data={conversations} />
          </CardContent>
        </Card>
      )}

      {channel.serviceIsland && (
        <Card>
          <CardHeader>
            <CardTitle>Ilha de atendimento</CardTitle>
          </CardHeader>
          <CardContent>
            <Button type="button" variant="outline" onClick={() => navigate(`/service-island/${channel.serviceIsland!.id}`)}>
              Ver {channel.serviceIsland.name}
            </Button>
          </CardContent>
        </Card>
      )}

      {error && <p className="text-destructive text-sm">{error}</p>}

      {canWrite && (
        <div className="flex justify-end">
          <Button type="submit" disabled={saving}>
            {saving ? "Salvando…" : "Salvar alterações"}
          </Button>
        </div>
      )}
    </form>
  );
}
