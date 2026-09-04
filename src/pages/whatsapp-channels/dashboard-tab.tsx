import useSWR from "swr";
import { BadgeCheck, BarChart3, Gauge, MessageSquare, Send, ShieldCheck, Tag, Wallet, Wifi, type LucideIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ApiError } from "@/lib/api";
import { cn } from "@/lib/utils";
import type {
  MonthlyConversations,
  MonthlyMessageVolume,
  TemplateCategory,
  WhatsappChannelCampaignReport,
  WhatsappChannelStatus,
} from "@/types/domain";
import { MonthlyConversationsChart } from "./monthly-conversations-chart";
import { MonthlyMessageVolumeChart } from "./monthly-message-volume-chart";

const CATEGORY_LABEL: Record<TemplateCategory, string> = {
  MARKETING: "Marketing",
  UTILITY: "Utilidade",
  AUTHENTICATION: "Autenticação",
};

function categoryLabel(category: string | null): string {
  if (!category) return "Sem categoria";
  return CATEGORY_LABEL[category as TemplateCategory] ?? category;
}

type StatusSeverity = "success" | "warning" | "destructive" | "neutral";

const GOOD_STATUSES = new Set(["CONNECTED", "GREEN", "VERIFIED", "APPROVED", "AVAILABLE_WITHOUT_REVIEW"]);
const BAD_STATUSES = new Set(["RED", "FLAGGED", "RESTRICTED", "RATE_LIMITED", "BANNED", "DECLINED", "EXPIRED"]);
const WARN_STATUSES = new Set(["YELLOW", "PENDING", "PENDING_REVIEW", "NOT_VERIFIED"]);

function statusSeverity(value?: string): StatusSeverity {
  if (!value) return "neutral";
  if (GOOD_STATUSES.has(value)) return "success";
  if (BAD_STATUSES.has(value)) return "destructive";
  if (WARN_STATUSES.has(value)) return "warning";
  return "neutral";
}

const SEVERITY_ICON_CLASS: Record<StatusSeverity, string> = {
  success: "bg-success/15 text-success",
  warning: "bg-warning/15 text-warning",
  destructive: "bg-destructive/15 text-destructive",
  neutral: "bg-muted text-muted-foreground",
};

const SEVERITY_TEXT_CLASS: Record<StatusSeverity, string> = {
  success: "text-success",
  warning: "text-warning",
  destructive: "text-destructive",
  neutral: "text-foreground",
};

/// Valores brutos que a Graph API da Meta devolve pros campos de status do
/// número — sempre em inglês. Um único dicionário cobre todos os campos: os
/// valores não colidem em significado entre eles (ex: EXPIRED sempre quer
/// dizer "expirado", não importa em qual campo apareça).
const STATUS_VALUE_LABEL: Record<string, string> = {
  CONNECTED: "Conectado",
  PENDING: "Pendente",
  FLAGGED: "Sinalizado",
  RESTRICTED: "Restrito",
  RATE_LIMITED: "Taxa limitada",
  BANNED: "Banido",
  DELETED: "Excluído",
  MIGRATED: "Migrado",
  UNKNOWN: "Desconhecido",
  UNVERIFIED: "Não verificado",
  GREEN: "Alta",
  YELLOW: "Média",
  RED: "Baixa",
  NA: "Não disponível",
  APPROVED: "Aprovado",
  AVAILABLE_WITHOUT_REVIEW: "Disponível sem revisão",
  DECLINED: "Recusado",
  EXPIRED: "Expirado",
  PENDING_REVIEW: "Em revisão",
  NONE: "Nenhum",
  VERIFIED: "Verificado",
  NOT_VERIFIED: "Não verificado",
  TIER_50: "Até 50 conversas/dia",
  TIER_250: "Até 250 conversas/dia",
  TIER_1K: "Até 1 mil conversas/dia",
  TIER_10K: "Até 10 mil conversas/dia",
  TIER_100K: "Até 100 mil conversas/dia",
  TIER_UNLIMITED: "Ilimitado",
};

function translateStatusValue(value: string): string {
  return STATUS_VALUE_LABEL[value] ?? value.replaceAll("_", " ");
}

const STATUS_FIELD_META: Record<string, { label: string; icon: LucideIcon }> = {
  status: { label: "Status da conexão", icon: Wifi },
  quality_rating: { label: "Qualidade", icon: Gauge },
  name_status: { label: "Nome do perfil", icon: BadgeCheck },
  code_verification_status: { label: "Verificação", icon: ShieldCheck },
  messaging_limit_tier: { label: "Limite de envio", icon: Send },
};

