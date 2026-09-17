import { useMemo } from "react";
import { useParams } from "react-router-dom";
import useSWR from "swr";
import { Bot, Calendar, ClipboardList, FileText, Mail, Megaphone, Phone, Send, Tag, User, Users, XCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { PageBreadcrumb } from "@/components/ui/breadcrumb";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MetricCard } from "@/components/metric-card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { CampaignDetail, CampaignTargetItem } from "@/types/domain";

const CATEGORY_LABEL: Record<string, string> = {
  MARKETING: "Marketing",
  UTILITY: "Utilidade",
  AUTHENTICATION: "Autenticação",
};

const SENT_STATUSES = ["SENT", "DELIVERED", "READ"];

const DISPATCH_TYPE_LABEL: Record<string, string> = { MANUAL: "Manual", CSV: "Lista (CSV)" };

const STATUS_BADGE: Record<string, { label: string; variant: "success" | "destructive" | "outline" }> = {
  SENT: { label: "Enviado", variant: "success" },
  DELIVERED: { label: "Entregue", variant: "success" },
  READ: { label: "Lido", variant: "success" },
  FAILED: { label: "Falha", variant: "destructive" },
};

function formatVariables(variables: CampaignTargetItem["variables"]): string {
  if (!variables) return "—";
  const values = [...(variables.header ?? []), ...(variables.body ?? [])];
  if (values.length === 0) return "—";
  return values.map((v) => v?.text ?? "").filter(Boolean).join(", ");
}

