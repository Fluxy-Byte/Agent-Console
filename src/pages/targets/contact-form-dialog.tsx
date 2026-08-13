import { type FormEvent, useState } from "react";
import useSWR from "swr";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { api, ApiError } from "@/lib/api";
import type { WhatsappChannel } from "@/types/domain";

interface ContactFormDialogProps {
  onCreated: () => void;
  trigger: React.ReactNode;
}

/// Cadastro manual de contato — fora do fluxo normal (webhook inbound /
/// disparo de campanha), usado pelo botão "Novo contato".
export function ContactFormDialog({ onCreated, trigger }: ContactFormDialogProps) {
  const [open, setOpen] = useState(false);
  const { data: channels } = useSWR<WhatsappChannel[]>(open ? "/api/wc" : null);

  const [whatsappChannelId, setWhatsappChannelId] = useState("");
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function reset() {
    setWhatsappChannelId("");
    setPhone("");
    setName("");
    setEmail("");
    setError(null);
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setSaving(true);
    try {
      await api.post("/api/targets", {
        whatsappChannelId,
        phone,
        name: name || undefined,
        email: email || undefined,
      });
      setOpen(false);
      reset();
      onCreated();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Não foi possível criar o contato.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        setOpen(v);
        if (!v) reset();
      }}
    >
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Novo contato</DialogTitle>
          <DialogDescription>Cadastra um contato manualmente em um WhatsApp Channel.</DialogDescription>
        </DialogHeader>
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="contact-channel">Canal</Label>
            <Select value={whatsappChannelId} onValueChange={setWhatsappChannelId}>
              <SelectTrigger id="contact-channel" className="w-full">
                <SelectValue placeholder="Selecione um canal" />
              </SelectTrigger>
              <SelectContent>
                {channels?.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.displayNumber}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="contact-phone">Telefone</Label>
            <Input
              id="contact-phone"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="5511999999999"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="contact-name">Nome (opcional)</Label>
            <Input id="contact-name" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="contact-email">Email (opcional)</Label>
            <Input id="contact-email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          {error && <p className="text-destructive text-sm">{error}</p>}
          <Button type="submit" disabled={!whatsappChannelId || phone.trim().length < 8 || saving}>
            {saving ? "Criando…" : "Criar contato"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
