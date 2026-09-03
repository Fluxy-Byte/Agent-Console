import { useState } from "react";
import useSWR from "swr";
import { Headphones, Hourglass, Search, Send } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { PaginationControls } from "@/components/pagination-controls";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import type { AttendantSummary, IslandMonitoring } from "@/types/domain";

const MONITORING_REFRESH_MS = 8000;
const ROWS_PER_PAGE = 10;

const STATUS_LABELS: Record<AttendantSummary["status"], string> = { ONLINE: "Online", PAUSED: "Em pausa", OFFLINE: "Offline" };
const STATUS_DOT: Record<AttendantSummary["status"], string> = {
  ONLINE: "bg-emerald-500",
  PAUSED: "bg-amber-500",
  OFFLINE: "bg-muted-foreground",
};

/// Paginação compacta pra listas já carregadas por inteiro no client (não é
/// paginação de servidor) — só liga/desliga Anterior/Próxima, sem seletor de
/// tamanho de página, pra caber dentro de um card sem competir com o conteúdo.
function MiniPagination({
  page,
  totalPages,
  onChange,
}: {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
}) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-between pt-1">
      <span className="text-muted-foreground text-xs">
        Página {page} de {totalPages}
      </span>
      <div className="flex gap-1.5">
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-7 px-2 text-xs"
          disabled={page <= 1}
          onClick={() => onChange(page - 1)}
        >
          Anterior
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-7 px-2 text-xs"
          disabled={page >= totalPages}
          onClick={() => onChange(page + 1)}
        >
          Próxima
        </Button>
      </div>
    </div>
  );
}

function TicketList({ tickets, emptyLabel }: { tickets: IslandMonitoring["waitingTickets"]; emptyLabel: string }) {
  if (tickets.length === 0) {
    return <p className="text-muted-foreground text-sm">{emptyLabel}</p>;
  }

  return (
    <div className="flex flex-col gap-2">
      {tickets.map((ticket) => (
        <div key={ticket.id} className="border-border flex items-center justify-between gap-3 rounded-md border px-3 py-2">
          <div className="min-w-0">
            <p className="truncate text-sm font-medium">{ticket.target.name || ticket.target.waId}</p>
            <p className="text-muted-foreground truncate text-xs">
              #{ticket.ticketNumber} · {ticket.queue.name}
              {ticket.assignedUser && ` · ${ticket.assignedUser.name}`}
            </p>
          </div>
          <Badge variant="outline">{ticket.status === "WAITING" ? "Aguardando" : "Em andamento"}</Badge>
        </div>
      ))}
    </div>
  );
}

