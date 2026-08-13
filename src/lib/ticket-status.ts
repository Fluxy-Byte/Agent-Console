import type { TicketCloseReason } from "@/types/domain";

const CONCLUDED_REASONS = new Set<TicketCloseReason>(["RESOLVED", "TRANSFERRED_QUEUE", "TRANSFERRED_AGENT"]);

export function displayTicketStatus(ticket: {
  status: "WAITING" | "IN_PROGRESS" | "CLOSED";
  closeReason: TicketCloseReason | null;
}): { label: string; variant: "success" | "warning" | "outline" | "destructive" } {
  if (ticket.status === "WAITING") return { label: "Aguardando", variant: "outline" };
  if (ticket.status === "IN_PROGRESS") return { label: "Em andamento", variant: "warning" };
  if (ticket.closeReason && CONCLUDED_REASONS.has(ticket.closeReason)) return { label: "Concluído", variant: "success" };
  return { label: "Cancelado", variant: "destructive" };
}

export const SESSION_WINDOW_MS = 24 * 60 * 60 * 1000;
