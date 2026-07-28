import { useNavigate } from "react-router-dom";
import useSWR from "swr";
import { Bot, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { PageBreadcrumb } from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useCan } from "@/hooks/use-can";
import { PermissionAction } from "@/domain/permission-action";
import type { Agent } from "@/types/domain";

export function AgentsListPage() {
  const navigate = useNavigate();
  const can = useCan();
  const { data: agents } = useSWR<Agent[]>("/api/agents");

  return (
    <div className="flex flex-col gap-6 p-6">
      <PageBreadcrumb items={[{ label: "Agentes" }]} />

      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-[family-name:var(--font-display)] text-2xl font-semibold">Agentes</h1>
          <p className="text-muted-foreground mt-1 text-sm">Agentes de IA configurados para esta empresa.</p>
        </div>
        {can(PermissionAction.AGENTS_WRITE) && (
          <Button onClick={() => navigate("/agents/new")}>
            <Plus className="size-4" /> Novo agente
          </Button>
        )}
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {agents?.map((agent) => (
          <Card
            key={agent.id}
            className="hover:border-primary/50 flex cursor-pointer flex-col gap-3 p-4 transition-colors"
            onClick={() => navigate(`/agents/${agent.id}`)}
          >
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 text-primary flex size-10 items-center justify-center rounded-lg">
                <Bot className="size-5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{agent.name}</p>
                <p className="text-muted-foreground text-xs">
                  {agent.isActive ? "Ativo" : "Inativo"}
                </p>
              </div>
              <Badge variant={agent.isActive ? "default" : "outline"}>{agent.isActive ? "Ativo" : "Inativo"}</Badge>
            </div>
          </Card>
        ))}
        {agents && agents.length === 0 && (
          <p className="text-muted-foreground col-span-full text-sm">
            Nenhum agente cadastrado ainda. Crie o primeiro para começar.
          </p>
        )}
      </div>
    </div>
  );
}
