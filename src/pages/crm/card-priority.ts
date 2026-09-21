import type { CardPriority } from "@/types/domain";

/// Ordem de exibição no seletor (da menor pra maior atenção) e cor da bolinha
/// do badge — usado no card do Kanban.
export const CARD_PRIORITIES: CardPriority[] = ["LOW", "MEDIUM", "HIGH", "URGENT"];

export const CARD_PRIORITY_DOT_CLASSES: Record<CardPriority, string> = {
  LOW: "bg-slate-400",
  MEDIUM: "bg-sky-500",
  HIGH: "bg-amber-500",
  URGENT: "bg-red-500",
};
