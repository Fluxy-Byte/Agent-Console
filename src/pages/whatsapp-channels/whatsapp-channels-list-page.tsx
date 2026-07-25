import { type FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import useSWR from "swr";
import { MessageSquare, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCan } from "@/hooks/use-can";
import { PermissionAction } from "@/domain/permission-action";
import { api, ApiError } from "@/lib/api";
import type { Agent, WhatsappChannel } from "@/types/domain";

export function WhatsappChannelsListPage() {
  const navigate = useNavigate();
  const can = useCan();
  const canWrite = can(PermissionAction.WABAS_WRITE);
  const { data: channels, mutate } = useSWR<WhatsappChannel[]>("/api/wc");
  const { data: agents } = useSWR<Agent[]>(canWrite ? "/api/agents" : null);

  const [open, setOpen] = useState(false);
  const [agentId, setAgentId] = useState("");
  const [phoneNumberId, setPhoneNumberId] = useState("");
  const [displayNumber, setDisplayNumber] = useState("");
  const [wabaId, setWabaId] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleCreate(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setSaving(true);
    try {
      await api.post("/api/wc", { agentId, phoneNumberId, displayNumber, wabaId });
      await mutate();
      setOpen(false);
      setAgentId("");
      setPhoneNumberId("");
      setDisplayNumber("");
      setWabaId("");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Não foi possível criar o canal.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-[family-name:var(--font-display)] text-2xl font-semibold">WhatsApp Channel</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Canais do WhatsApp vinculados aos agentes desta empresa.
          </p>
        </div>
        {canWrite && (
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="size-4" /> Novo canal
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Novo WhatsApp Channel</DialogTitle>
                <DialogDescription>
                  Uma ilha de atendimento é criada automaticamente para este canal.
                </DialogDescription>
              </DialogHeader>
              <form className="flex flex-col gap-4" onSubmit={handleCreate}>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="wc-agent">Agente</Label>
                  <select
                    id="wc-agent"
                    required
                    className="border-input bg-background h-9 rounded-md border px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    value={agentId}
                    onChange={(e) => setAgentId(e.target.value)}
                  >
                    <option value="" disabled>
                      Selecione um agente
                    </option>
                    {agents?.map((a) => (
                      <option key={a.id} value={a.id}>
                        {a.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="wc-phone-number-id">Phone Number ID</Label>
                  <Input
                    id="wc-phone-number-id"
                    required
                    value={phoneNumberId}
                    onChange={(e) => setPhoneNumberId(e.target.value)}
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="wc-display-number">Número de exibição</Label>
                  <Input
                    id="wc-display-number"
                    required
                    value={displayNumber}
                    onChange={(e) => setDisplayNumber(e.target.value)}
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="wc-waba-id">WhatsApp Business Account ID</Label>
                  <Input id="wc-waba-id" required value={wabaId} onChange={(e) => setWabaId(e.target.value)} />
                </div>
                {error && <p className="text-destructive text-sm">{error}</p>}
                <Button type="submit" disabled={saving}>
                  {saving ? "Criando…" : "Criar canal"}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {channels?.map((channel) => (
          <Card
            key={channel.id}
            className="hover:border-primary/50 cursor-pointer transition-colors"
            onClick={() => navigate(`/wc/${channel.id}`)}
          >
            <CardHeader className="flex-row items-center gap-3 space-y-0">
              <div className="bg-primary/10 text-primary flex size-10 items-center justify-center rounded-lg">
                <MessageSquare className="size-5" />
              </div>
              <div className="min-w-0">
                <CardTitle className="truncate text-base">{channel.displayNumber}</CardTitle>
                <p className="text-muted-foreground truncate text-xs">{channel.serviceIsland?.name}</p>
              </div>
            </CardHeader>
          </Card>
        ))}
        {channels && channels.length === 0 && (
          <p className="text-muted-foreground col-span-full text-sm">Nenhum WhatsApp Channel cadastrado ainda.</p>
        )}
      </div>
    </div>
  );
}