function StatusTile({ icon: Icon, label, value }: { icon: LucideIcon; label: string; value: string }) {
  const severity = statusSeverity(value);
  return (
    <div className="border-border bg-card flex items-center gap-3 rounded-xl border p-4">
      <div className={cn("flex size-11 shrink-0 items-center justify-center rounded-full", SEVERITY_ICON_CLASS[severity])}>
        <Icon className="size-5" />
      </div>
      <div className="min-w-0">
        <p className="text-muted-foreground text-xs">{label}</p>
        <p className={cn("truncate text-base font-semibold", SEVERITY_TEXT_CLASS[severity])}>
          {translateStatusValue(value)}
        </p>
      </div>
    </div>
  );
}

function ValueTile({ icon: Icon, label, value }: { icon: LucideIcon; label: string; value: string | number }) {
  return (
    <div className="border-border bg-card flex items-center gap-3 rounded-xl border p-4">
      <div className="bg-primary/15 text-primary flex size-11 shrink-0 items-center justify-center rounded-full">
        <Icon className="size-5" />
      </div>
      <div className="min-w-0">
        <p className="text-muted-foreground text-xs">{label}</p>
        <p className="text-foreground truncate text-base font-semibold">{value}</p>
      </div>
    </div>
  );
}

function CardIcon({ icon: Icon }: { icon: LucideIcon }) {
  return (
    <div className="bg-primary/15 text-primary flex size-7 items-center justify-center rounded-lg">
      <Icon className="size-4" />
    </div>
  );
}

interface DashboardTabProps {
  channelId: string;
  hasMetaAccessToken: boolean;
}

export function DashboardTab({ channelId, hasMetaAccessToken }: DashboardTabProps) {
  const { data: status, error: statusError } = useSWR<WhatsappChannelStatus>(
    hasMetaAccessToken ? `/api/wc/${channelId}/status` : null,
  );
  const { data: conversations } = useSWR<MonthlyConversations>(`/api/wc/${channelId}/conversations-by-month`);
  const { data: messageVolume } = useSWR<MonthlyMessageVolume>(`/api/wc/${channelId}/messages-by-month`);
  const { data: campaignReport } = useSWR<WhatsappChannelCampaignReport>(`/api/wc/${channelId}/campaigns-report`);

  /// Volumetria total = mensagens trocadas no mês atual (enviadas +
  /// recebidas) — não é soma de Campaign.totalSent, isso conta só disparo
  /// ativo e ignora o que o cliente manda de volta.
  const currentMonth = new Date().getMonth() + 1;
  const currentMonthVolume = messageVolume?.months.find((m) => m.month === currentMonth);
  const totalVolumeThisMonth = currentMonthVolume ? currentMonthVolume.sent + currentMonthVolume.received : 0;

  return (
    <div className="flex flex-col gap-6">
      {hasMetaAccessToken && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CardIcon icon={ShieldCheck} /> Status do número na Meta
            </CardTitle>
          </CardHeader>
          <CardContent>
            {!status && !statusError && <p className="text-muted-foreground text-sm">Consultando a Meta…</p>}
            {statusError && (
              <p className="text-destructive text-sm">
                {statusError instanceof ApiError ? statusError.message : "Não foi possível consultar o status."}
              </p>
            )}
            {status && (
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {Object.entries(STATUS_FIELD_META).map(([field, meta]) => {
                  const value = status[field as keyof WhatsappChannelStatus] as string | undefined;
                  if (!value) return null;
                  return <StatusTile key={field} icon={meta.icon} label={meta.label} value={value} />;
                })}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CardIcon icon={Wallet} /> Gastos
          </CardTitle>
          <p className="text-muted-foreground text-sm">
            Volumetria de mensagens trocadas no mês atual e mensagens de campanha enviadas por categoria de template.
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <ValueTile icon={Send} label="Volumetria total (mês atual)" value={totalVolumeThisMonth} />
            {campaignReport?.byCategory.map((row) => (
              <ValueTile key={row.category ?? "none"} icon={Tag} label={categoryLabel(row.category)} value={row.messagesSent} />
            ))}
          </div>
        </CardContent>
      </Card>

      {conversations && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CardIcon icon={BarChart3} /> Conversas por mês em {conversations.year}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <MonthlyConversationsChart data={conversations} />
          </CardContent>
        </Card>
      )}

      {messageVolume && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CardIcon icon={MessageSquare} /> Mensagens por mês em {messageVolume.year}
            </CardTitle>
            <p className="text-muted-foreground text-sm">
              Volumetria de mensagens trocadas — diferente de conversas, uma mesma conversa pode ter várias mensagens.
            </p>
          </CardHeader>
          <CardContent>
            <MonthlyMessageVolumeChart data={messageVolume} />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
