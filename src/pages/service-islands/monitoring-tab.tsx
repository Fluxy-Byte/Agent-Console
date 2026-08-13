import useSWR from "swr";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { IslandMonitoring } from "@/types/domain";

const MONITORING_REFRESH_MS = 8000;

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

  if (!data) return <p className="text-muted-foreground p-4 text-sm">Carregando…</p>;

  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Atendimentos em tempo real</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            {data.queues.map((q) => (
              <div key={q.queueId} className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">{q.queueName}</span>
                <span>
                  {q.waitingCount} aguardando · {q.inProgressCount} em atendimento
                </span>
              </div>
            ))}
            {data.queues.length === 0 && <p className="text-muted-foreground text-sm">Nenhuma fila cadastrada.</p>}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Status dos atendentes</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-between gap-3 text-center">
            <div>
              <p className="text-2xl font-semibold text-emerald-600">{data.attendants.online}</p>
              <p className="text-muted-foreground text-xs">Online</p>
            </div>
            <div>
              <p className="text-2xl font-semibold text-amber-600">{data.attendants.paused}</p>
              <p className="text-muted-foreground text-xs">Em pausa</p>
            </div>
            <div>
              <p className="text-muted-foreground text-2xl font-semibold">{data.attendants.offline}</p>
              <p className="text-muted-foreground text-xs">Offline</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Em andamento</CardTitle>
          </CardHeader>
          <CardContent>
            <TicketList tickets={data.inProgressTickets} emptyLabel="Nenhum ticket em atendimento no momento." />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Aguardando atendimento</CardTitle>
          </CardHeader>
          <CardContent>
            <TicketList tickets={data.waitingTickets} emptyLabel="Nenhum ticket aguardando no momento." />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
