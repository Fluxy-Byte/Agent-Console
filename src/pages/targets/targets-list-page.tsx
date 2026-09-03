import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useSWR from "swr";
import { Clock, Contact, Lock, MessageCircle, Plus, SlidersHorizontal, UserCheck, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { PageBreadcrumb } from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { DateRange } from "@/components/calendar";
import { DateRangePicker } from "@/components/date-range-picker";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MetricCard } from "@/components/metric-card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SortableTh } from "@/components/sortable-th";
import { useCan } from "@/hooks/use-can";
import { PermissionAction } from "@/domain/permission-action";
import type { Agent, TargetListResult, TargetStats } from "@/types/domain";
import { ContactFormDialog } from "./contact-form-dialog";

const ALL = "all";
const PAGE_SIZE_OPTIONS = [10, 20, 50];

const STATUS_OPTIONS = [
  { value: ALL, label: "Todos" },
  { value: "AI", label: "IA" },
  { value: "HUMAN", label: "Humano" },
  { value: "FINISHED", label: "Finalizado" },
];

const STATUS_LABELS: Record<string, string> = { AI: "IA", HUMAN: "Humano", FINISHED: "Finalizado" };

type SortBy = "name" | "waId" | "status" | "lastInteractionAt";

function formatNumber(n: number): string {
  return n.toLocaleString("pt-BR");
}

