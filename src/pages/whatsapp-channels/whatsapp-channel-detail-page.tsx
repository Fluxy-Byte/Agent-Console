import { useParams } from "react-router-dom";
import useSWR from "swr";
import { PageBreadcrumb } from "@/components/ui/breadcrumb";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCan } from "@/hooks/use-can";
import { PermissionAction } from "@/domain/permission-action";
import type { WhatsappChannel } from "@/types/domain";
import { ConfigTab } from "./config-tab";
import { DashboardTab } from "./dashboard-tab";

export function WhatsappChannelDetailPage() {
  const { id } = useParams<{ id: string }>();
  const can = useCan();
  const canWrite = can(PermissionAction.WABAS_WRITE);

  const { data: channel, mutate } = useSWR<WhatsappChannel>(id ? `/api/wc/${id}` : null);

  if (!channel) return <div className="p-6 text-sm text-muted-foreground">Carregando…</div>;

  return (
    <div className="flex flex-col gap-6 p-6">
      <PageBreadcrumb items={[{ label: "WhatsApp Channel", to: "/wc" }, { label: channel.displayNumber }]} />

      <div>
        <h1 className="font-[family-name:var(--font-display)] text-2xl font-semibold">{channel.displayNumber}</h1>
        <p className="text-muted-foreground mt-1 text-sm">Configurações e métricas do WhatsApp Channel.</p>
      </div>

      <Tabs defaultValue="dashboard">
        <TabsList>
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="config">Configuração</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard">
          <DashboardTab channelId={channel.id} hasMetaAccessToken={channel.hasMetaAccessToken} />
        </TabsContent>

        <TabsContent value="config">
          <ConfigTab channel={channel} canWrite={canWrite} onSaved={() => mutate()} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
