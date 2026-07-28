import { useNavigate, useParams } from "react-router-dom";
import useSWR from "swr";
import { ArrowLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { PageBreadcrumb } from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { CampaignDetail, CampaignTargetItem } from "@/types/domain";

const CATEGORY_LABEL: Record<string, string> = {
  MARKETING: "Marketing",
  UTILITY: "Utilidade",
  AUTHENTICATION: "Autenticação",
};

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

export function CampaignDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { data: campaign } = useSWR<CampaignDetail>(id ? `/api/campaigns/${id}` : null);

  if (!campaign) return <div className="text-muted-foreground p-6 text-sm">Carregando…</div>;

  return (
    <div className="flex flex-col gap-4 p-6">
      <PageBreadcrumb items={[{ label: "Campanhas", to: "/campaigns" }, { label: campaign.name }]} />

      <Button variant="ghost" size="sm" onClick={() => navigate("/campaigns")} className="w-fit gap-2 px-2">
        <ArrowLeft className="size-4" /> Voltar
      </Button>

      <div className="border-border bg-card flex flex-col gap-1 rounded-lg border p-4">
        <h1 className="font-[family-name:var(--font-display)] text-2xl font-semibold">{campaign.name}</h1>
        <p className="text-muted-foreground text-sm">
          Template <strong>{campaign.templateName}</strong>
          {campaign.category && <> · {CATEGORY_LABEL[campaign.category] ?? campaign.category}</>}
          {" "}· {campaign.agentName} · {campaign.whatsappChannelDisplayNumber}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Card className="gap-1">
          <CardContent className="flex items-center justify-start gap-2">
            <p className="text-2xl font-semibold">{campaign.expectedContacts}</p>
            <p className="text-muted-foreground text-xs">Contatos</p>
          </CardContent>
        </Card>
        <Card className="gap-1">
          <CardContent className="flex items-center justify-start gap-2">
            <p className="text-2xl font-semibold">{campaign.totalSent}</p>
            <p className="text-muted-foreground text-xs">Enviados</p>
          </CardContent>
        </Card>
        <Card className="gap-1">
          <CardContent className="flex items-center justify-start gap-2">
            <p className="text-destructive text-2xl font-semibold">{campaign.totalFailures}</p>
            <p className="text-muted-foreground text-xs">Falhas</p>
          </CardContent>
        </Card>
        <Card className="gap-1">
          <CardContent>
            <Badge variant={campaign.status === "COMPLETED" ? "success" : "warning"}>
              {campaign.status === "COMPLETED" ? "Concluída" : "Enviando..."}
            </Badge>
            <p className="text-muted-foreground mt-1 text-xs">
              Disparado por {campaign.createdByName ?? "—"} em{" "}
              {new Date(campaign.sentAt).toLocaleString("pt-BR")}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="border-border bg-background rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-center">Contato</TableHead>
              <TableHead className="text-center">Variáveis usadas</TableHead>
              <TableHead className="text-center">Status</TableHead>
              <TableHead className="text-center">Data/Hora</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {campaign.targets.map((t) => (
              <TableRow key={t.id}>
                <TableCell className="text-center align-middle">
                  <div className="flex flex-col items-center justify-center">
                    <span className="font-medium">{t.targetName || "Desconhecido"}</span>
                    <span className="text-muted-foreground text-xs">{t.targetPhone}</span>
                  </div>
                </TableCell>
                <TableCell className="text-muted-foreground max-w-xs truncate text-center align-middle text-sm">
                  {formatVariables(t.variables)}
                </TableCell>
                <TableCell className="text-center align-middle">
                  <Badge variant={STATUS_BADGE[t.status]?.variant ?? "outline"}>
                    {STATUS_BADGE[t.status]?.label ?? t.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-muted-foreground text-center align-middle text-sm whitespace-nowrap">
                  {new Date(t.createdAt).toLocaleString("pt-BR")}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
