import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useSWR from "swr";
import {
  ArrowLeft,
  Calendar,
  CheckCircle2,
  type LucideIcon,
  Megaphone,
  Send,
  User,
  Users,
  XCircle,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { PageBreadcrumb } from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { MetricCard } from "@/components/metric-card";
import { cn } from "@/lib/utils";
import type { CampaignDetail, CampaignTargetItem } from "@/types/domain";

const CATEGORY_LABEL: Record<string, string> = {
  MARKETING: "Marketing",
  UTILITY: "Utilidade",
  AUTHENTICATION: "Autenticação",
};

const SENT_STATUSES = ["SENT", "DELIVERED", "READ"];

const STATUS_BADGE: Record<string, { label: string; variant: "success" | "destructive" | "outline" }> = {
  SENT: { label: "Enviado", variant: "success" },
  DELIVERED: { label: "Entregue", variant: "success" },
  READ: { label: "Lido", variant: "success" },
  FAILED: { label: "Falha", variant: "destructive" },
};

const STATUS_ICON: Record<string, { icon: LucideIcon; className: string }> = {
  SENT: { icon: CheckCircle2, className: "bg-success/15 text-success" },
  DELIVERED: { icon: CheckCircle2, className: "bg-success/15 text-success" },
  READ: { icon: CheckCircle2, className: "bg-success/15 text-success" },
  FAILED: { icon: XCircle, className: "bg-destructive/15 text-destructive" },
};

function formatVariables(variables: CampaignTargetItem["variables"]): string {
  if (!variables) return "—";
  const values = [...(variables.header ?? []), ...(variables.body ?? [])];
  if (values.length === 0) return "—";
  return values.map((v) => v?.text ?? "").filter(Boolean).join(", ");
}

type MetricKey = "contacts" | "sent" | "failures" | null;

const METRIC_DIALOG_META: Record<Exclude<MetricKey, null>, { title: string; icon: LucideIcon; iconClassName: string }> = {
  contacts: { title: "Contatos", icon: Users, iconClassName: "bg-primary/15 text-primary" },
  sent: { title: "Enviados", icon: Send, iconClassName: "bg-success/15 text-success" },
  failures: { title: "Falhas", icon: XCircle, iconClassName: "bg-destructive/15 text-destructive" },
};

export function CampaignDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { data: campaign } = useSWR<CampaignDetail>(id ? `/api/campaigns/${id}` : null);
  const [openMetric, setOpenMetric] = useState<MetricKey>(null);

  const sentTargets = useMemo(() => campaign?.targets.filter((t) => SENT_STATUSES.includes(t.status)) ?? [], [campaign]);
  const failedTargets = useMemo(() => campaign?.targets.filter((t) => t.status === "FAILED") ?? [], [campaign]);

  if (!campaign) return <div className="text-muted-foreground p-6 text-sm">Carregando…</div>;

  const dialogTargets =
    openMetric === "sent" ? sentTargets : openMetric === "failures" ? failedTargets : (campaign.targets ?? []);

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-6 p-6">
      <PageBreadcrumb items={[{ label: "Campanhas", to: "/campaigns" }, { label: campaign.name }]} />

      <Button variant="ghost" size="sm" onClick={() => navigate("/campaigns")} className="w-fit gap-2 px-2">
        <ArrowLeft className="size-4" /> Voltar
      </Button>

      <div className="border-border bg-card flex flex-col items-center gap-3 rounded-xl border p-6 text-center">
        <div className="bg-primary/10 text-primary flex size-14 items-center justify-center rounded-2xl">
          <Megaphone className="size-7" />
        </div>
        <div>
          <h1 className="font-[family-name:var(--font-display)] text-2xl font-semibold">{campaign.name}</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Template <strong className="text-foreground font-medium">{campaign.templateName}</strong>
            {campaign.category && <> · {CATEGORY_LABEL[campaign.category] ?? campaign.category}</>}
            {" "}· {campaign.agentName} · {campaign.whatsappChannelDisplayNumber}
          </p>
        </div>
        <Badge variant={campaign.status === "COMPLETED" ? "success" : "warning"} className="mt-1">
          {campaign.status === "COMPLETED" ? "Concluída" : "Enviando..."}
        </Badge>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <MetricCard
          icon={Users}
          iconClassName="bg-primary/10 text-primary"
          label="Contatos"
          value={campaign.expectedContacts}
          sublabel="Total na campanha"
          onClick={() => setOpenMetric("contacts")}
        />
        <MetricCard
          icon={Send}
          iconClassName="bg-success/15 text-success"
          label="Enviados"
          value={campaign.totalSent}
          sublabel={`${sentTargets.length} com confirmação`}
          onClick={() => setOpenMetric("sent")}
        />
        <MetricCard
          icon={XCircle}
          iconClassName="bg-destructive/15 text-destructive"
          label="Falhas"
          value={campaign.totalFailures}
          sublabel={campaign.totalFailures > 0 ? "Precisam de atenção" : "Nenhuma falha"}
          onClick={() => setOpenMetric("failures")}
        />
      </div>

      <div className="border-border bg-card flex items-center gap-3 rounded-xl border p-4">
        <div className="bg-muted text-muted-foreground flex size-10 shrink-0 items-center justify-center rounded-lg">
          <Calendar className="size-5" />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-medium">Disparado por {campaign.createdByName ?? "—"}</p>
          <p className="text-muted-foreground text-xs">{new Date(campaign.sentAt).toLocaleString("pt-BR")}</p>
        </div>
      </div>

      <Dialog open={openMetric !== null} onOpenChange={(open) => !open && setOpenMetric(null)}>
        <DialogContent className="max-h-[85vh] overflow-hidden sm:max-w-lg">
          {openMetric && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      "flex size-10 shrink-0 items-center justify-center rounded-lg",
                      METRIC_DIALOG_META[openMetric].iconClassName,
                    )}
                  >
                    {(() => {
                      const Icon = METRIC_DIALOG_META[openMetric].icon;
                      return <Icon className="size-5" />;
                    })()}
                  </div>
                  <div>
                    <DialogTitle>
                      {METRIC_DIALOG_META[openMetric].title} ({dialogTargets.length})
                    </DialogTitle>
                    <DialogDescription>Campanha {campaign.name}</DialogDescription>
                  </div>
                </div>
              </DialogHeader>

              <div className="-mx-2 flex max-h-[60vh] flex-col gap-2 overflow-y-auto px-2">
                {dialogTargets.length === 0 ? (
                  <p className="text-muted-foreground py-8 text-center text-sm">Nenhum contato nesta categoria.</p>
                ) : (
                  dialogTargets.map((t) => {
                    const statusMeta = STATUS_ICON[t.status];
                    const StatusIcon = statusMeta?.icon ?? User;
                    return (
                      <div
                        key={t.id}
                        className="border-border flex items-center gap-3 rounded-lg border px-3 py-2.5"
                      >
                        <div
                          className={cn(
                            "flex size-9 shrink-0 items-center justify-center rounded-full",
                            statusMeta?.className ?? "bg-muted text-muted-foreground",
                          )}
                        >
                          <StatusIcon className="size-4" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium">{t.targetName || "Desconhecido"}</p>
                          <p className="text-muted-foreground truncate text-xs">{t.targetPhone ?? "—"}</p>
                          {formatVariables(t.variables) !== "—" && (
                            <p className="text-muted-foreground mt-0.5 truncate text-[11px]">
                              {formatVariables(t.variables)}
                            </p>
                          )}
                        </div>
                        <div className="flex flex-col items-end gap-1">
                          <Badge variant={STATUS_BADGE[t.status]?.variant ?? "outline"}>
                            {STATUS_BADGE[t.status]?.label ?? t.status}
                          </Badge>
                          <span className="text-muted-foreground text-[11px] whitespace-nowrap">
                            {new Date(t.createdAt).toLocaleString("pt-BR")}
                          </span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
