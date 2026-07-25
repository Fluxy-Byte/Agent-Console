import { useState } from "react";
import { useParams } from "react-router-dom";
import useSWR from "swr";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { MessageDocument, MessageType, Target } from "@/types/domain";

const STATUS_LABELS: Record<string, string> = { AI: "IA", HUMAN: "Humano", FINISHED: "Finalizado" };
const TICKET_STATUS_LABELS: Record<string, string> = { WAITING: "Aguardando", IN_PROGRESS: "Em andamento", CLOSED: "Encerrado" };

const TYPE_FILTERS: { value: MessageType | ""; label: string }[] = [
  { value: "", label: "Todos" },
  { value: "TEXT", label: "Texto" },
  { value: "AUDIO", label: "Áudio" },
  { value: "STICKER", label: "Figurinha" },
  { value: "DOCUMENT", label: "Documento" },
  { value: "IMAGE", label: "Foto" },
];

export function TargetDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: target } = useSWR<Target>(id ? `/api/targets/${id}` : null);
  const [messageType, setMessageType] = useState<MessageType | "">("");

  const historyParams = new URLSearchParams({ limit: "200" });
  if (messageType) historyParams.set("messageType", messageType);
  const { data: history } = useSWR<MessageDocument[]>(
    id ? `/api/targets/${id}/history?${historyParams.toString()}` : null,
  );

  if (!target) return <div className="p-6 text-sm text-muted-foreground">Carregando…</div>;

  const metadataEntries = target.metadata ? Object.entries(target.metadata) : [];

  return (
    <div className="p-6">
      <div className="mx-auto flex max-w-3xl flex-col gap-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-[family-name:var(--font-display)] text-2xl font-semibold">
              {target.name || target.waId}
            </h1>
            <Badge variant="outline">{STATUS_LABELS[target.status]}</Badge>
          </div>
          <p className="text-muted-foreground mt-1 text-sm">
            {target.waId} {target.email && `· ${target.email}`} · Agente: {target.whatsappChannel?.agent?.name}
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Metadados</CardTitle>
          </CardHeader>
          <CardContent>
            {metadataEntries.length === 0 ? (
              <p className="text-muted-foreground text-sm">Nenhum metadado registrado ainda.</p>
            ) : (
              <div className="flex flex-col gap-2">
                {metadataEntries.map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between border-b py-1.5 text-sm last:border-0">
                    <span className="text-muted-foreground">{key}</span>
                    <span className="font-medium">{String(value)}</span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Tickets de atendimento humano</CardTitle>
          </CardHeader>
          <CardContent>
            {!target.tickets || target.tickets.length === 0 ? (
              <p className="text-muted-foreground text-sm">Nenhum ticket para este contato ainda.</p>
            ) : (
              <div className="flex flex-col gap-2">
                {target.tickets.map((ticket) => (
                  <div key={ticket.id} className="flex items-center justify-between border-b py-1.5 text-sm last:border-0">
                    <span>
                      #{ticket.ticketNumber} · {ticket.queue.name}
                    </span>
                    <Badge variant="outline">{TICKET_STATUS_LABELS[ticket.status]}</Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Histórico de conversas</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="flex flex-wrap gap-1.5">
              {TYPE_FILTERS.map((filter) => (
                <button
                  key={filter.value}
                  onClick={() => setMessageType(filter.value)}
                  className={cn(
                    "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
                    messageType === filter.value
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-input bg-background",
                  )}
                >
                  {filter.label}
                </button>
              ))}
            </div>

            {!history || history.length === 0 ? (
              <p className="text-muted-foreground text-sm">Nenhuma mensagem ainda.</p>
            ) : (
              <div className="flex flex-col gap-2">
                {history.map((message) => (
                  <div
                    key={message._id}
                    className={cn(
                      "max-w-[80%] rounded-lg px-3 py-2 text-sm",
                      message.direction === "INBOUND"
                        ? "bg-muted self-start"
                        : "bg-primary/10 self-end",
                    )}
                  >
                    <p className="text-muted-foreground mb-1 text-xs">
                      {message.senderType} · {message.messageType}
                    </p>
                    {message.text || message.mediaUrl || "(sem conteúdo)"}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
