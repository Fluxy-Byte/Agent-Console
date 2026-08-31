import { useState } from "react";
import { cn } from "@/lib/utils";
import type { MonthlyMessageVolume } from "@/types/domain";

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

/// Ordem categórica fixa das duas séries — nunca reatribuída por filtro/rank.
const SENT_CLASS = "bg-primary";
const RECEIVED_CLASS = "bg-blue-500";

export function MonthlyMessageVolumeChart({ data }: { data: MonthlyMessageVolume }) {
  const [hovered, setHovered] = useState<number | null>(null);

  const totals = data.months.map((m) => m.sent + m.received);
  const max = Math.max(0, ...totals);
  const axisMax = niceCeil(max);
  const ticks = [axisMax, axisMax / 2, 0];

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1.5">
          <span className={cn("size-2.5 rounded-full", SENT_CLASS)} />
          <span className="text-muted-foreground text-xs">Enviadas</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className={cn("size-2.5 rounded-full", RECEIVED_CLASS)} />
          <span className="text-muted-foreground text-xs">Recebidas</span>
        </div>
      </div>

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
            const sentPct = axisMax > 0 ? (m.sent / axisMax) * 100 : 0;
            const receivedPct = axisMax > 0 ? (m.received / axisMax) * 100 : 0;
            const hasData = m.sent > 0 || m.received > 0;
            return (
              <div key={m.month} className="relative flex h-full flex-1 flex-col items-center justify-end">
                {hovered === i && (
                  <div className="bg-foreground text-background absolute -top-2 z-10 -translate-y-full rounded-md px-2 py-1.5 text-xs whitespace-nowrap shadow-md">
                    <p className="font-medium">
                      {MONTH_LABELS[i]}/{data.year}
                    </p>
                    <p>
                      Enviadas: <strong>{m.sent}</strong>
                    </p>
                    <p>
                      Recebidas: <strong>{m.received}</strong>
                    </p>
                  </div>
                )}
                <button
                  type="button"
                  aria-label={`${MONTH_LABELS[i]} de ${data.year}: ${m.sent} enviadas, ${m.received} recebidas`}
                  onMouseEnter={() => setHovered(i)}
                  onMouseLeave={() => setHovered(null)}
                  onFocus={() => setHovered(i)}
                  onBlur={() => setHovered(null)}
                  className="flex w-full max-w-6 flex-col items-stretch focus-visible:outline-none"
                  style={{ height: hasData ? `${Math.max(sentPct + receivedPct, 2)}%` : "2px" }}
                >
                  {/* Empilhado de cima pra baixo: recebidas (topo, ponta arredondada)
                      em cima, enviadas encostando na base (quadrada) — 2px de
                      respiro (mb-0.5) separa os dois segmentos quando ambos existem. */}
                  {m.received > 0 && (
                    <span
                      className={cn(RECEIVED_CLASS, "w-full rounded-t-[4px] transition-colors hover:opacity-80", m.sent > 0 && "mb-0.5")}
                      style={{ height: `${(receivedPct / (sentPct + receivedPct || 1)) * 100}%` }}
                    />
                  )}
                  {m.sent > 0 && (
                    <span
                      className={cn(SENT_CLASS, "w-full transition-colors hover:opacity-80", m.received === 0 && "rounded-t-[4px]")}
                      style={{ height: `${(sentPct / (sentPct + receivedPct || 1)) * 100}%` }}
                    />
                  )}
                  {!hasData && <span className="bg-muted block w-full rounded-t-[4px]" style={{ height: "100%" }} />}
                </button>
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
        <caption>Mensagens enviadas e recebidas por mês em {data.year}</caption>
        <thead>
          <tr>
            <th>Mês</th>
            <th>Enviadas</th>
            <th>Recebidas</th>
          </tr>
        </thead>
        <tbody>
          {data.months.map((m, i) => (
            <tr key={m.month}>
              <td>
                {MONTH_LABELS[i]}/{data.year}
              </td>
              <td>{m.sent}</td>
              <td>{m.received}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
