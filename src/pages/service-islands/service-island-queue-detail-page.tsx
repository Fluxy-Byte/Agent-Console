import { type FormEvent, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useSWR from "swr";
import { toast } from "sonner";
import { PageBreadcrumb } from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useCan } from "@/hooks/use-can";
import { PermissionAction } from "@/domain/permission-action";
import { api, ApiError } from "@/lib/api";
import { cn } from "@/lib/utils";
import { useAppSelector } from "@/store/hooks";
import type { Member, Queue, ServiceIsland } from "@/types/domain";

const DAY_LABELS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

export function ServiceIslandQueueDetailPage() {
  const { islandId, queueId } = useParams<{ islandId: string; queueId: string }>();
  const can = useCan();
  const canWrite = can(PermissionAction.QUEUES_WRITE);
  const activeCompanyId = useAppSelector((s) => s.activeCompany?.id);

  const { data: island } = useSWR<ServiceIsland>(islandId ? `/api/service-islands/${islandId}` : null);
  const { data: queue, mutate } = useSWR<Queue>(
    islandId && queueId ? `/api/service-islands/${islandId}/queues/${queueId}` : null,
  );
  const { data: members } = useSWR<Member[]>(activeCompanyId ? `/api/companies/${activeCompanyId}/members` : null);

  const [name, setName] = useState("");
  const [businessHoursEnabled, setBusinessHoursEnabled] = useState(false);
  const [businessHoursStart, setBusinessHoursStart] = useState("08:00");
  const [businessHoursEnd, setBusinessHoursEnd] = useState("18:00");
  const [businessDays, setBusinessDays] = useState<number[]>([1, 2, 3, 4, 5]);
  const [memberUserIds, setMemberUserIds] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (queue) {
      setName(queue.name);
      setBusinessHoursEnabled(queue.businessHoursEnabled);
      setBusinessHoursStart(queue.businessHoursStart ?? "08:00");
      setBusinessHoursEnd(queue.businessHoursEnd ?? "18:00");
      setBusinessDays(queue.businessDays);
      setMemberUserIds(queue.members?.map((m) => m.userId) ?? []);
    }
  }, [queue]);

  function toggleDay(day: number) {
    setBusinessDays((prev) => (prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day].sort()));
  }

  function toggleMember(userId: string) {
    setMemberUserIds((prev) => (prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]));
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setSaving(true);
    try {
      await api.put(`/api/service-islands/${islandId}/queues/${queueId}`, {
        name,
        businessHoursEnabled,
        businessHoursStart: businessHoursEnabled ? businessHoursStart : undefined,
        businessHoursEnd: businessHoursEnabled ? businessHoursEnd : undefined,
        businessDays,
        memberUserIds,
      });
      await mutate();
      toast.success("Fila atualizada.");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Não foi possível salvar a fila.");
    } finally {
      setSaving(false);
    }
  }

  if (!queue || !island) return <div className="p-6 text-sm text-muted-foreground">Carregando…</div>;

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6 p-6">
      <PageBreadcrumb
        items={[
          { label: "Ilhas de Atendimento", to: "/service-island" },
          { label: island.name, to: `/service-island/${island.id}` },
          { label: queue.name },
        ]}
      />

      <div>
        <h1 className="font-[family-name:var(--font-display)] text-2xl font-semibold">{queue.name}</h1>
        <p className="text-muted-foreground mt-1 text-sm">Configurações da fila.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Fila</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="queue-name">Nome</Label>
            <Input id="queue-name" required disabled={!canWrite} value={name} onChange={(e) => setName(e.target.value)} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Regras de horário</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <Label>Horário de atendimento personalizado</Label>
            <Switch checked={businessHoursEnabled} disabled={!canWrite} onCheckedChange={setBusinessHoursEnabled} />
          </div>

          {businessHoursEnabled && (
            <>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="queue-start">Início</Label>
                  <Input
                    id="queue-start"
                    type="time"
                    disabled={!canWrite}
                    value={businessHoursStart}
                    onChange={(e) => setBusinessHoursStart(e.target.value)}
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="queue-end">Fim</Label>
                  <Input
                    id="queue-end"
                    type="time"
                    disabled={!canWrite}
                    value={businessHoursEnd}
                    onChange={(e) => setBusinessHoursEnd(e.target.value)}
                  />
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <Label>Dias</Label>
                <div className="flex flex-wrap gap-1.5">
                  {DAY_LABELS.map((label, day) => (
                    <button
                      key={day}
                      type="button"
                      disabled={!canWrite}
                      onClick={() => toggleDay(day)}
                      className={cn(
                        "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
                        businessDays.includes(day)
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-input bg-background",
                      )}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Atendentes atribuídos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-1 rounded-md border p-2">
            {members?.map((member) => (
              <label key={member.userId} className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  disabled={!canWrite}
                  checked={memberUserIds.includes(member.userId)}
                  onChange={() => toggleMember(member.userId)}
                />
                {member.user.name}
              </label>
            ))}
            {members && members.length === 0 && (
              <p className="text-muted-foreground text-xs">Nenhum usuário nesta empresa.</p>
            )}
          </div>
        </CardContent>
      </Card>

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
