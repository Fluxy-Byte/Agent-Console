import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useSWR from "swr";
import { toast } from "sonner";
import { PageBreadcrumb } from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCan } from "@/hooks/use-can";
import { PermissionAction } from "@/domain/permission-action";
import { api, ApiError } from "@/lib/api";
import type { Agent, WhatsappChannel } from "@/types/domain";

export function WhatsappChannelDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const can = useCan();
  const canWrite = can(PermissionAction.WABAS_WRITE);

  const { data: channel } = useSWR<WhatsappChannel>(id ? `/api/wc/${id}` : null);
  const { data: agents } = useSWR<Agent[]>(canWrite ? "/api/agents" : null);

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
