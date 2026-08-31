import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useSWR from "swr";
import { AlertTriangle, CheckCircle2, MoreVertical, Plus, Send, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { DateRange } from "@/components/calendar";
import { DateRangePicker } from "@/components/date-range-picker";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MetricCard } from "@/components/metric-card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SortableTh } from "@/components/sortable-th";
import { useCan } from "@/hooks/use-can";
import { PermissionAction } from "@/domain/permission-action";
import type { Agent, CampaignFilterOptions, CampaignListResult, CampaignStats } from "@/types/domain";

const ALL = "all";

const CATEGORY_LABEL: Record<string, string> = {
  MARKETING: "Marketing",
  UTILITY: "Utilidade",
  AUTHENTICATION: "Autenticação",
};

const STATUS_OPTIONS = [
  { value: ALL, label: "Todos" },
  { value: "PROCESSING", label: "Enviando" },
  { value: "COMPLETED", label: "Concluída" },
];

const STATUS_BADGE: Record<string, { label: string; variant: "warning" | "success" }> = {
  PROCESSING: { label: "Enviando...", variant: "warning" },
  COMPLETED: { label: "Concluída", variant: "success" },
};

const PAGE_SIZE_OPTIONS = [10, 20, 50];

function formatNumber(n: number): string {
  return n.toLocaleString("pt-BR");
}

