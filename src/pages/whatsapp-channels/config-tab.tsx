import { useNavigate } from "react-router-dom";
import { Bot, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { WhatsappChannel } from "@/types/domain";
import { AgentPickerDialog } from "./agent-picker-dialog";
import { ChannelDataDialog } from "./channel-data-dialog";

interface ConfigTabProps {
  channel: WhatsappChannel;
  canWrite: boolean;
  onSaved: () => void;
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3 text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}

export function ConfigTab({ channel, canWrite, onSaved }: ConfigTabProps) {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader className="flex-row items-center justify-between space-y-0">
          <CardTitle>Agentes</CardTitle>
          <AgentPickerDialog
            channel={channel}
            disabled={!canWrite}
            onSaved={onSaved}
            trigger={
              <Button type="button" variant="outline" size="sm" disabled={!canWrite}>
                <Bot className="size-4" /> Trocar agente
              </Button>
            }
          />
        </CardHeader>
        <CardContent>
          <InfoRow label="Agente atual" value={channel.agent?.name ?? "—"} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex-row items-center justify-between space-y-0">
          <CardTitle>Dados do canal</CardTitle>
          <ChannelDataDialog
            channel={channel}
            disabled={!canWrite}
            onSaved={onSaved}
            trigger={
              <Button type="button" variant="outline" size="sm" disabled={!canWrite}>
                <Pencil className="size-4" /> Editar
              </Button>
            }
          />
        </CardHeader>
        <CardContent className="flex flex-col gap-2">
          <InfoRow label="Phone Number ID" value={channel.phoneNumberId} />
          <InfoRow label="Número de exibição" value={channel.displayNumber} />
          <InfoRow label="WhatsApp Business Account ID" value={channel.wabaId} />
          <InfoRow label="Token de acesso da Meta" value={channel.hasMetaAccessToken ? "Configurado" : "Não configurado"} />
        </CardContent>
      </Card>

      {channel.serviceIsland && (
        <Card>
          <CardHeader>
            <CardTitle>Ilha de atendimento</CardTitle>
          </CardHeader>
          <CardContent>
            <Button type="button" variant="outline" onClick={() => navigate(`/service-island/${channel.serviceIsland!.id}`)}>
              Ver {channel.serviceIsland.name}
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
