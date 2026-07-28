import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useSWR from "swr";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PageBreadcrumb } from "@/components/ui/breadcrumb";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Agent, TargetListResult } from "@/types/domain";

const STATUS_LABELS: Record<string, string> = { AI: "IA", HUMAN: "Humano", FINISHED: "Finalizado" };

export function TargetsListPage() {
  const navigate = useNavigate();
  const { data: agents } = useSWR<Agent[]>("/api/agents");

  const [page, setPage] = useState(1);
  const [agentId, setAgentId] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  const params = new URLSearchParams({ page: String(page), pageSize: "20" });
  if (agentId) params.set("agentId", agentId);
  if (name) params.set("name", name);
  if (phone) params.set("phone", phone);
  if (email) params.set("email", email);

  const { data } = useSWR<TargetListResult>(`/api/targets?${params.toString()}`);

  const totalPages = data ? Math.max(1, Math.ceil(data.total / data.pageSize)) : 1;

  return (
    <div className="flex flex-col gap-6 p-6">
      <PageBreadcrumb items={[{ label: "Contatos" }]} />

      <div>
        <h1 className="font-[family-name:var(--font-display)] text-2xl font-semibold">Contatos</h1>
        <p className="text-muted-foreground mt-1 text-sm">Contatos cadastrados nos WhatsApp Channel desta empresa.</p>
      </div>

      <Card className="p-4">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="filter-agent">Agente</Label>
            <Select
              value={agentId || "all"}
              onValueChange={(value) => {
                setAgentId(value === "all" ? "" : value);
                setPage(1);
              }}
            >
              <SelectTrigger id="filter-agent" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                {agents?.map((a) => (
                  <SelectItem key={a.id} value={a.id}>
                    {a.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="filter-name">Nome</Label>
            <Input
              id="filter-name"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setPage(1);
              }}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="filter-phone">Número</Label>
            <Input
              id="filter-phone"
              value={phone}
              onChange={(e) => {
                setPhone(e.target.value);
                setPage(1);
              }}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="filter-email">E-mail</Label>
            <Input
              id="filter-email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setPage(1);
              }}
            />
          </div>
        </div>
      </Card>

      <Card className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-border text-muted-foreground border-b text-left text-xs uppercase">
              <th className="px-4 py-3 font-medium">Nome</th>
              <th className="px-4 py-3 font-medium">Número</th>
              <th className="px-4 py-3 font-medium">Agente</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Última interação</th>
            </tr>
          </thead>
          <tbody>
            {data?.items.map((target) => (
              <tr
                key={target.id}
                className="border-border hover:bg-accent/50 cursor-pointer border-b last:border-0"
                onClick={() => navigate(`/targets/${target.id}`)}
              >
                <td className="px-4 py-3">{target.name || "—"}</td>
                <td className="px-4 py-3">{target.waId}</td>
                <td className="px-4 py-3">{target.whatsappChannel?.agent?.name ?? "—"}</td>
                <td className="px-4 py-3">{STATUS_LABELS[target.status]}</td>
                <td className="px-4 py-3">
                  {target.lastInteractionAt ? new Date(target.lastInteractionAt).toLocaleString("pt-BR") : "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {data && data.items.length === 0 && (
          <p className="text-muted-foreground p-6 text-center text-sm">Nenhum contato encontrado.</p>
        )}
      </Card>

      {data && data.total > 0 && (
        <div className="flex items-center justify-between text-sm">
          <p className="text-muted-foreground">
            Página {data.page} de {totalPages} · {data.total} contato(s)
          </p>
          <div className="flex gap-2">
            <button
              className="rounded-md border px-3 py-1 disabled:opacity-50"
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
            >
              Anterior
            </button>
            <button
              className="rounded-md border px-3 py-1 disabled:opacity-50"
              disabled={page >= totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
              Próxima
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
