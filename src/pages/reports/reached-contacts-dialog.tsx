import { Megaphone, MessageCircleReply, Send, TriangleAlert } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import type { CampaignMetrics } from "@/types/domain";
import { formatNumber, formatPercent } from "./reports-page";

interface ReachedContactsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  metrics: CampaignMetrics;
}

/// Modal "Contatos alcançados", aberto a partir do card de mesmo nome em
/// Métricas de campanhas. Detalha a fração de contatos realmente alcançados
/// sobre o total já processado por todas as campanhas, a taxa de resposta, e
/// um saldo (alcançados - total processado) que mostra se o envio está
/// saudável (perto de 0, verde) ou com muita falha (bem negativo, vermelho).
export function ReachedContactsDialog({ open, onOpenChange, metrics }: ReachedContactsDialogProps) {
  const { totalCampaigns, reachedContacts, totalContacts, totalFailures, reachDelta, respondedDispatches, responseRate } = metrics;

  const reachPct = totalContacts > 0 ? Math.round((reachedContacts / totalContacts) * 100) : 0;
  const isHealthy = reachDelta === 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Contatos alcançados</DialogTitle>
          <DialogDescription>
            Quantos contatos as campanhas realmente alcançaram frente a tudo que já foi processado, e como está a
            resposta desses contatos.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          <div className="border-border rounded-lg border p-4">
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-semibold">{formatNumber(reachedContacts)}</span>
              <span className="text-muted-foreground text-sm">de {formatNumber(totalContacts)} contatos</span>
            </div>
            <div className="bg-muted mt-2 h-1.5 w-full overflow-hidden rounded-full">
              <div className="bg-success h-full" style={{ width: `${Math.min(reachPct, 100)}%` }} />
            </div>
            <p className="text-muted-foreground mt-2 text-xs">
              {reachPct}% de todos os contatos processados em campanhas foram efetivamente alcançados
              {totalFailures > 0 && ` — ${formatNumber(totalFailures)} falha(s) de envio`}.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="border-border flex items-start gap-3 rounded-lg border p-3">
              <div className="bg-primary/10 text-primary flex size-9 shrink-0 items-center justify-center rounded-lg">
                <Megaphone className="size-4" />
              </div>
              <div className="min-w-0">
                <p className="text-muted-foreground text-xs">Total de campanhas</p>
                <p className="text-lg font-semibold">{formatNumber(totalCampaigns)}</p>
              </div>
            </div>

            <div className="border-border flex items-start gap-3 rounded-lg border p-3">
              <div className="bg-warning/15 text-warning flex size-9 shrink-0 items-center justify-center rounded-lg">
                <MessageCircleReply className="size-4" />
              </div>
              <div className="min-w-0">
                <p className="text-muted-foreground text-xs">Taxa de resposta</p>
                <p className="text-lg font-semibold">{formatPercent(responseRate)}</p>
                <p className="text-muted-foreground text-xs">
                  {formatNumber(respondedDispatches)} de {formatNumber(reachedContacts)} alcançados
                </p>
              </div>
            </div>
          </div>

          <div
            className={cn(
              "flex items-start gap-3 rounded-lg border p-3",
              isHealthy ? "border-success/30 bg-success/10" : "border-destructive/30 bg-destructive/10",
            )}
          >
            <div
              className={cn(
                "flex size-9 shrink-0 items-center justify-center rounded-lg",
                isHealthy ? "bg-success/15 text-success" : "bg-destructive/15 text-destructive",
              )}
            >
              {isHealthy ? <Send className="size-4" /> : <TriangleAlert className="size-4" />}
            </div>
            <div className="min-w-0">
              <p className="text-muted-foreground text-xs">Saldo de envio (alcançados − enviados)</p>
              <p className={cn("text-lg font-semibold", isHealthy ? "text-success" : "text-destructive")}>
                {formatNumber(reachDelta)}
              </p>
              <p className="text-muted-foreground text-xs">
                {isHealthy
                  ? "Nenhuma falha de envio: todo contato processado foi alcançado."
                  : `${formatNumber(totalFailures)} contato(s) não foram alcançados apesar de processados — fique de olho na saúde do envio.`}
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
