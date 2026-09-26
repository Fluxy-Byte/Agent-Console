import type { EventStatus } from "@/types/domain";

/// null = agendado (nenhum status final ainda).
export type CalendarStatusKey = EventStatus | "SCHEDULED";

export function statusKey(status: EventStatus | null): CalendarStatusKey {
  return status ?? "SCHEDULED";
}

export const CALENDAR_STATUS_LABELS: Record<CalendarStatusKey, string> = {
  SCHEDULED: "Agendado",
  FINISHED: "Finalizado",
  RESCHEDULED: "Remarcado",
  CANCELED: "Cancelado",
};

/// Chip do evento na grade do calendário.
export const CALENDAR_STATUS_CHIP_CLASSES: Record<CalendarStatusKey, string> = {
  SCHEDULED: "bg-primary/15 text-primary",
  FINISHED: "bg-success/15 text-success",
  RESCHEDULED: "bg-warning/20 text-warning",
  CANCELED: "bg-muted text-muted-foreground line-through",
};

export const CALENDAR_STATUS_DOT_CLASSES: Record<CalendarStatusKey, string> = {
  SCHEDULED: "bg-primary",
  FINISHED: "bg-success",
  RESCHEDULED: "bg-warning",
  CANCELED: "bg-muted-foreground",
};

export const CALENDAR_STATUS_OPTIONS: CalendarStatusKey[] = ["SCHEDULED", "FINISHED", "RESCHEDULED", "CANCELED"];
