import { type FormEvent, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useSWR from "swr";
import { toast } from "sonner";
import { Pencil, Plus, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useCan } from "@/hooks/use-can";
import { PermissionAction } from "@/domain/permission-action";
import { api, ApiError } from "@/lib/api";
import { useAppSelector } from "@/store/hooks";
import type { IslandTicket, Member, ServiceIsland } from "@/types/domain";
import { QueueFormDialog } from "./queue-form-dialog";

const DAY_LABELS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
const TICKET_STATUS_LABELS: Record<string, string> = { WAITING: "Aguardando", IN_PROGRESS: "Em andamento", CLOSED: "Encerrado" };

export function ServiceIslandDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const can = useCan();
  const activeCompanyId = useAppSelector((s) => s.activeCompany?.id);

  const { data: island, mutate } = useSWR<ServiceIsland>(id ? `/api/service-islands/${id}` : null);
  const { data: members } = useSWR<Member[]>(
    activeCompanyId ? `/api/companies/${activeCompanyId}/members` : null,
  );
  const { data: tickets } = useSWR<IslandTicket[]>(id ? `/api/service-islands/${id}/tickets` : null);

  const canRenameIsland = can(PermissionAction.SERVICE_ISLANDS_WRITE);
  const canManageQueues = can(PermissionAction.QUEUES_WRITE);

  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (island) setName(island.name);
  }, [island]);

  async function handleRename(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setSaving(true);
    try {
      await api.put(`/api/service-islands/${id}`, { name });
      await mutate();
      toast.success("Ilha renomeada.");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Não foi possível renomear.");
    } finally {
      setSaving(false);
    }
  }

  if (!island) return <div className="p-6 text-sm text-muted-foreground">Carregando…</div>;

  return (
    <div className="flex flex-col gap-6 p-6">
      <Card>
        <CardHeader>
          <CardTitle>Ilha de atendimento</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleRename} className="flex items-end gap-3">
            <div className="flex flex-1 flex-col gap-1.5">
              <Label htmlFor="island-name">Nome</Label>
              <Input
                id="island-name"
                value={name}
                disabled={!canRenameIsland || saving}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            {canRenameIsland && (
              <Button type="submit" disabled={saving}>
                {saving ? "Salvando…" : "Salvar"}
              </Button>
            )}
          </form>
          {error && <p className="text-destructive mt-2 text-sm">{error}</p>}
          <p className="text-muted-foreground mt-3 text-xs">
            Canal: {island.whatsappChannel?.displayNumber}
          </p>
        </CardContent>
      </Card>

      <div className="flex items-center justify-between">
        <h2 className="font-[family-name:var(--font-display)] text-lg font-semibold">Filas</h2>
        {canManageQueues && (
          <QueueFormDialog
            serviceIslandId={island.id}
            members={members ?? []}
            onSaved={() => mutate()}
            trigger={
              <Button size="sm">
                <Plus className="size-4" /> Nova fila
              </Button>
            }
          />
        )}
      </div>

      <div className="flex flex-col gap-3">
        {island.queues?.map((queue) => (
          <Card key={queue.id}>
            <CardContent className="flex items-center justify-between gap-4 p-4">
              <div>
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium">{queue.name}</p>
                  <Badge variant={queue.isActive ? "default" : "outline"}>
                    {queue.isActive ? "Ativa" : "Inativa"}
                  </Badge>
                </div>
                <p className="text-muted-foreground mt-1 flex items-center gap-3 text-xs">
                  <span className="flex items-center gap-1">
                    <Users className="size-3" /> {queue.members.length} atendente(s)
                  </span>
                  {queue.businessHoursEnabled ? (
                    <span>
                      {queue.businessHoursStart}–{queue.businessHoursEnd} ·{" "}
                      {queue.businessDays.map((d) => DAY_LABELS[d]).join(", ")}
                    </span>
                  ) : (
                    <span>Sem horário restrito</span>
                  )}
                </p>
              </div>
              {canManageQueues && (
                <QueueFormDialog
                  serviceIslandId={island.id}
                  queue={queue}
                  members={members ?? []}
                  onSaved={() => mutate()}
                  trigger={
                    <Button size="sm" variant="outline">
                      <Pencil className="size-4" /> Editar
                    </Button>
                  }
                />
              )}
            </CardContent>
          </Card>
        ))}
        {island.queues && island.queues.length === 0 && (
          <p className="text-muted-foreground text-sm">Nenhuma fila cadastrada nesta ilha ainda.</p>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Tickets de atendimento humano</CardTitle>
        </CardHeader>
        <CardContent>
          {!tickets || tickets.length === 0 ? (
            <p className="text-muted-foreground text-sm">Nenhum ticket nas filas desta ilha ainda.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Ticket</TableHead>
                  <TableHead>Contato</TableHead>
                  <TableHead>Fila</TableHead>
                  <TableHead>Atendente</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tickets.map((ticket) => (
                  <TableRow
                    key={ticket.id}
                    className="hover:bg-accent cursor-pointer"
                    onClick={() => navigate(`/targets/${ticket.target.id}`)}
                  >
                    <TableCell>#{ticket.ticketNumber}</TableCell>
                    <TableCell>{ticket.target.name || ticket.target.waId}</TableCell>
                    <TableCell>{ticket.queue.name}</TableCell>
                    <TableCell>{ticket.assignedUser?.email ?? "—"}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{TICKET_STATUS_LABELS[ticket.status]}</Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
