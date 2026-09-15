import { useState } from "react";
import useSWR from "swr";
import { Users } from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { ConversationsSeries } from "@/types/domain";
import { buildYearOptions, formatBucketLabel, formatBucketTick } from "./chart-range-utils";

const chartConfig = {
  count: { label: "Conversas", color: "var(--chart-1)" },
} satisfies ChartConfig;

const YEAR_OPTIONS = buildYearOptions();

/// "Fluxo de conversas" — Bar Chart do shadcn. Uma conversa é uma janela de
/// atendimento aberta por um contato (MessagingSession). Só é possível ver
/// ano a ano (Jan-Dez, a partir de 2024) — sem opção de mês/dias, diferente
/// do gráfico de mensagens.
export function ConversationsFlowChart({ channelId }: { channelId: string }) {
  const [year, setYear] = useState<number>(YEAR_OPTIONS[0]);
  const { data } = useSWR<ConversationsSeries>(`/api/channels/${channelId}/conversations-series?period=${year}`);

  return (
    <Card className="pt-0 shadow-xl">
      <CardHeader className="flex flex-col gap-3 space-y-0 border-b py-5 sm:flex-row sm:items-center">
        <div className="flex flex-1 items-start gap-3">
          <div className="bg-primary/15 text-primary flex size-10 shrink-0 items-center justify-center rounded-lg">
            <Users className="size-5" />
          </div>
          <div className="grid gap-1">
            <CardTitle>Métrica de janelas abertas nesse canal</CardTitle>
            <p className="text-muted-foreground text-sm">
              Quantidade de janelas de atendimento abertas por contatos deste canal ao longo do tempo.
            </p>
          </div>
        </div>
        <Select value={String(year)} onValueChange={(value) => setYear(Number(value))}>
          <SelectTrigger className="w-full sm:ml-auto sm:w-[180px]" aria-label="Selecionar ano">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {YEAR_OPTIONS.map((option) => (
              <SelectItem key={option} value={String(option)}>
                {option}
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
              <Bar dataKey="count" fill="var(--color-count)" radius={4} maxBarSize={32} />
            </BarChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}
