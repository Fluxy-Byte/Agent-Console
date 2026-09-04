import { useState, type ReactNode } from "react";
import { useParams } from "react-router-dom";
import useSWR from "swr";
import { Calendar, IdCard, LogIn, LogOut, Mail, Phone } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MetadataView } from "@/components/metadata-view";
import { PageBreadcrumb } from "@/components/ui/breadcrumb";
import { cn } from "@/lib/utils";
import { TicketDetailDialog } from "../service-islands/ticket-detail-dialog";
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
      return target.name || target.waId || "Cliente";
    case "AGENT_AI":
      return target.whatsappChannel?.agent?.name ?? "Agente de IA";
    case "ATTENDANT":
      return resolveAttendantName(message.createdAt, tickets);
    case "CAMPAIGN":
      return `Campanha: ${message.templateName ?? "template"}`;
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
  const isOpen = label === "Abertura";
  return (
    <div className="my-2 flex items-center gap-3">
      <div className="border-border h-px flex-1 border-t" />
      <Badge variant={isOpen ? "success" : "destructive"} className="shrink-0 gap-1.5 px-3 py-1 text-xs font-semibold">
        {isOpen ? <LogIn className="size-3.5" /> : <LogOut className="size-3.5" />}
        Ticket #{ticketNumber} · {label}
      </Badge>
      <div className="border-border h-px flex-1 border-t" />
    </div>
  );
}

function MessageBubble({ message, senderLabel }: { message: MessageDocument; senderLabel: string }) {
  const isCampaign = message.senderType === "CAMPAIGN";

  return (
    <div
      className={cn(
        "max-w-[80%] rounded-lg px-3 py-2 text-sm",
        message.direction === "INBOUND" ? "bg-muted self-start" : "bg-primary/10 self-end",
      )}
    >
      <div className="mb-1 flex items-center gap-1.5">
        <p className="text-muted-foreground text-xs">
          {senderLabel} · {new Date(message.createdAt).toLocaleString("pt-BR")}
        </p>
        {isCampaign && (
          <Badge variant="outline" className="px-1.5 py-0 text-[10px]">
            Disparo ativo
          </Badge>
        )}
      </div>
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
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);

  const historyParams = new URLSearchParams({ limit: "200" });
  if (messageType) historyParams.set("messageType", messageType);
  const { data: history } = useSWR<MessageDocument[]>(
    id ? `/api/targets/${id}/history?${historyParams.toString()}` : null,
  );

  if (!target) return <div className="p-6 text-sm text-muted-foreground">Carregando…</div>;

  return (
    <div className="flex flex-col gap-6 p-6">
      <PageBreadcrumb
        items={[{ label: "Contatos", to: "/targets" }, { label: target.name || target.waId || "Contato" }]}
      />

      <div>
        <div className="flex items-center gap-2">
          <h1 className="font-[family-name:var(--font-display)] text-2xl font-semibold">
            {target.name || target.waId || "Contato sem nome"}
          </h1>
          <Badge variant="outline">{STATUS_LABELS[target.status]}</Badge>
        </div>
        <p className="text-muted-foreground mt-1 text-sm">
          {target.waId ?? "Sem telefone"} {target.email && `· ${target.email}`} · Agente:{" "}
          {target.whatsappChannel?.agent?.name}
        </p>
      </div>

      <Tabs defaultValue="history">
        <TabsList>
          <TabsTrigger value="history">Histórico de conversa</TabsTrigger>
          <TabsTrigger value="tickets">Tickets de atendimento</TabsTrigger>
        </TabsList>

        <TabsContent value="history">
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)] lg:items-start">
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
                  <CardTitle>Informações de contato</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-3">
                  <div className="flex items-center justify-between gap-3 text-sm">
                    <span className="text-muted-foreground flex items-center gap-1.5">
                      <Mail className="size-4" /> E-mail
                    </span>
                    <span className="font-medium">{target.email ?? "—"}</span>
                  </div>
                  <div className="flex items-center justify-between gap-3 text-sm">
                    <span className="text-muted-foreground flex items-center gap-1.5">
                      <Calendar className="size-4" /> Data de criação
                    </span>
                    <span className="font-medium">{new Date(target.firstInteractionAt).toLocaleString("pt-BR")}</span>
                  </div>
                  <div className="flex items-center justify-between gap-3 text-sm">
                    <span className="text-muted-foreground flex items-center gap-1.5">
                      <Phone className="size-4" /> Telefone
                    </span>
                    <span className="font-medium">{target.waId ?? "Não informado"}</span>
                  </div>
                  <div className="flex items-center justify-between gap-3 text-sm">
                    <span className="text-muted-foreground flex items-center gap-1.5">
                      <IdCard className="size-4" /> BSUID
                    </span>
                    <span className="font-medium">{target.bsuid ?? "Ainda não recebido"}</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* aside: gruda no topo da viewport ao rolar a página (sticky) e
                nunca passa da altura da tela (max-h em cima de 100dvh, sem
                depender do breakpoint lg) — antes o cap só existia em telas
                grandes, então em janelas menores o card crescia com o
                conteúdo e estourava a viewport. */}
            <aside className="flex min-h-0 max-h-[calc(100dvh-3rem)] flex-col lg:sticky lg:top-6">
              <Card className="flex min-h-0 flex-1 flex-col">
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
            </aside>
          </div>
        </TabsContent>

        <TabsContent value="tickets">
          <Card>
            <CardHeader>
              <CardTitle>Tickets de atendimento humano</CardTitle>
            </CardHeader>
            <CardContent>
              {!target.tickets || target.tickets.length === 0 ? (
                <p className="text-muted-foreground text-sm">Nenhum ticket para este contato ainda.</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-left">Ticket</TableHead>
                      <TableHead>Fila</TableHead>
                      <TableHead>Ilha</TableHead>
                      <TableHead>Atendente</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {target.tickets.map((ticket) => (
                      <TableRow
                        key={ticket.id}
                        className="hover:bg-accent cursor-pointer"
                        onClick={() => setSelectedTicketId(ticket.id)}
                      >
                        <TableCell className="text-left">#{ticket.ticketNumber}</TableCell>
                        <TableCell>{ticket.queue.name}</TableCell>
                        <TableCell>{ticket.queue.serviceIsland.name}</TableCell>
                        <TableCell>{ticket.assignedUser?.email ?? "—"}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{TICKET_STATUS_LABELS[ticket.status]}</Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <TicketDetailDialog ticketId={selectedTicketId} onOpenChange={(open) => !open && setSelectedTicketId(null)} />
    </div>
  );
}
