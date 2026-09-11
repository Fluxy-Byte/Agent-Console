import { useState } from "react";
import useSWR from "swr";
import { Headphones, Hourglass, Search } from "@/lib/icons";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { PaginationControls } from "@/components/pagination-controls";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import type { AttendantSummary, IslandMonitoring } from "@/types/domain";

const MONITORING_REFRESH_MS = 8000;

const STATUS_LABELS: Record<AttendantSummary["status"], string> = { ONLINE: "Online", PAUSED: "Em pausa", OFFLINE: "Offline" };
const STATUS_DOT: Record<AttendantSummary["status"], string> = {
  ONLINE: "bg-emerald-500",
  PAUSED: "bg-amber-500",
  OFFLINE: "bg-muted-foreground",
};

function TicketList({ tickets, emptyLabel }: { tickets: IslandMonitoring["waitingTickets"]; emptyLabel: string }) {
  if (tickets.length === 0) {
    return <p className="text-muted-foreground text-sm">{emptyLabel}</p>;
  }

  return (
    <div className="flex flex-col gap-2">
      {tickets.map((ticket) => (
        <div key={ticket.id} className="border-border flex items-center justify-between gap-3 rounded-md border px-3 py-2">
          <div className="min-w-0">
            <p className="truncate text-sm font-medium">{ticket.target.name || ticket.target.waId || "—"}</p>
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
  const [inProgressPage, setInProgressPage] = useState(1);
  const [inProgressPageSize, setInProgressPageSize] = useState(10);
  const [waitingPage, setWaitingPage] = useState(1);
  const [waitingPageSize, setWaitingPageSize] = useState(10);
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
  const inProgressTotalPages = Math.max(1, Math.ceil(data.inProgressTickets.length / inProgressPageSize));
  const inProgressPageClamped = Math.min(inProgressPage, inProgressTotalPages);
  const pagedInProgress = data.inProgressTickets.slice(
    (inProgressPageClamped - 1) * inProgressPageSize,
    inProgressPageClamped * inProgressPageSize,
  );

  const waitingTotalPages = Math.max(1, Math.ceil(data.waitingTickets.length / waitingPageSize));
  const waitingPageClamped = Math.min(waitingPage, waitingTotalPages);
  const pagedWaiting = data.waitingTickets.slice(
    (waitingPageClamped - 1) * waitingPageSize,
    waitingPageClamped * waitingPageSize,
  );

  const attendantTotalPages = Math.max(1, Math.ceil(attendantRows.length / attendantPageSize));
  const attendantPageClamped = Math.min(attendantPage, attendantTotalPages);
  const pagedAttendants = attendantRows.slice(
    (attendantPageClamped - 1) * attendantPageSize,
    attendantPageClamped * attendantPageSize,
  );

  return (
    <div className="flex flex-col gap-6">
      <Card className="overflow-hidden p-0">
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
          <TicketList tickets={pagedInProgress} emptyLabel="Nenhum ticket em atendimento no momento." />
        </CardContent>
        {data.inProgressTickets.length > 0 && (
          <PaginationControls
            page={inProgressPageClamped}
            pageSize={inProgressPageSize}
            total={data.inProgressTickets.length}
            onPageChange={setInProgressPage}
            onPageSizeChange={(size) => {
              setInProgressPageSize(size);
              setInProgressPage(1);
            }}
          />
        )}
      </Card>

      <Card className="overflow-hidden p-0">
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
          <TicketList tickets={pagedWaiting} emptyLabel="Nenhum ticket aguardando no momento." />
        </CardContent>
        {data.waitingTickets.length > 0 && (
          <PaginationControls
            page={waitingPageClamped}
            pageSize={waitingPageSize}
            total={data.waitingTickets.length}
            onPageChange={setWaitingPage}
            onPageSizeChange={(size) => {
              setWaitingPageSize(size);
              setWaitingPage(1);
            }}
          />
        )}
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

          <div className="border-border overflow-hidden rounded-lg border">
            {attendantRows.length === 0 ? (
              <p className="text-muted-foreground p-6 text-center text-sm">Nenhum atendente encontrado.</p>
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
                        <span className="inline-flex items-center justify-center gap-1.5">
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
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