export function TargetsListPage() {
  const navigate = useNavigate();
  const can = useCan();
  const canWrite = can(PermissionAction.CONTACTS_WRITE);

  const { data: agents } = useSWR<Agent[]>("/api/agents");

  const [agentId, setAgentId] = useState(ALL);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState(ALL);
  const [dateRange, setDateRange] = useState<DateRange>({});
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [sortBy, setSortBy] = useState<SortBy>("lastInteractionAt");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const filterParams = new URLSearchParams();
  if (agentId !== ALL) filterParams.set("agentId", agentId);
  if (name) filterParams.set("name", name);
  if (phone) filterParams.set("phone", phone);
  if (email) filterParams.set("email", email);
  if (status !== ALL) filterParams.set("status", status);
  if (dateRange.from) filterParams.set("startDate", dateRange.from.toISOString());
  if (dateRange.to) filterParams.set("endDate", dateRange.to.toISOString());

  const { data: stats } = useSWR<TargetStats>(`/api/targets/stats?${filterParams.toString()}`);

  const listParams = new URLSearchParams(filterParams);
  listParams.set("page", String(page));
  listParams.set("pageSize", String(pageSize));
  listParams.set("sortBy", sortBy);
  listParams.set("sortDir", sortDir);
  const { data: result, mutate } = useSWR<TargetListResult>(`/api/targets?${listParams.toString()}`);

  const totalPages = result ? Math.max(1, Math.ceil(result.total / pageSize)) : 1;
  const activeRate = stats && stats.total > 0 ? (stats.active / stats.total) * 100 : 0;

  function toggleSort(column: SortBy) {
    if (sortBy === column) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(column);
      setSortDir("asc");
    }
    setPage(1);
  }

  return (
    <div className="flex flex-col gap-6 p-6">
      <PageBreadcrumb items={[{ label: "Contatos", to: "/targets" }, { label: "Lista" }]} />

      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="bg-primary/10 text-primary flex size-10 shrink-0 items-center justify-center rounded-lg">
            <Contact className="size-5" />
          </div>
          <div>
            <h1 className="font-[family-name:var(--font-display)] text-2xl font-semibold">Contatos</h1>
            <p className="text-muted-foreground mt-1 text-sm">Contatos cadastrados nos WhatsApp Channel desta empresa.</p>
          </div>
        </div>
        {canWrite && (
          <ContactFormDialog
            onCreated={() => mutate()}
            trigger={
              <Button>
                <Plus className="size-4" /> Novo contato
              </Button>
            }
          />
        )}
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        <MetricCard
          icon={Users}
          iconClassName="bg-primary/10 text-primary"
          label="Total de contatos"
          value={stats ? formatNumber(stats.total) : "—"}
          sublabel="Contatos cadastrados"
        />
        <MetricCard
          icon={UserCheck}
          iconClassName="bg-success/15 text-success"
          label="Contatos ativos"
          value={stats ? formatNumber(stats.active) : "—"}
          sublabel={`${activeRate.toFixed(0)}% do total`}
        />
        <MetricCard
          icon={MessageCircle}
          iconClassName="bg-blue-500/10 text-blue-600 dark:text-blue-400"
          label="Interações hoje"
          value={stats ? formatNumber(stats.interactionsToday) : "—"}
          sublabel="Últimas 24h"
        />
        <MetricCard
          icon={Clock}
          iconClassName="bg-warning/15 text-warning"
          label="Última interação"
          value={stats?.lastInteractionAt ? new Date(stats.lastInteractionAt).toLocaleDateString("pt-BR") : "—"}
          sublabel={stats?.lastInteractionAt ? new Date(stats.lastInteractionAt).toLocaleTimeString("pt-BR") : ""}
        />
        <MetricCard
          icon={Contact}
          iconClassName="bg-primary/10 text-primary"
          label="Agente principal"
          value={stats?.primaryAgentName ?? "—"}
          sublabel="Responsável"
        />
      </div>

      <Card className="flex flex-col gap-3 p-4">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          <div className="flex flex-col gap-1.5">
            <Label className="text-xs">Agente</Label>
            <Select
              value={agentId}
              onValueChange={(v) => {
                setAgentId(v);
                setPage(1);
              }}
            >
              <SelectTrigger className="w-full">
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
          <div className="flex flex-col gap-1.5">
            <Label className="text-xs">Nome</Label>
            <Input
              placeholder="Buscar por nome..."
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setPage(1);
              }}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label className="text-xs">Número</Label>
            <Input
              placeholder="Buscar por número..."
              value={phone}
              onChange={(e) => {
                setPhone(e.target.value);
                setPage(1);
              }}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label className="text-xs">E-mail</Label>
            <Input
              placeholder="Buscar por e-mail..."
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setPage(1);
              }}
            />
          </div>
          <div className="flex items-end">
            <Button variant="outline" className="w-full" onClick={() => setShowAdvanced((v) => !v)}>
              <SlidersHorizontal className="size-4" /> Filtros avançados
            </Button>
          </div>
        </div>

        {showAdvanced && (
          <div className="border-border grid gap-3 border-t pt-3 sm:grid-cols-2 lg:grid-cols-4">
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
              <Label className="text-xs">Período (última interação)</Label>
              <DateRangePicker
                value={dateRange}
                onChange={(r) => {
                  setDateRange(r);
                  setPage(1);
                }}
              />
            </div>
          </div>
        )}
      </Card>

      <Card className="overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-border text-muted-foreground border-b text-center text-xs uppercase">
                <th className="px-4 py-3 text-left font-medium">
                  <SortableTh label="Nome" active={sortBy === "name"} dir={sortDir} onClick={() => toggleSort("name")} />
                </th>
                <th className="px-4 py-3 font-medium">
                  <SortableTh label="Número" active={sortBy === "waId"} dir={sortDir} onClick={() => toggleSort("waId")} />
                </th>
                <th className="px-4 py-3 font-medium">Agente</th>
                <th className="px-4 py-3 font-medium">
                  <SortableTh label="Status" active={sortBy === "status"} dir={sortDir} onClick={() => toggleSort("status")} />
                </th>
                <th className="px-4 py-3 font-medium">
                  <SortableTh
                    label="Última interação"
                    active={sortBy === "lastInteractionAt"}
                    dir={sortDir}
                    onClick={() => toggleSort("lastInteractionAt")}
                  />
                </th>
                <th className="px-4 py-3 font-medium">Ações</th>
              </tr>
            </thead>
            <tbody>
              {result?.items.map((target) => {
                const initial = target.name?.trim()?.[0]?.toUpperCase();
                const isActive = target.status !== "FINISHED";
                return (
                  <tr key={target.id} className="border-border hover:bg-accent/30 border-b last:border-0">
                    <td
                      className="cursor-pointer px-4 py-3 text-left"
                      onClick={() => navigate(`/targets/${target.id}`)}
                    >
                      <div className="flex items-center justify-start gap-3">
                        <div className="bg-primary/10 text-primary flex size-8 shrink-0 items-center justify-center rounded-full text-sm font-medium">
                          {initial ?? "—"}
                        </div>
                        <div>
                          {target.name ? (
                            <span className="font-medium">{target.name}</span>
                          ) : (
                            <Badge variant="secondary">Sem nome</Badge>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="inline-flex items-center gap-1.5">
                        <MessageCircle className="text-success size-3.5" /> {target.waId}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">{target.whatsappChannel?.agent?.name ?? "—"}</td>
                    <td className="px-4 py-3 text-center">
                      <Badge variant={isActive ? "success" : "secondary"}>
                        {isActive ? "Ativo" : STATUS_LABELS[target.status]}
                      </Badge>
                    </td>
                    <td className="text-muted-foreground px-4 py-3 text-center text-sm">
                      {target.lastInteractionAt ? new Date(target.lastInteractionAt).toLocaleString("pt-BR") : "—"}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex items-center justify-center">
                        <Button variant="outline" size="icon" className="size-8" disabled title="Em breve">
                          <Lock className="size-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {result && result.items.length === 0 && (
            <p className="text-muted-foreground p-6 text-center text-sm">Nenhum contato encontrado.</p>
          )}
        </div>

        {result && result.total > 0 && (
          <div className="border-border flex flex-col gap-3 border-t px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
            <span className="text-muted-foreground text-sm">
              Mostrando {(page - 1) * pageSize + 1} a {Math.min(page * pageSize, result.total)} de {result.total} contatos
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
