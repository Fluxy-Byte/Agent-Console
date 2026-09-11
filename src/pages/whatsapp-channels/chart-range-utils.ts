import { MIN_SERIES_YEAR, type SeriesPeriod } from "@/types/domain";

/// Anos disponíveis no filtro — de MIN_SERIES_YEAR até o ano corrente, do
/// mais recente pro mais antigo (ordem do Select).
export function buildYearOptions(): number[] {
  const currentYear = new Date().getFullYear();
  const years: number[] = [];
  for (let year = currentYear; year >= MIN_SERIES_YEAR; year--) years.push(year);
  return years;
}

/// Rótulo de uma opção do Select de período.
export function formatPeriodLabel(period: SeriesPeriod): string {
  return period === "current-month" ? "Mês atual" : String(period);
}

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