export function MonitoringTab({ islandId }: { islandId: string }) {
  const { data } = useSWR<IslandMonitoring>(`/api/service-islands/${islandId}/monitoring`, {
    refreshInterval: MONITORING_REFRESH_MS,
  });

  const [search, setSearch] = useState("");
  const [showAll, setShowAll] = useState(false);
  const [queuePage, setQueuePage] = useState(1);
  const [attendantPage, setAttendantPage] = useState(1);
  const [attendantPageSize, setAttendantPageSize] = useState(10);

  if (!data) return <p className="text-muted-foreground p-4 text-sm">Carregando…</p>;

  const attendantRows = data.attendants.list
    .filter((a) => showAll || a.status === "ONLINE")
    .filter((a) => !search || a.name.toLowerCase().includes(search.toLowerCase()));

  // Listas já vêm inteiras da API (1 fetch só) — a paginação aqui é só de
  // exibição (slice no client), por isso a página é sempre "grampeada" no
  // total atual em vez de resetada por efeito: se um filtro reduzir a lista,
  // a página cai sozinha pra última válida, nunca fica em branco.
  const queueTotalPages = Math.max(1, Math.ceil(data.queues.length / ROWS_PER_PAGE));
  const queuePageClamped = Math.min(queuePage, queueTotalPages);
  const pagedQueues = data.queues.slice((queuePageClamped - 1) * ROWS_PER_PAGE, queuePageClamped * ROWS_PER_PAGE);

  const attendantTotalPages = Math.max(1, Math.ceil(attendantRows.length / attendantPageSize));
  const attendantPageClamped = Math.min(attendantPage, attendantTotalPages);
  const pagedAttendants = attendantRows.slice(
    (attendantPageClamped - 1) * attendantPageSize,
    attendantPageClamped * attendantPageSize,
  );

  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex-row items-center justify-between space-y-0">
            <CardTitle className="text-base">Atendimentos em tempo real</CardTitle>
            <span className="text-muted-foreground flex items-center gap-1.5 text-xs">
              <span className="bg-success size-1.5 rounded-full" /> Atualizado agora
            </span>
          </CardHeader>
          <CardContent className="flex flex-col gap-1">
            {pagedQueues.map((q) => (
              <div key={q.queueId} className="hover:bg-accent/50 flex items-center justify-between gap-3 rounded-md px-2 py-2">
                <div className="flex min-w-0 items-center gap-2">
                  <div className="bg-primary/10 text-primary flex size-7 shrink-0 items-center justify-center rounded-md">
                    <Send className="size-3.5" />
                  </div>
                  <span className="truncate text-sm font-medium">{q.queueName}</span>
                </div>
                <div className="flex shrink-0 items-center gap-3 text-xs">
                  <span className="text-muted-foreground">
                    Aguardando <span className="text-foreground font-medium">{q.waitingCount}</span>
                  </span>
                  <span className="text-muted-foreground">
                    Em atendimento <span className="text-foreground font-medium">{q.inProgressCount}</span>
                  </span>
                </div>
              </div>
            ))}
            {data.queues.length === 0 && <p className="text-muted-foreground text-sm">Nenhuma fila cadastrada.</p>}
            <MiniPagination page={queuePageClamped} totalPages={queueTotalPages} onChange={setQueuePage} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Status dos atendentes</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-success/10 rounded-lg p-3 text-center">
                <p className="text-success text-xl font-semibold">{data.attendants.online}</p>
                <p className="text-muted-foreground text-xs">Online</p>
                <p className="text-muted-foreground text-[11px]">
                  {data.attendants.total > 0 ? Math.round((data.attendants.online / data.attendants.total) * 100) : 0}% do total
                </p>
              </div>
              <div className="bg-warning/10 rounded-lg p-3 text-center">
                <p className="text-warning text-xl font-semibold">{data.attendants.paused}</p>
                <p className="text-muted-foreground text-xs">Em pausa</p>
                <p className="text-muted-foreground text-[11px]">
                  {data.attendants.total > 0 ? Math.round((data.attendants.paused / data.attendants.total) * 100) : 0}% do total
                </p>
              </div>
              <div className="bg-muted rounded-lg p-3 text-center">
                <p className="text-xl font-semibold">{data.attendants.offline}</p>
                <p className="text-muted-foreground text-xs">Offline</p>
                <p className="text-muted-foreground text-[11px]">
                  {data.attendants.total > 0 ? Math.round((data.attendants.offline / data.attendants.total) * 100) : 0}% do total
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="text-sm font-medium">
                {showAll ? `Atendentes (${data.attendants.total})` : `Atendentes online (${data.attendants.online})`}
              </p>
              <div className="flex items-center gap-2">
                <div className="relative w-44">
                  <Search className="text-muted-foreground absolute top-1/2 left-2 size-3.5 -translate-y-1/2" />
                  <Input
                    placeholder="Buscar atendente..."
                    className="h-8 pl-7 text-xs"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
                <Button type="button" variant="outline" size="sm" className="h-8 text-xs" onClick={() => setShowAll((v) => !v)}>
                  {showAll ? "Ver só online" : "Ver todos os atendentes"}
                </Button>
              </div>
            </div>

            {attendantRows.length === 0 ? (
              <p className="text-muted-foreground py-2 text-center text-sm">Nenhum atendente encontrado.</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-left">Atendente</TableHead>
                    <TableHead>Fila</TableHead>
                    <TableHead>Tickets</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pagedAttendants.map((a) => (
                    <TableRow key={a.userId}>
                      <TableCell className="text-left">
                        <div className="flex items-center justify-start gap-2">
                          <div className="bg-primary/10 text-primary flex size-7 shrink-0 items-center justify-center rounded-full text-xs font-medium">
                            {a.name.charAt(0).toUpperCase()}
                          </div>
                          <span className="truncate font-medium">{a.name}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{a.queueName}</TableCell>
                      <TableCell className="text-muted-foreground">{a.ticketCount}</TableCell>
                      <TableCell>
                        <span className="inline-flex items-center gap-1.5">
                          <span className={cn("size-1.5 rounded-full", STATUS_DOT[a.status])} />
                          {STATUS_LABELS[a.status]}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
            {attendantRows.length > 0 && (
              <PaginationControls
                page={attendantPageClamped}
                pageSize={attendantPageSize}
                total={attendantRows.length}
                onPageChange={setAttendantPage}
                onPageSizeChange={(size) => {
                  setAttendantPageSize(size);
                  setAttendantPage(1);
                }}
              />
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <CardHeader className="flex-row items-center gap-3 space-y-0">
            <div className="bg-primary/10 text-primary flex size-10 items-center justify-center rounded-lg">
              <Headphones className="size-5" />
            </div>
            <div>
              <p className="text-xl font-semibold">{data.inProgressTickets.length}</p>
              <CardTitle className="text-muted-foreground text-xs font-normal">Tickets em atendimento</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <TicketList tickets={data.inProgressTickets} emptyLabel="Nenhum ticket em atendimento no momento." />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex-row items-center gap-3 space-y-0">
            <div className="bg-warning/15 text-warning flex size-10 items-center justify-center rounded-lg">
              <Hourglass className="size-5" />
            </div>
            <div>
              <p className="text-xl font-semibold">{data.waitingTickets.length}</p>
              <CardTitle className="text-muted-foreground text-xs font-normal">Tickets aguardando</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <TicketList tickets={data.waitingTickets} emptyLabel="Nenhum ticket aguardando no momento." />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
