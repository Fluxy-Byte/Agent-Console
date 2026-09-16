import { Badge } from "@/components/ui/badge";
import type { MessageDocument } from "@/types/domain";

export function senderLabel(message: MessageDocument, attendantName?: string): string | null {
  if (message.senderType === "SYSTEM") return "Sistema";
  if (message.senderType === "AGENT_AI") return "IA";
  if (message.senderType === "ATTENDANT") return attendantName ?? "Atendente";
  if (message.senderType === "CAMPAIGN") return `Campanha: ${message.templateName ?? "template"}`;
  return null;
}

export function MessageBubble({
  message,
  attendantName,
  senderLabelOverride,
  agentBubbleClassName = "bg-[#1E56E9]/10",
  agentTextClassName = "text-black",
}: {
  message: MessageDocument;
  attendantName?: string;
  /** Substitui o rótulo de remetente calculado por `senderLabel` — útil quando quem
   * chama já sabe resolver o remetente com mais precisão (ex.: nome do agente de IA,
   * ou o atendente histórico de cada mensagem numa conversa com vários tickets). */
  senderLabelOverride?: string | null;
  /** Cor do balão pra mensagens de IA/atendente — default usado nos tickets;
   * a tela de Histórico de conversas passa uma opacidade diferente. */
  agentBubbleClassName?: string;
  /** Cor do texto pra mensagens de IA/atendente — default usado nos tickets;
   * a tela de Histórico de conversas passa branco. */
  agentTextClassName?: string;
}) {
  const isCustomer = message.senderType === "CUSTOMER";
  const isAgentOrHuman =
    message.senderType === "AGENT_AI" || message.senderType === "ATTENDANT" || message.senderType === "SYSTEM";
  const createdAt = new Date(message.createdAt);
  const dateTime = `${createdAt.toLocaleDateString("pt-BR")} às ${createdAt.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}`;
  const sender = senderLabelOverride !== undefined ? senderLabelOverride : senderLabel(message, attendantName);

  return (
    <div className={`flex flex-col gap-1 ${isCustomer ? "items-start" : "items-end"}`}>
      <div
        className={`max-w-[75%] rounded-2xl px-4 py-2 text-sm shadow-lg shadow-black/10 ${
          isAgentOrHuman ? `${agentBubbleClassName} ${agentTextClassName}` : "bg-white text-black"
        } ${isCustomer ? "rounded-tl-none" : "rounded-tr-none"}`}
      >
        <MessageContent message={message} />
      </div>
      <p className="text-muted-foreground flex items-center gap-1 px-1 text-[10px]">
        {dateTime}
        {sender && ` · ${sender}`}
      </p>
    </div>
  );
}

export function MessageContent({ message }: { message: MessageDocument }) {
  if (message.messageType === "IMAGE" && message.mediaUrl) {
    return <img src={message.mediaUrl} alt={message.text || "Imagem"} className="max-w-full rounded-lg" />;
  }
  if (message.messageType === "AUDIO" && message.mediaUrl) {
    return <audio controls src={message.mediaUrl} className="max-w-full" />;
  }
  if (message.messageType === "DOCUMENT" && message.mediaUrl) {
    return (
      <a href={message.mediaUrl} target="_blank" rel="noreferrer" className="underline">
        {message.text || "Documento"}
      </a>
    );
  }
  if ((message.messageType === "IMAGE" || message.messageType === "AUDIO" || message.messageType === "STICKER") && !message.mediaUrl) {
    return <Badge variant="outline">Mídia indisponível</Badge>;
  }
  return <p className="whitespace-pre-wrap">{message.text}</p>;
}
