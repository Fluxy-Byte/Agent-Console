import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useSWR from "swr";
import { CheckCircle2, ListChecks, MoreVertical, Plus, Trash2, XCircle } from "lucide-react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { MetricCard } from "@/components/metric-card";
import { PaginationControls } from "@/components/pagination-controls";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { api, ApiError } from "@/lib/api";
import { useAppSelector } from "@/store/hooks";
import type { Member, QueueListResult, QueueStats } from "@/types/domain";
import { QueueFormDialog } from "./queue-form-dialog";

const ALL = "all";
const DAY_LABELS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

const SITUATION_OPTIONS = [
  { value: ALL, label: "Todas as situações" },
  { value: "true", label: "Ativas" },
  { value: "false", label: "Inativas" },
];

interface QueuesTabProps {
  islandId: string;
  canManageQueues: boolean;
}

export function QueuesTab({ islandId, canManageQueues }: QueuesTabProps) {
  const navigate = useNavigate();
  const activeCompanyId = useAppSelector((s) => s.activeCompany?.id);
  const [search, setSearch] = useState("");
  const [isActive, setIsActive] = useState(ALL);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const { data: members } = useSWR<Member[]>(activeCompanyId ? `/api/companies/${activeCompanyId}/members` : null);
  const { data: stats } = useSWR<QueueStats>(`/api/service-islands/${islandId}/queues/stats`);

  const listParams = new URLSearchParams();
  if (search) listParams.set("search", search);
  if (isActive !== ALL) listParams.set("isActive", isActive);
  listParams.set("page", String(page));
  listParams.set("pageSize", String(pageSize));
  const { data: queues, mutate } = useSWR<QueueListResult>(
    `/api/service-islands/${islandId}/queues?${listParams.toString()}`,
  );

  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [deleting, setDeleting] = useState(false);

  // Muda de página/filtro = a seleção não corresponde mais ao que está na
  // tela — mais seguro limpar do que deixar ids "fantasma" marcados.
  useEffect(() => {
    setSelectedIds(new Set());
  }, [queues]);

  const selectedCount = selectedIds.size;
  const allOnPageSelected = Boolean(queues?.items.length) && queues!.items.every((q) => selectedIds.has(q.id));

  function toggleSelected(queueId: string, checked: boolean) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (checked) next.add(queueId);
      else next.delete(queueId);
      return next;
    });
  }

  function toggleSelectAll(checked: boolean) {
    if (!queues) return;
    setSelectedIds(checked ? new Set(queues.items.map((q) => q.id)) : new Set());
  }

  /// Cada fila é excluída individualmente (o backend bloqueia quem tem
  /// ticket) — segue excluindo as demais mesmo se uma falhar, e no fim
  /// resume tudo num único toast em vez de um toast de erro por item.
  async function handleBulkDelete() {
    const ids = Array.from(selectedIds);
    setDeleting(true);
    let deletedCount = 0;
    const failures: string[] = [];

    for (const id of ids) {
      const queue = queues?.items.find((q) => q.id === id);
      try {
        await api.delete(`/api/service-islands/${islandId}/queues/${id}`);
        deletedCount++;
      } catch (err) {
        const message = err instanceof ApiError ? err.message : "Erro desconhecido.";
        failures.push(`${queue?.name ?? id}: ${message}`);
      }
    }

    setDeleting(false);
    setSelectedIds(new Set());
    await mutate();

    if (deletedCount > 0) {
      toast.success(`${deletedCount} fila(s) excluída(s).`);
    }
    if (failures.length > 0) {
      toast.error(`${failures.length} fila(s) não puderam ser excluídas.`, {
        description: failures.join("\n"),
      });
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="font-[family-name:var(--font-display)] text-lg font-semibold">Filas de atendimento</h2>
          <p className="text-muted-foreground mt-1 text-sm">Gerencie as filas e seus atendentes</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Input
            placeholder="Buscar fila..."
            className="w-52"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
          <Select
            value={isActive}
            onValueChange={(v) => {
              setIsActive(v);
              setPage(1);
            }}
          >
            <SelectTrigger className="w-[170px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {SITUATION_OPTIONS.map((o) => (
                <SelectItem key={o.value} value={o.value}>
                  {o.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {canManageQueues && selectedCount > 0 && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" disabled={deleting}>
                  <Trash2 className="size-4" /> Excluir selecionadas ({selectedCount})
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Excluir {selectedCount} fila(s)?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Filas com algum ticket (mesmo já encerrado) não são excluídas — isso apagaria esse histórico de
                    atendimento junto. Esta ação não pode ser desfeita.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction variant="destructive" onClick={handleBulkDelete}>
                    Excluir
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
          {canManageQueues && (
            <QueueFormDialog
              serviceIslandId={islandId}
              members={members ?? []}
              onSaved={() => mutate()}
              trigger={
                <Button>
                  <Plus className="size-4" /> Nova fila
                </Button>
              }
            />
          )}
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <MetricCard
          icon={ListChecks}
          iconClassName="bg-primary/10 text-primary"
          label="Filas"
          value={stats ? stats.total : "—"}
          sublabel="Cadastradas nesta ilha"
        />
        <MetricCard
          icon={CheckCircle2}
          iconClassName="bg-success/15 text-success"
          label="Ativas"
          value={stats ? stats.active : "—"}
          sublabel="Recebendo atendimentos"
        />
        <MetricCard
          icon={XCircle}
          iconClassName="bg-muted text-muted-foreground"
          label="Inativas"
          value={stats ? stats.inactive : "—"}
          sublabel="Fora de operação"
        />
      </div>

      <Card className="overflow-hidden p-0">
        {!queues || queues.items.length === 0 ? (
          <div className="text-muted-foreground p-6 text-sm">
            {!queues ? "Carregando…" : "Nenhuma fila encontrada com os filtros atuais."}
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                {canManageQueues && (
                  <TableHead className="w-10">
                    <Checkbox
                      checked={allOnPageSelected}
                      onCheckedChange={(checked) => toggleSelectAll(checked === true)}
                      aria-label="Selecionar todas as filas desta página"
                    />
                  </TableHead>
                )}
                <TableHead>Nome da fila</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Atendentes</TableHead>
                <TableHead>Horário</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {queues.items.map((queue) => (
                <TableRow key={queue.id}>
                  {canManageQueues && (
                    <TableCell>
                      <Checkbox
                        checked={selectedIds.has(queue.id)}
                        onCheckedChange={(checked) => toggleSelected(queue.id, checked === true)}
                        aria-label={`Selecionar fila ${queue.name}`}
                      />
                    </TableCell>
                  )}
                  <TableCell className="font-medium">{queue.name}</TableCell>
                  <TableCell>
                    <Badge
                      className={
                        queue.isActive ? "bg-primary/10 text-primary border-transparent" : "bg-muted text-muted-foreground border-transparent"
                      }
                    >
                      {queue.isActive ? "Ativa" : "Inativa"}
                    </Badge>
                  </TableCell>
                  <TableCell>{queue.members?.length ?? 0}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {queue.businessHoursEnabled ? (
                      <>
                        {queue.businessHoursStart}–{queue.businessHoursEnd} ·{" "}
                        {queue.businessDays.map((d) => DAY_LABELS[d]).join(", ")}
                      </>
                    ) : (
                      "Sem horário restrito"
                    )}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="icon" className="size-8">
                          <MoreVertical className="size-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => navigate(`/service-island/${islandId}/queue/${queue.id}`)}>
                          Editar
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}

        {queues && queues.total > 0 && (
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
        )}
      </Card>
    </div>
  );
}
