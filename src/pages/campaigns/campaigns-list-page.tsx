import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useSWR from "swr";
import { Megaphone, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useCan } from "@/hooks/use-can";
import { PermissionAction } from "@/domain/permission-action";
import type { Agent, CampaignListResult } from "@/types/domain";

const ALL_AGENTS = "all";

const CATEGORY_LABEL: Record<string, string> = {
  MARKETING: "Marketing",
  UTILITY: "Utilidade",
  AUTHENTICATION: "Autenticação",
};

const STATUS_BADGE: Record<string, { label: string; variant: "warning" | "success" }> = {
  PROCESSING: { label: "Enviando...", variant: "warning" },
  COMPLETED: { label: "Concluída", variant: "success" },
};

export function CampaignsListPage() {
  const navigate = useNavigate();
  const can = useCan();
  const canWrite = can(PermissionAction.CAMPAIGNS_WRITE);

  const [agentId, setAgentId] = useState(ALL_AGENTS);
  const [page, setPage] = useState(1);
  const pageSize = 20;

  const { data: agents } = useSWR<Agent[]>("/api/agents");

  const params = new URLSearchParams({ page: String(page), pageSize: String(pageSize) });
  if (agentId !== ALL_AGENTS) params.set("agentId", agentId);
  const { data: result } = useSWR<CampaignListResult>(`/api/campaigns?${params.toString()}`);

  const totalPages = result ? Math.max(1, Math.ceil(result.total / pageSize)) : 1;

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-[family-name:var(--font-display)] text-2xl font-semibold">Campanhas</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Disparos em massa (ou manuais) de templates de WhatsApp e histórico de envios.
          </p>
        </div>
        <div className="flex items-end gap-3">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="campaigns-agent" className="text-xs">
              Agente
            </Label>
            <select
              id="campaigns-agent"
              className="border-input bg-background h-9 rounded-md border px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
              value={agentId}
              onChange={(e) => {
                setAgentId(e.target.value);
                setPage(1);
              }}
            >
              <option value={ALL_AGENTS}>Todos os agentes</option>
              {agents?.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.name}
                </option>
              ))}
            </select>
          </div>
          {canWrite && (
            <Button onClick={() => navigate("/campaigns/new")}>
              <Plus className="size-4" /> Nova campanha
            </Button>
          )}
        </div>
      </div>

      <div className="border-border bg-background flex min-w-0 flex-1 flex-col rounded-lg border">
        {!result ? (
          <div className="text-muted-foreground p-6 text-sm">Carregando…</div>
        ) : result.items.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
            <div className="bg-accent text-accent-foreground flex h-12 w-12 items-center justify-center rounded-full">
              <Megaphone className="size-6" />
            </div>
            <p className="text-muted-foreground text-sm">Nenhuma campanha disparada ainda.</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Campanha</TableHead>
                <TableHead>Template</TableHead>
                <TableHead>Agente / Canal</TableHead>
                <TableHead>Enviado por</TableHead>
                <TableHead>Data/Hora</TableHead>
                <TableHead>Progresso</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {result.items.map((c) => (
                <TableRow key={c.id} className="cursor-pointer" onClick={() => navigate(`/campaigns/${c.id}`)}>
                  <TableCell className="font-medium">{c.name}</TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      <span className="text-sm">{c.templateName}</span>
                      {c.category && <Badge variant="outline">{CATEGORY_LABEL[c.category] ?? c.category}</Badge>}
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    <div className="flex flex-col">
                      <span>{c.agentName}</span>
                      <span className="text-xs">{c.whatsappChannelDisplayNumber}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    <div className="flex flex-col">
                      <span>{c.createdByName ?? "—"}</span>
                      <span className="text-xs">{c.createdByEmail ?? ""}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm whitespace-nowrap">
                    <div className="flex flex-col">
                      <span>{new Date(c.sentAt).toLocaleDateString("pt-BR")}</span>
                      <span className="text-xs">{new Date(c.sentAt).toLocaleTimeString("pt-BR")}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {c.totalContacts}/{c.expectedContacts}
                    {c.totalFailures > 0 && <span className="text-destructive ml-1">({c.totalFailures} falhas)</span>}
                  </TableCell>
                  <TableCell>
                    <Badge variant={STATUS_BADGE[c.status]?.variant ?? "outline"}>
                      {STATUS_BADGE[c.status]?.label ?? c.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}

        {result && result.items.length > 0 && (
          <div className="border-border flex flex-col gap-3 border-t px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
            <span className="text-muted-foreground text-sm">
              Página {page} de {totalPages}
            </span>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
                Anterior
              </Button>
              <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)}>
                Próxima
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
