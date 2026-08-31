import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import type { AgentFormTabProps } from "./agent-form-types";

interface IdentityTabProps extends AgentFormTabProps {
  openaiToken: string;
  onChangeOpenaiToken: (value: string) => void;
  openaiTokenPreview: string | null;
  geminiToken: string;
  onChangeGeminiToken: (value: string) => void;
  geminiTokenPreview: string | null;
}

export function IdentityTab({
  form,
  set,
  disabled,
  openaiToken,
  onChangeOpenaiToken,
  openaiTokenPreview,
  geminiToken,
  onChangeGeminiToken,
  geminiTokenPreview,
}: IdentityTabProps) {
  return (
    <div className="flex flex-col gap-6">
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

      <Card>
        <CardHeader>
          <CardTitle>Tokens de IA</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <p className="text-muted-foreground text-xs">
            Guardados de forma criptografada — por segurança, nunca mostramos o token completo aqui, só os 6
            primeiros caracteres do que já está salvo.
          </p>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="agent-openai-token">Token da OpenAI (RAG)</Label>
            <Input
              id="agent-openai-token"
              type="password"
              disabled={disabled}
              placeholder={
                openaiTokenPreview ? `${openaiTokenPreview}•••••••• — digite para trocar` : "Nenhum token configurado"
              }
              value={openaiToken}
              onChange={(e) => onChangeOpenaiToken(e.target.value)}
            />
            <p className="text-muted-foreground text-xs">Usado na busca da base de conhecimento (RAG) do agente.</p>
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="agent-gemini-token">Token do Gemini (ADK)</Label>
            <Input
              id="agent-gemini-token"
              type="password"
              disabled={disabled}
              placeholder={
                geminiTokenPreview ? `${geminiTokenPreview}•••••••• — digite para trocar` : "Nenhum token configurado"
              }
              value={geminiToken}
              onChange={(e) => onChangeGeminiToken(e.target.value)}
            />
            <p className="text-muted-foreground text-xs">
              Usado pelo Google ADK na geração das respostas do agente.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
