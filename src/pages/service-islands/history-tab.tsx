import { useState } from "react";
import useSWR from "swr";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PaginationControls } from "@/components/pagination-controls";
import { formatDuration } from "@/lib/format-duration";
import type { IslandTicketListResult } from "@/types/domain";
import { TicketDetailDialog } from "./ticket-detail-dialog";

export function HistoryTab({ islandId }: { islandId: string }) {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);

  const { data: tickets } = useSWR<IslandTicketListResult>(
    `/api/service-islands/${islandId}/tickets?status=CLOSED&page=${page}&pageSize=${pageSize}`,
  );

  return (
    <>
      <Card className="overflow-hidden p-0">
        {!tickets || tickets.items.length === 0 ? (
          <div className="text-muted-foreground p-6 text-sm">
            {!tickets ? "Carregando…" : "Nenhum atendimento encerrado nesta ilha ainda."}
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Ticket</TableHead>
                <TableHead>Contato</TableHead>
                <TableHead>Fila</TableHead>
                <TableHead>Atendente</TableHead>
                <TableHead>Tag de fechamento</TableHead>
                <TableHead>Tempo de espera</TableHead>
                <TableHead>Duração</TableHead>
                <TableHead>Encerrado em</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tickets.items.map((ticket) => (
                <TableRow key={ticket.id} className="hover:bg-accent cursor-pointer" onClick={() => setSelectedTicketId(ticket.id)}>
                  <TableCell>#{ticket.ticketNumber}</TableCell>
                  <TableCell>{ticket.target.name || ticket.target.waId}</TableCell>
                  <TableCell>{ticket.queue.name}</TableCell>
                  <TableCell>{ticket.assignedUser?.name ?? "—"}</TableCell>
                  <TableCell>
                    {ticket.closeTag ? <Badge variant="outline">{ticket.closeTag.name}</Badge> : "—"}
                  </TableCell>
                  <TableCell>{formatDuration(ticket.waitDurationMs)}</TableCell>
                  <TableCell>{formatDuration(ticket.handlingDurationMs)}</TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {ticket.closedAt ? new Date(ticket.closedAt).toLocaleString("pt-BR") : "—"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}

        {tickets && tickets.total > 0 && (
          <PaginationControls
            page={page}
            pageSize={pageSize}
            total={tickets.total}
            onPageChange={setPage}
            onPageSizeChange={(size) => {
              setPageSize(size);
              setPage(1);
            }}
          />
        )}
      </Card>

      <TicketDetailDialog ticketId={selectedTicketId} onOpenChange={(open) => !open && setSelectedTicketId(null)} />
    </>
  );
}