export function CampaignsListPage() {
  const navigate = useNavigate();
  const can = useCan();
  const canWrite = can(PermissionAction.CAMPAIGNS_WRITE);

  const [agentId, setAgentId] = useState(ALL);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState(ALL);
  const [templateName, setTemplateName] = useState(ALL);
  const [dateRange, setDateRange] = useState<DateRange>({});
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const { data: agents } = useSWR<Agent[]>("/api/agents");
  const { data: filterOptions } = useSWR<CampaignFilterOptions>("/api/campaigns/filter-options");

  const filterParams = new URLSearchParams();
  if (agentId !== ALL) filterParams.set("agentId", agentId);
  if (search) filterParams.set("search", search);
  if (status !== ALL) filterParams.set("status", status);
  if (templateName !== ALL) filterParams.set("templateName", templateName);
  if (dateRange.from) filterParams.set("startDate", dateRange.from.toISOString());
  if (dateRange.to) filterParams.set("endDate", dateRange.to.toISOString());

  const { data: stats } = useSWR<CampaignStats>(`/api/campaigns/stats?${filterParams.toString()}`);

  const listParams = new URLSearchParams(filterParams);
  listParams.set("page", String(page));
  listParams.set("pageSize", String(pageSize));
  listParams.set("sortDir", sortDir);
  const { data: result } = useSWR<CampaignListResult>(`/api/campaigns?${listParams.toString()}`);

  const totalPages = result ? Math.max(1, Math.ceil(result.total / pageSize)) : 1;
  const hasFilters = Boolean(search || status !== ALL || templateName !== ALL || dateRange.from || dateRange.to);

  function resetFilters() {
    setSearch("");
    setStatus(ALL);
    setTemplateName(ALL);
    setDateRange({});
    setPage(1);
  }

  const failureRate = stats && stats.totalMessagesSent > 0 ? (stats.totalFailures / stats.totalMessagesSent) * 100 : 0;
  const completionRate = stats && stats.totalCampaigns > 0 ? (stats.completedCampaigns / stats.totalCampaigns) * 100 : 0;

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="font-[family-name:var(--font-display)] text-2xl font-semibold">Campanhas</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Disparos em massa (ou manuais) de templates de WhatsApp e histórico de envios.
          </p>
        </div>
        <div className="flex items-end gap-3">
          <div className="flex flex-col gap-1.5">
            <Label className="text-xs">Agente</Label>
            <Select
              value={agentId}
              onValueChange={(v) => {
                setAgentId(v);
                setPage(1);
              }}
            >
              <SelectTrigger className="w-[200px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL}>Todos os agentes</SelectItem>
                {agents?.map((a) => (
                  <SelectItem key={a.id} value={a.id}>
                    {a.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {canWrite && (
            <Button onClick={() => navigate("/campaigns/new")}>
              <Plus className="size-4" /> Nova campanha
            </Button>
          )}
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        <MetricCard
          icon={Send}
          iconClassName="bg-primary/10 text-primary"
          label="Campanhas"
          value={stats ? formatNumber(stats.totalCampaigns) : "—"}
          sublabel="Total criadas"
        />
        <MetricCard
          icon={CheckCircle2}
          iconClassName="bg-success/15 text-success"
          label="Concluídas"
          value={stats ? formatNumber(stats.completedCampaigns) : "—"}
          sublabel={`${completionRate.toFixed(0)}% do total`}
        />
        <MetricCard
          icon={Send}
          iconClassName="bg-blue-500/10 text-blue-600 dark:text-blue-400"
          label="Mensagens enviadas"
          value={stats ? formatNumber(stats.totalMessagesSent) : "—"}
          sublabel="Total disparado"
        />
        <MetricCard
          icon={AlertTriangle}
          iconClassName="bg-warning/15 text-warning"
          label="Falhas"
          value={stats ? formatNumber(stats.totalFailures) : "—"}
          sublabel={`${failureRate.toFixed(2).replace(".", ",")}% do total`}
        />
        <MetricCard
          icon={Users}
          iconClassName="bg-primary/10 text-primary"
          label="Contatos únicos"
          value={stats ? formatNumber(stats.uniqueContacts) : "—"}
          sublabel="Alcançados"
        />
      </div>

      <Card className="p-4">
        <div className="grid gap-3 lg:grid-cols-[1fr_180px_180px_220px_auto] lg:items-end">
          <div className="flex flex-col gap-1.5">
            <Label className="text-xs">Buscar</Label>
            <Input
              placeholder="Buscar campanha..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label className="text-xs">Status</Label>
            <Select
              value={status}
              onValueChange={(v) => {
                setStatus(v);
                setPage(1);
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {STATUS_OPTIONS.map((o) => (
                  <SelectItem key={o.value} value={o.value}>
                    {o.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-1.5">
            <Label className="text-xs">Template</Label>
            <Select
              value={templateName}
              onValueChange={(v) => {
                setTemplateName(v);
                setPage(1);
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL}>Todos</SelectItem>
                {filterOptions?.templates.map((t) => (
                  <SelectItem key={t} value={t}>
                    {t}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-1.5">
            <Label className="text-xs">Período</Label>
            <DateRangePicker
              value={dateRange}
              onChange={(r) => {
                setDateRange(r);
                setPage(1);
              }}
            />
          </div>
          <Button variant="outline" disabled={!hasFilters} onClick={resetFilters}>
            Limpar filtros
          </Button>
        </div>
      </Card>

      <Card className="overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-border text-muted-foreground border-b text-left text-xs uppercase">
                <th className="px-4 py-3 font-medium">Campanha</th>
                <th className="px-4 py-3 font-medium">Template/Tipo</th>
                <th className="px-4 py-3 font-medium">Agente / Canal</th>
                <th className="px-4 py-3 font-medium">Enviado por</th>
                <th className="px-4 py-3 font-medium">
                  <SortableTh
                    label="Data / Hora"
                    active
                    dir={sortDir}
                    onClick={() => setSortDir((d) => (d === "asc" ? "desc" : "asc"))}
                  />
                </th>
                <th className="px-4 py-3 font-medium">Progresso</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Ações</th>
              </tr>
            </thead>
            <tbody>
              {result?.items.map((c) => {
                const progressPct = c.expectedContacts > 0 ? Math.round((c.totalContacts / c.expectedContacts) * 100) : 0;
                const statusBadge = STATUS_BADGE[c.status];
                const sentAt = new Date(c.sentAt);

                return (
                  <tr key={c.id} className="border-border hover:bg-accent/30 border-b last:border-0">
                    <td className="px-4 py-3 align-top">
                      <div className="flex items-start gap-3">
                        <div className="bg-primary/10 text-primary flex size-9 shrink-0 items-center justify-center rounded-lg">
                          <Send className="size-4" />
                        </div>
                        <div className="min-w-0">
                          <button
                            type="button"
                            className="text-left font-medium hover:underline"
                            onClick={() => navigate(`/campaigns/${c.id}`)}
                          >
                            {c.name}
                          </button>
                          <p className="text-muted-foreground text-xs">ID: {c.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 align-top">
                      <div className="flex flex-col gap-1">
                        <span>{c.templateName}</span>
                        {c.category && (
                          <span className="text-muted-foreground text-xs">{CATEGORY_LABEL[c.category] ?? c.category}</span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 align-top">
                      <div className="flex flex-col gap-1 text-sm">
                        <span>{c.agentName}</span>
                        <span className="text-muted-foreground text-xs">{c.whatsappChannelDisplayNumber}</span>
                      </div>
                    </td>
                    <td className="text-muted-foreground px-4 py-3 align-top text-sm">
                      <div className="flex flex-col">
                        <span>{c.createdByName ?? "—"}</span>
                        <span className="text-xs">{c.createdByEmail ?? ""}</span>
                      </div>
                    </td>
                    <td className="text-muted-foreground px-4 py-3 align-top text-sm whitespace-nowrap">
                      <div className="flex flex-col">
                        <span>{sentAt.toLocaleDateString("pt-BR")}</span>
                        <span className="text-xs">{sentAt.toLocaleTimeString("pt-BR")}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 align-top">
                      <div className="flex flex-col gap-1">
                        <span className="text-xs">
                          {formatNumber(c.totalContacts)} / {formatNumber(c.expectedContacts)}
                        </span>
                        <div className="bg-muted h-1.5 w-28 overflow-hidden rounded-full">
                          <div
                            className={progressPct >= 100 ? "bg-success h-full" : "bg-primary h-full"}
                            style={{ width: `${Math.min(progressPct, 100)}%` }}
                          />
                        </div>
                        <span className="text-muted-foreground text-xs">{progressPct}%</span>
                        {c.totalFailures > 0 && <span className="text-destructive text-xs">{c.totalFailures} falha(s)</span>}
                      </div>
                    </td>
                    <td className="px-4 py-3 align-top">
                      <Badge variant={statusBadge?.variant ?? "outline"}>{statusBadge?.label ?? c.status}</Badge>
                    </td>
                    <td className="px-4 py-3 align-top">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" size="icon" className="size-8">
                            <MoreVertical className="size-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => navigate(`/campaigns/${c.id}`)}>Ver detalhes</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {result && result.items.length === 0 && (
            <p className="text-muted-foreground p-6 text-center text-sm">Nenhuma campanha encontrada.</p>
          )}
        </div>

        {result && result.total > 0 && (
          <div className="border-border flex flex-col gap-3 border-t px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
            <span className="text-muted-foreground text-sm">
              Exibindo {(page - 1) * pageSize + 1} a {Math.min(page * pageSize, result.total)} de {result.total} campanhas
            </span>
            <div className="flex items-center gap-3">
              <div className="flex gap-2">
                <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
                  Anterior
                </Button>
                <span className="bg-primary text-primary-foreground flex size-8 items-center justify-center rounded-md text-sm font-medium">
                  {page}
                </span>
                <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)}>
                  Próxima
                </Button>
              </div>
              <Select
                value={String(pageSize)}
                onValueChange={(v) => {
                  setPageSize(Number(v));
                  setPage(1);
                }}
              >
                <SelectTrigger size="sm" className="w-[130px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PAGE_SIZE_OPTIONS.map((size) => (
                    <SelectItem key={size} value={String(size)}>
                      {size} por página
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
