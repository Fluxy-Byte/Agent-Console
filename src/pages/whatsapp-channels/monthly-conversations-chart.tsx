import { useState } from "react";
import { cn } from "@/lib/utils";
import type { MonthlyConversations } from "@/types/domain";

const MONTH_LABELS = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];

/// Arredonda pra cima pro próximo número "redondo" (1/2/2.5/5 × 10^n) — usado
/// pro teto do eixo Y, pra não deixar as linhas de grade com números quebrados.
function niceCeil(value: number): number {
  if (value <= 0) return 1;
  const exponent = Math.floor(Math.log10(value));
  const magnitude = 10 ** exponent;
  const fraction = value / magnitude;
  const niceFraction = fraction <= 1 ? 1 : fraction <= 2 ? 2 : fraction <= 2.5 ? 2.5 : fraction <= 5 ? 5 : 10;
  return niceFraction * magnitude;
}

export function MonthlyConversationsChart({ data }: { data: MonthlyConversations }) {
  const [hovered, setHovered] = useState<number | null>(null);

  const max = Math.max(0, ...data.months.map((m) => m.count));
  const axisMax = niceCeil(max);
  const ticks = [axisMax, axisMax / 2, 0];

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-stretch gap-3">
        <div className="flex h-40 w-10 flex-none flex-col justify-between text-right">
          {ticks.map((t, i) => (
            <span key={i} className="text-muted-foreground text-xs tabular-nums">
              {Math.round(t).toLocaleString("pt-BR")}
            </span>
          ))}
        </div>

        <div className="border-border relative flex h-40 flex-1 items-end justify-between gap-1.5 border-b border-l">
          {ticks.map((t, i) => (
            <div
              key={i}
              className="border-border/60 pointer-events-none absolute inset-x-0 border-t"
              style={{ bottom: `${axisMax > 0 ? (t / axisMax) * 100 : 0}%` }}
            />
          ))}

          {data.months.map((m, i) => {
            const heightPct = axisMax > 0 ? (m.count / axisMax) * 100 : 0;
            return (
              <div key={m.month} className="relative flex h-full flex-1 flex-col items-center justify-end">
                {hovered === i && (
                  <div className="bg-foreground text-background absolute -top-2 z-10 -translate-y-full rounded-md px-2 py-1 text-xs whitespace-nowrap shadow-md">
                    {MONTH_LABELS[i]}/{data.year}: <strong>{m.count}</strong>{" "}
                    {m.count === 1 ? "conversa" : "conversas"}
                  </div>
                )}
                <button
                  type="button"
                  aria-label={`${MONTH_LABELS[i]} de ${data.year}: ${m.count} ${m.count === 1 ? "conversa" : "conversas"}`}
                  onMouseEnter={() => setHovered(i)}
                  onMouseLeave={() => setHovered(null)}
                  onFocus={() => setHovered(i)}
                  onBlur={() => setHovered(null)}
                  className={cn(
                    "w-full max-w-6 rounded-t-[4px] transition-colors focus-visible:outline-none",
                    m.count > 0 ? "bg-primary hover:bg-primary/80 focus-visible:bg-primary/80" : "bg-muted",
                  )}
                  style={{ height: m.count > 0 ? `${Math.max(heightPct, 2)}%` : "2px" }}
                />
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex gap-1.5 pl-[3.25rem]">
        {MONTH_LABELS.map((label) => (
          <span key={label} className="text-muted-foreground flex-1 text-center text-[11px]">
            {label}
          </span>
        ))}
      </div>

      <table className="sr-only">
        <caption>Conversas trocadas por mês em {data.year}</caption>
        <thead>
          <tr>
            <th>Mês</th>
            <th>Conversas</th>
          </tr>
        </thead>
        <tbody>
          {data.months.map((m, i) => (
            <tr key={m.month}>
              <td>
                {MONTH_LABELS[i]}/{data.year}
              </td>
              <td>{m.count}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
