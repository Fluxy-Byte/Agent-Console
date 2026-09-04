import { useState } from "react";
import useSWR from "swr";
import { toast } from "sonner";
import { Bot } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { api, ApiError } from "@/lib/api";
import { cn } from "@/lib/utils";
import type { Agent, WhatsappChannel } from "@/types/domain";

interface AgentPickerDialogProps {
  channel: WhatsappChannel;
  disabled: boolean;
  onSaved: () => void;
  trigger: React.ReactNode;
}

/// Modal "Agentes" — em vez de um select, o usuário clica direto no agente
/// desejado; o ativo aparece destacado num tom mais claro pra diferenciar
/// dos demais, e clicar em qualquer outro pede confirmação antes de trocar
/// de verdade (é uma troca imediata, sem botão "Salvar" à parte).
export function AgentPickerDialog({ channel, disabled, onSaved, trigger }: AgentPickerDialogProps) {
  const [open, setOpen] = useState(false);
  const { data: agents } = useSWR<Agent[]>(open ? "/api/agents" : null);

  const [pendingAgent, setPendingAgent] = useState<Agent | null>(null);
  const [saving, setSaving] = useState(false);

  async function confirmChange() {
    if (!pendingAgent) return;
    setSaving(true);
    try {
      await api.put(`/api/wc/${channel.id}`, { agentId: pendingAgent.id });
      onSaved();
      toast.success(`Agente alterado para "${pendingAgent.name}".`);
      setPendingAgent(null);
      setOpen(false);
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Não foi possível trocar o agente.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>{trigger}</DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Agentes</DialogTitle>
            <DialogDescription>
              Clique num agente pra vincular este canal a ele. O agente atual aparece destacado.
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-2">
            {agents?.map((agent) => {
              const isCurrent = agent.id === channel.agentId;
              return (
                <button
                  key={agent.id}
                  type="button"
                  disabled={disabled || isCurrent}
                  onClick={() => setPendingAgent(agent)}
                  className={cn(
                    "border-border flex items-center gap-3 rounded-lg border p-3 text-left transition-colors",
                    isCurrent ? "bg-primary/5 border-primary/30" : "hover:bg-accent disabled:cursor-not-allowed disabled:opacity-50",
                  )}
                >
                  <div className="bg-primary/10 text-primary flex size-9 shrink-0 items-center justify-center rounded-full">
                    <Bot className="size-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{agent.name}</p>
                  </div>
                  {isCurrent && <Badge className="bg-primary/10 text-primary border-transparent shrink-0">Atual</Badge>}
                </button>
              );
            })}
            {agents && agents.length === 0 && (
              <p className="text-muted-foreground py-2 text-center text-sm">Nenhum agente cadastrado.</p>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={pendingAgent !== null} onOpenChange={(v) => !v && setPendingAgent(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Trocar o agente deste canal?</AlertDialogTitle>
            <AlertDialogDescription>
              O canal <strong>{channel.displayNumber}</strong> passa a ser atendido por{" "}
              <strong>{pendingAgent?.name}</strong> a partir de agora.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={saving}>Cancelar</AlertDialogCancel>
            <AlertDialogAction disabled={saving} onClick={confirmChange}>
              {saving ? "Trocando…" : "Trocar agente"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
