import { useState } from "react";
import useSWR from "swr";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
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
import type { MessagesSeries, SeriesRange } from "@/types/domain";
import { formatBucketLabel, formatBucketTick, RANGE_OPTIONS } from "./chart-range-utils";

const chartConfig = {
  sent: { label: "Enviadas", color: "var(--chart-1)" },
  received: { label: "Recebidas", color: "var(--chart-2)" },
} satisfies ChartConfig;

/// "Fluxo de mensagens" — Area Chart - Interactive do shadcn. Diferente de
/// conversas, cada mensagem individual conta (uma mesma conversa pode ter
/// várias); duas séries empilhadas (enviadas/recebidas).
export function MessagesFlowChart({ channelId }: { channelId: string }) {
  const [range, setRange] = useState<SeriesRange>("3m");
  const { data } = useSWR<MessagesSeries>(`/api/wc/${channelId}/messages-series?range=${range}`);

  return (
    <Card className="pt-0">
      <CardHeader className="flex flex-col gap-3 space-y-0 border-b py-5 sm:flex-row sm:items-center">
        <div className="grid flex-1 gap-1">
          <CardTitle>Fluxo de mensagens (Cada mensagem)</CardTitle>
          <p className="text-muted-foreground text-sm">
            Volumetria de mensagens trocadas — diferente de conversas, uma mesma conversa pode ter várias mensagens.
          </p>
        </div>
        <Select value={range} onValueChange={(value) => setRange(value as SeriesRange)}>
          <SelectTrigger className="w-full sm:ml-auto sm:w-[180px]" aria-label="Selecionar período">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {RANGE_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
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
            <AreaChart data={data.points}>
              <defs>
                <linearGradient id="fillSent" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-sent)" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="var(--color-sent)" stopOpacity={0.1} />
                </linearGradient>
                <linearGradient id="fillReceived" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-received)" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="var(--color-received)" stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={32}
                tickFormatter={(value: string) => formatBucketTick(value, data.granularity)}
              />
              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent labelFormatter={(value) => formatBucketLabel(value as string, data.granularity)} indicator="dot" />
                }
              />
              <Area dataKey="received" type="natural" fill="url(#fillReceived)" stroke="var(--color-received)" stackId="a" />
              <Area dataKey="sent" type="natural" fill="url(#fillSent)" stroke="var(--color-sent)" stackId="a" />
              <ChartLegend content={<ChartLegendContent />} />
            </AreaChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}
