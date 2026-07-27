import { useState, type ReactNode } from "react";
import { useParams } from "react-router-dom";
import useSWR from "swr";
import { LogIn, LogOut } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MetadataView } from "@/components/metadata-view";
import { cn } from "@/lib/utils";
import type { MessageDocument, MessageType, Target, TicketSummary } from "@/types/domain";

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

interface TimelineEntry {
  createdAt: string;
  node: ReactNode;
}

/// Mensagem não guarda quem exatamente respondeu (o Mongo não sabe qual
/// atendente — só o Postgres, via TicketMessage) — aproxima pelo ticket cuja
/// janela [createdAt, closedAt] contém o horário da mensagem, já que só um
/// atendente por vez fica com um ticket em aberto.
function resolveAttendantName(messageCreatedAt: string, tickets: TicketSummary[]): string {
  const messageTime = new Date(messageCreatedAt).getTime();
  const ticket = tickets.find((t) => {
    const opened = new Date(t.createdAt).getTime();
    const closed = t.closedAt ? new Date(t.closedAt).getTime() : Infinity;
    return messageTime >= opened && messageTime <= closed;
  });
  return ticket?.assignedUser?.name ?? "Atendente";
}

function resolveSenderLabel(message: MessageDocument, target: Target, tickets: TicketSummary[]): string {
  switch (message.senderType) {
    case "CUSTOMER":
      return target.name || target.waId;
    case "AGENT_AI":
      return target.whatsappChannel?.agent?.name ?? "Agente de IA";
    case "ATTENDANT":
      return resolveAttendantName(message.createdAt, tickets);
    default:
      return "Sistema";
  }
}

/// Intercala as mensagens com marcadores de abertura/encerramento de ticket
/// no ponto certo da linha do tempo, ordenando tudo por createdAt — os
/// tickets sempre aparecem independente do filtro de tipo de mensagem
/// aplicado (são contexto da conversa, não mensagens).
function buildTimeline(history: MessageDocument[], tickets: TicketSummary[], target: Target): TimelineEntry[] {
  const entries: TimelineEntry[] = history.map((message) => ({
    createdAt: message.createdAt,
    node: (
      <MessageBubble key={message._id} message={message} senderLabel={resolveSenderLabel(message, target, tickets)} />
    ),
  }));

  for (const ticket of tickets) {
    entries.push({
      createdAt: ticket.createdAt,
      node: <TicketDivider key={`${ticket.id}-open`} ticketNumber={ticket.ticketNumber} label="Abertura" />,
    });
    if (ticket.closedAt) {
      entries.push({
        createdAt: ticket.closedAt,
        node: <TicketDivider key={`${ticket.id}-close`} ticketNumber={ticket.ticketNumber} label="Encerramento" />,
      });
    }
  }

  return entries.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
}

function TicketDivider({ ticketNumber, label }: { ticketNumber: number; label: "Abertura" | "Encerramento" }) {
  return (
    <div className="flex items-center justify-center py-1">
      <Badge variant="outline" className="bg-background text-muted-foreground gap-1.5 font-normal">
        {label === "Abertura" ? <LogIn className="size-3" /> : <LogOut className="size-3" />}
        #{ticketNumber} - {label}
      </Badge>
    </div>
  );
}

function MessageBubble({ message, senderLabel }: { message: MessageDocument; senderLabel: string }) {
  return (
    <div
      className={cn(
        "max-w-[80%] rounded-lg px-3 py-2 text-sm",
        message.direction === "INBOUND" ? "bg-muted self-start" : "bg-primary/10 self-end",
      )}
    >
      <p className="text-muted-foreground mb-1 text-xs">
        {senderLabel} · {new Date(message.createdAt).toLocaleString("pt-BR")}
      </p>
      {message.messageType === "IMAGE" && message.mediaUrl ? (
        <img src={message.mediaUrl} alt={message.text || "Imagem"} className="max-w-full rounded-md" />
      ) : (
        message.text || message.mediaUrl || "(sem conteúdo)"
      )}
    </div>
  );
}

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

  return (
    <div className="p-6">
      <div className="mx-auto flex max-w-6xl flex-col gap-6">
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

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)] lg:items-stretch">
          <div className="flex flex-col gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Metadados</CardTitle>
              </CardHeader>
              <CardContent>
                <MetadataView metadata={target.metadata} />
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
                      <div key={ticket.id} className="flex flex-col gap-0.5 border-b py-2 text-sm last:border-0">
                        <div className="flex items-center justify-between gap-2">
                          <span>
                            #{ticket.ticketNumber} · {ticket.queue.name}
                          </span>
                          <Badge variant="outline" className="shrink-0">
                            {TICKET_STATUS_LABELS[ticket.status]}
                          </Badge>
                        </div>
                        <p className="text-muted-foreground text-xs">
                          {ticket.queue.serviceIsland.name}
                          {ticket.assignedUser && ` · ${ticket.assignedUser.email}`}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* min-h-0 no Card e no CardContent é o que permite o histórico rolar
              por dentro em vez de esticar a coluna além da altura da esquerda —
              o grid (items-stretch, padrão) já iguala as duas colunas. */}
          <Card className="flex min-h-0 flex-col lg:h-full">
            <CardHeader>
              <CardTitle>Histórico de conversas</CardTitle>
            </CardHeader>
            <CardContent className="flex min-h-0 flex-1 flex-col gap-4">
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
                <div className="flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto">
                  {buildTimeline(history, target.tickets ?? [], target).map((entry) => entry.node)}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
