import { useState } from "react";
import useSWR from "swr";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { MessagesSeries, SeriesPeriod } from "@/types/domain";
import { buildYearOptions, formatBucketLabel, formatBucketTick, formatPeriodLabel } from "./chart-range-utils";

const chartConfig = {
  sent: { label: "Enviadas", color: "var(--chart-1)" },
  received: { label: "Recebidas", color: "var(--chart-2)" },
} satisfies ChartConfig;

/// Opções do Select: mês atual primeiro, depois os anos disponíveis
/// (do mais recente pro mais antigo, a partir de 2024).
const PERIOD_OPTIONS: SeriesPeriod[] = ["current-month", ...buildYearOptions()];

function periodToParam(period: SeriesPeriod): string {
  return String(period);
}

function parsePeriod(value: string): SeriesPeriod {
  return value === "current-month" ? "current-month" : Number(value);
}

/// "Fluxo de mensagens" — Bar Chart - Multiple do shadcn. Diferente de
/// conversas, cada mensagem individual conta (uma mesma conversa pode ter
/// várias); duas séries lado a lado (enviadas/recebidas). Só é possível ver
/// o mês atual ou um ano inteiro (a partir de 2024).
export function MessagesFlowChart({ channelId }: { channelId: string }) {
  const [period, setPeriod] = useState<SeriesPeriod>("current-month");
  const { data } = useSWR<MessagesSeries>(`/api/wc/${channelId}/messages-series?period=${periodToParam(period)}`);

  return (
    <Card className="pt-0">
      <CardHeader className="flex flex-col gap-3 space-y-0 border-b py-5 sm:flex-row sm:items-center">
        <div className="grid flex-1 gap-1">
          <CardTitle>Fluxo de mensagens (Cada mensagem)</CardTitle>
          <p className="text-muted-foreground text-sm">
            Volumetria de mensagens trocadas — diferente de conversas, uma mesma conversa pode ter várias mensagens.
          </p>
        </div>
        <Select value={periodToParam(period)} onValueChange={(value) => setPeriod(parsePeriod(value))}>
          <SelectTrigger className="w-full sm:ml-auto sm:w-[180px]" aria-label="Selecionar período">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {PERIOD_OPTIONS.map((option) => (
              <SelectItem key={periodToParam(option)} value={periodToParam(option)}>
                {formatPeriodLabel(option)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        {!data ? (
          <p className="text-muted-foreground py-10 text-center text-sm">Carregando…</p>
        ) : (
          <ChartContainer config={chartConfig} className="aspect-auto h-[250px] w-full">
            <BarChart data={data.points}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={32}
                tickFormatter={(value: string) => formatBucketTick(value, data.granularity)}
              />
              {/* Domínio sempre começando em 0 e com teto mínimo 1 — sem isso,
                  quando todos os pontos são 0 (ou quase), o recharts calcula
                  um domínio degenerado (min === max) e desenha a barra no
                  meio do gráfico em vez de rente à base, sobrepondo as datas. */}
              <YAxis hide domain={[0, (dataMax: number) => Math.max(dataMax, 1)]} />
              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent labelFormatter={(value) => formatBucketLabel(value as string, data.granularity)} indicator="dot" />
                }
              />
              <Bar dataKey="sent" fill="var(--color-sent)" radius={4} />
              <Bar dataKey="received" fill="var(--color-received)" radius={4} />
              <ChartLegend content={<ChartLegendContent />} />
            </BarChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}
