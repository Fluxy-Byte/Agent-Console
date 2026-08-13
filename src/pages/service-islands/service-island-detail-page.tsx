import { useParams } from "react-router-dom";
import useSWR from "swr";
import { PageBreadcrumb } from "@/components/ui/breadcrumb";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCan } from "@/hooks/use-can";
import { PermissionAction } from "@/domain/permission-action";
import type { ServiceIsland } from "@/types/domain";
import { GeneralSettingsTab } from "./general-settings-tab";
import { HistoryTab } from "./history-tab";
import { IslandTab } from "./island-tab";
import { MonitoringTab } from "./monitoring-tab";
import { QueuesTab } from "./queues-tab";

export function ServiceIslandDetailPage() {
  const { id } = useParams<{ id: string }>();
  const can = useCan();

  const { data: island, mutate } = useSWR<ServiceIsland>(id ? `/api/service-islands/${id}` : null);

  const canRenameIsland = can(PermissionAction.SERVICE_ISLANDS_WRITE);
  const canManageQueues = can(PermissionAction.QUEUES_WRITE);
  const canManageTags = can(PermissionAction.QUEUES_WRITE);

  if (!island) return <div className="p-6 text-sm text-muted-foreground">Carregando…</div>;

  return (
    <div className="flex flex-col gap-6 p-6">
      <PageBreadcrumb items={[{ label: "Ilhas de Atendimento", to: "/service-island" }, { label: island.name }]} />

      <Tabs defaultValue="island">
        <TabsList>
          <TabsTrigger value="island">Ilha</TabsTrigger>
          <TabsTrigger value="monitoring">Monitoramento</TabsTrigger>
          <TabsTrigger value="history">Histórico</TabsTrigger>
          <TabsTrigger value="queues">Filas</TabsTrigger>
          <TabsTrigger value="settings">Configurações Gerais</TabsTrigger>
        </TabsList>

        <TabsContent value="island">
          <IslandTab island={island} canWrite={canRenameIsland} onSaved={() => mutate()} />
        </TabsContent>

        <TabsContent value="monitoring">
          <MonitoringTab islandId={island.id} />
        </TabsContent>

        <TabsContent value="history">
          <HistoryTab island={island} />
        </TabsContent>

        <TabsContent value="queues">
          <QueuesTab islandId={island.id} canManageQueues={canManageQueues} />
        </TabsContent>

        <TabsContent value="settings">
          <GeneralSettingsTab
            island={island}
            canWrite={canRenameIsland}
            canManageTags={canManageTags}
            onSaved={() => mutate()}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
