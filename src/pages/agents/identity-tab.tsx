import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import type { AgentFormTabProps } from "./agent-form-types";

export function IdentityTab({ form, set, disabled }: AgentFormTabProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Identidade</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="agent-name">Nome</Label>
          <Input
            id="agent-name"
            required
            disabled={disabled}
            value={form.name}
            onChange={(e) => set("name", e.target.value)}
          />
        </div>
        <div className="flex items-center justify-between">
          <Label>Agente ativo</Label>
          <Switch checked={form.isActive} onCheckedChange={(v) => set("isActive", v)} disabled={disabled} />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="agent-personality">Personalidade do seu agente</Label>
          <p className="text-muted-foreground text-xs">
            Como o agente deve falar e se comunicar — isso é sempre incluído no prompt de geração de resposta,
            moldando o tom das mensagens.
          </p>
          <Textarea
            id="agent-personality"
            disabled={disabled}
            value={form.personality}
            onChange={(e) => set("personality", e.target.value)}
          />
        </div>
      </CardContent>
    </Card>
  );
}