function CampaignTargetsTable({ targets }: { targets: CampaignTargetItem[] }) {
  if (targets.length === 0) {
    return <p className="text-muted-foreground py-8 text-center text-sm">Nenhum contato nesta categoria.</p>;
  }

  return (
    <div className="border-border overflow-hidden rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-left">Contato</TableHead>
            <TableHead>Variáveis</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Data</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {targets.map((t) => {
            return (
              <TableRow key={t.id}>
                <TableCell className="text-left">
                  <div className="min-w-0">
                    <p className="truncate font-medium">{t.targetName || "Desconhecido"}</p>
                    <p className="text-muted-foreground truncate text-xs">{t.targetPhone ?? "—"}</p>
                  </div>
                </TableCell>
                <TableCell className="text-muted-foreground max-w-48 truncate">{formatVariables(t.variables)}</TableCell>
                <TableCell>
                  <div className="flex items-center justify-center">
                    <Badge variant={STATUS_BADGE[t.status]?.variant ?? "outline"}>
                      {STATUS_BADGE[t.status]?.label ?? t.status}
                    </Badge>
                  </div>
                </TableCell>
                <TableCell className="text-muted-foreground">{new Date(t.createdAt).toLocaleString("pt-BR")}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}

export function CampaignDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: campaign } = useSWR<CampaignDetail>(id ? `/api/campaigns/${id}` : null);

  const sentTargets = useMemo(() => campaign?.targets.filter((t) => SENT_STATUSES.includes(t.status)) ?? [], [campaign]);
  const failedTargets = useMemo(() => campaign?.targets.filter((t) => t.status === "FAILED") ?? [], [campaign]);

  if (!campaign) return <div className="text-muted-foreground p-6 text-sm">Carregando…</div>;

  return (
    <div className="flex flex-col gap-6 p-6">
      <PageBreadcrumb items={[{ label: "Campanhas", to: "/campaigns" }, { label: campaign.name }]} />

      <div className="flex items-start gap-3">
        <div className="bg-primary/10 text-primary flex size-10 shrink-0 items-center justify-center rounded-lg">
          <Megaphone className="size-5" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-[family-name:var(--font-display)] text-2xl font-semibold">{campaign.name}</h1>
            <Badge variant={campaign.status === "COMPLETED" ? "success" : "warning"}>
              {campaign.status === "COMPLETED" ? "Concluída" : "Enviando..."}
            </Badge>
          </div>
          <p className="text-muted-foreground mt-1 text-sm">Detalhes do disparo desta campanha de WhatsApp.</p>
        </div>
      </div>

      <Card className="shadow-xl">
        <CardHeader>
          <div className="flex items-start gap-3">
            <div className="bg-primary/10 text-primary flex size-10 shrink-0 items-center justify-center rounded-lg">
              <ClipboardList className="size-5" />
            </div>
            <div>
              <CardTitle>Dados do disparo</CardTitle>
              <p className="text-muted-foreground mt-1 text-sm">Quem disparou essa campanha, quando e com quais configurações.</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: "Disparado por", value: campaign.createdByName ?? "—", icon: User },
            { label: "E-mail", value: campaign.createdByEmail ?? "—", icon: Mail },
            { label: "Data do disparo", value: new Date(campaign.sentAt).toLocaleString("pt-BR"), icon: Calendar },
            { label: "Tipo de disparo", value: DISPATCH_TYPE_LABEL[campaign.dispatchType] ?? campaign.dispatchType, icon: Send },
            { label: "Template", value: campaign.templateName, icon: FileText },
            {
              label: "Categoria",
              value: campaign.category ? CATEGORY_LABEL[campaign.category] ?? campaign.category : "—",
              icon: Tag,
            },
            { label: "Canal", value: campaign.whatsappChannelDisplayNumber, icon: Phone },
            { label: "Agente", value: campaign.agentName, icon: Bot },
          ].map((field) => (
            <div key={field.label} className="border-border bg-card flex items-center gap-3 rounded-lg border p-3 shadow-xl">
              <div className="bg-primary/10 text-primary flex size-9 shrink-0 items-center justify-center rounded-full">
                <field.icon className="size-4" />
              </div>
              <div className="min-w-0">
                <p className="text-muted-foreground text-xs">{field.label}</p>
                <p className="truncate text-sm font-semibold">{field.value}</p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <MetricCard
          icon={Users}
          iconClassName="bg-primary/10 text-primary"
          label="Contatos"
          value={campaign.expectedContacts}
          sublabel="Total na campanha"
        />
        <MetricCard
          icon={Send}
          iconClassName="bg-success/15 text-success"
          label="Enviados"
          value={campaign.totalSent}
          sublabel={`${sentTargets.length} com confirmação`}
        />
        <MetricCard
          icon={XCircle}
          iconClassName="bg-destructive/15 text-destructive"
          label="Falhas"
          value={campaign.totalFailures}
          sublabel={campaign.totalFailures > 0 ? "Precisam de atenção" : "Nenhuma falha"}
        />
      </div>

      <Tabs defaultValue="contacts">
        <TabsList>
          <TabsTrigger value="contacts">
            <Users className="size-4" /> Contatos
          </TabsTrigger>
          <TabsTrigger value="sent">
            <Send className="size-4" /> Enviados
          </TabsTrigger>
          <TabsTrigger value="failures">
            <XCircle className="size-4" /> Falhas
          </TabsTrigger>
        </TabsList>
        <TabsContent value="contacts">
          <Card className="shadow-xl">
            <CardHeader>
              <div className="flex items-start gap-3">
                <div className="bg-primary/10 text-primary flex size-10 shrink-0 items-center justify-center rounded-lg">
                  <Users className="size-5" />
                </div>
                <div>
                  <CardTitle>Contatos</CardTitle>
                  <p className="text-muted-foreground mt-1 text-sm">Todos os contatos desta campanha.</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <CampaignTargetsTable targets={campaign.targets ?? []} />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="sent">
          <Card className="shadow-xl">
            <CardHeader>
              <div className="flex items-start gap-3">
                <div className="bg-success/15 text-success flex size-10 shrink-0 items-center justify-center rounded-lg">
                  <Send className="size-5" />
                </div>
                <div>
                  <CardTitle>Enviados</CardTitle>
                  <p className="text-muted-foreground mt-1 text-sm">Contatos com confirmação de envio, entrega ou leitura.</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <CampaignTargetsTable targets={sentTargets} />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="failures">
          <Card className="shadow-xl">
            <CardHeader>
              <div className="flex items-start gap-3">
                <div className="bg-destructive/15 text-destructive flex size-10 shrink-0 items-center justify-center rounded-lg">
                  <XCircle className="size-5" />
                </div>
                <div>
                  <CardTitle>Falhas</CardTitle>
                  <p className="text-muted-foreground mt-1 text-sm">Contatos que tiveram falha no envio da campanha.</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <CampaignTargetsTable targets={failedTargets} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
