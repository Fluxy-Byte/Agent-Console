import { type FormEvent, useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api, ApiError } from "@/lib/api";
import type { ServiceIsland } from "@/types/domain";

interface IslandTabProps {
  island: ServiceIsland;
  canWrite: boolean;
  onSaved: () => void;
}

export function IslandTab({ island, canWrite, onSaved }: IslandTabProps) {
  const [name, setName] = useState(island.name);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setName(island.name);
  }, [island.name]);

  async function handleRename(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setSaving(true);
    try {
      await api.put(`/api/service-islands/${island.id}`, { name, requireCloseTag: island.requireCloseTag });
      onSaved();
      toast.success("Ilha atualizada.");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Não foi possível salvar.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Ilha de atendimento</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleRename} className="flex items-end gap-3">
          <div className="flex flex-1 flex-col gap-1.5">
            <Label htmlFor="island-name">Nome</Label>
            <Input
              id="island-name"
              value={name}
              disabled={!canWrite || saving}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          {canWrite && (
            <Button type="submit" disabled={saving}>
              {saving ? "Salvando…" : "Salvar"}
            </Button>
          )}
        </form>

        {error && <p className="text-destructive mt-2 text-sm">{error}</p>}
        <p className="text-muted-foreground mt-3 text-xs">Canal: {island.whatsappChannel?.displayNumber}</p>
      </CardContent>
    </Card>
  );
}
