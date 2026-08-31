import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useSWR from "swr";
import { toast } from "sonner";
import { BarChart3, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { PageBreadcrumb } from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCan } from "@/hooks/use-can";
import { PermissionAction } from "@/domain/permission-action";
import { api, ApiError } from "@/lib/api";
import type { Agent, MonthlyConversations, WhatsappChannel, WhatsappChannelStatus } from "@/types/domain";
import { MonthlyConversationsChart } from "./monthly-conversations-chart";

type BadgeVariant = "success" | "warning" | "destructive" | "outline";

const GOOD_STATUSES = new Set(["CONNECTED", "GREEN", "VERIFIED", "APPROVED", "AVAILABLE_WITHOUT_REVIEW"]);
const BAD_STATUSES = new Set(["RED", "FLAGGED", "RESTRICTED", "RATE_LIMITED", "BANNED", "DECLINED", "EXPIRED"]);
const WARN_STATUSES = new Set(["YELLOW", "PENDING", "PENDING_REVIEW", "NOT_VERIFIED"]);

function statusVariant(value?: string): BadgeVariant {
  if (!value) return "outline";
  if (GOOD_STATUSES.has(value)) return "success";
  if (BAD_STATUSES.has(value)) return "destructive";
  if (WARN_STATUSES.has(value)) return "warning";
  return "outline";
}

const STATUS_FIELD_LABEL: Record<string, string> = {
  status: "Status da conexão",
  quality_rating: "Qualidade",
  name_status: "Nome do perfil",
  code_verification_status: "Verificação",
  messaging_limit_tier: "Limite de envio",
};

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
              <ShieldCheck className="text-primary size-4" /> Status do número na Meta
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
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                {Object.entries(STATUS_FIELD_LABEL).map(([field, label]) => {
                  const value = status[field as keyof WhatsappChannelStatus] as string | undefined;
                  if (!value) return null;
                  return (
                    <div key={field} className="flex flex-col gap-1">
                      <span className="text-muted-foreground text-xs">{label}</span>
                      <Badge variant={statusVariant(value)} className="w-fit">
                        {value.replaceAll("_", " ")}
                      </Badge>
                    </div>
                  );
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
              <BarChart3 className="text-primary size-4" /> Conversas por mês em {conversations.year}
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
