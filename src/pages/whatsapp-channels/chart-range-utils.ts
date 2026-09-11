import type { SeriesRange } from "@/types/domain";

/// Opções do filtro de período dos gráficos "Fluxo de conversas"/"Fluxo de
/// mensagens" (Area Chart - Interactive) — da janela mais longa pra mais
/// curta, mesma ordem do Select.
export const RANGE_OPTIONS: { value: SeriesRange; label: string }[] = [
  { value: "years", label: "Últimos anos" },
  { value: "3m", label: "Últimos 3 meses" },
  { value: "1m", label: "Último mês" },
  { value: "7d", label: "Últimos 7 dias" },
];

const MONTH_LABELS = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];

/// Rótulo curto pro eixo X — evita `new Date(string)` de propósito: uma data
/// "YYYY-MM-DD" interpretada como UTC e depois formatada no fuso local pode
/// exibir o dia errado (o clássico off-by-one de fuso horário).
export function formatBucketTick(date: string, granularity: "day" | "month"): string {
  if (granularity === "month") {
    const [year, month] = date.split("-");
    return `${MONTH_LABELS[Number(month) - 1]}/${year.slice(2)}`;
  }
  const [, month, day] = date.split("-");
  return `${day}/${month}`;
}

/// Rótulo completo pro tooltip.
export function formatBucketLabel(date: string, granularity: "day" | "month"): string {
  if (granularity === "month") {
    const [year, month] = date.split("-");
    return `${MONTH_LABELS[Number(month) - 1]} de ${year}`;
  }
  const [year, month, day] = date.split("-");
  return `${day}/${month}/${year}`;
}
