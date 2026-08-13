import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useSWR from "swr";
import { Pencil, Plus, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PaginationControls } from "@/components/pagination-controls";
import { useAppSelector } from "@/store/hooks";
import type { Member, QueueListResult } from "@/types/domain";
import { QueueFormDialog } from "./queue-form-dialog";

const DAY_LABELS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

interface QueuesTabProps {
  islandId: string;
  canManageQueues: boolean;
}

export function QueuesTab({ islandId, canManageQueues }: QueuesTabProps) {
  const navigate = useNavigate();
  const activeCompanyId = useAppSelector((s) => s.activeCompany?.id);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const { data: members } = useSWR<Member[]>(activeCompanyId ? `/api/companies/${activeCompanyId}/members` : null);
  const { data: queues, mutate } = useSWR<QueueListResult>(
    `/api/service-islands/${islandId}/queues?page=${page}&pageSize=${pageSize}`,
  );

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="font-[family-name:var(--font-display)] text-lg font-semibold">Filas</h2>
        {canManageQueues && (
          <QueueFormDialog
            serviceIslandId={islandId}
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
        {queues?.items.map((queue) => (
          <Card key={queue.id}>
            <CardContent className="flex items-center justify-between gap-4 p-4">
              <div>
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium">{queue.name}</p>
                  <Badge variant={queue.isActive ? "default" : "outline"}>{queue.isActive ? "Ativa" : "Inativa"}</Badge>
                </div>
                <p className="text-muted-foreground mt-1 flex items-center gap-3 text-xs">
                  <span className="flex items-center gap-1">
                    <Users className="size-3" /> {queue.members?.length ?? 0} atendente(s)
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
                <Button size="sm" variant="outline" onClick={() => navigate(`/service-island/${islandId}/queue/${queue.id}`)}>
                  <Pencil className="size-4" /> Editar
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
        {queues && queues.items.length === 0 && (
          <p className="text-muted-foreground text-sm">Nenhuma fila cadastrada nesta ilha ainda.</p>
        )}
      </div>

      {queues && queues.total > 0 && (
        <Card className="overflow-hidden p-0">
          <PaginationControls
            page={page}
            pageSize={pageSize}
            total={queues.total}
            onPageChange={setPage}
            onPageSizeChange={(size) => {
              setPageSize(size);
              setPage(1);
            }}
          />
        </Card>
      )}
    </div>
  );
}
