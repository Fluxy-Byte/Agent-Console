import { useState } from "react";
import useSWR from "swr";
import { Send } from "@/lib/icons";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { IslandMonitoring } from "@/types/domain";

const MONITORING_REFRESH_MS = 8000;
const ROWS_PER_PAGE = 10;

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

/// Contagem de aguardando/em-atendimento por fila, atualizada a cada
/// MONITORING_REFRESH_MS — vive na aba Filas, antes da listagem cadastral,
/// pra dar o pulso em tempo real de cada fila logo de cara.
export function RealtimeQueuesCard({ islandId }: { islandId: string }) {
  const { data } = useSWR<IslandMonitoring>(`/api/service-islands/${islandId}/monitoring`, {
    refreshInterval: MONITORING_REFRESH_MS,
  });
  const [queuePage, setQueuePage] = useState(1);

  if (!data) return null;

  // Lista já vem inteira da API (1 fetch só) — a paginação aqui é só de
  // exibição (slice no client), por isso a página é sempre "grampeada" no
  // total atual em vez de resetada por efeito.
  const queueTotalPages = Math.max(1, Math.ceil(data.queues.length / ROWS_PER_PAGE));
  const queuePageClamped = Math.min(queuePage, queueTotalPages);
  const pagedQueues = data.queues.slice((queuePageClamped - 1) * ROWS_PER_PAGE, queuePageClamped * ROWS_PER_PAGE);

  return (
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
  );
}
