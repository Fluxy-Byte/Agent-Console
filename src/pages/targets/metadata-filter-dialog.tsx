import { useState } from "react";
import useSWR from "swr";
import { Tags } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface MetadataFilterDialogProps {
  selectedKeys: string[];
  onChange: (keys: string[]) => void;
}

/// Filtro "Metadados" da tela de Contatos — lista todas as chaves de
/// Target.metadata já usadas por algum contato da empresa e deixa marcar
/// quais precisam estar presentes. Contato só entra no resultado se tiver
/// TODAS as chaves marcadas (E, não OU) — ver Agent-Api
/// target-service.ts#findIdsWithAllMetadataKeys.
export function MetadataFilterDialog({ selectedKeys, onChange }: MetadataFilterDialogProps) {
  const [open, setOpen] = useState(false);
  const { data: keys } = useSWR<string[]>(open ? "/api/targets/metadata-keys" : null);

  function toggle(key: string, checked: boolean) {
    onChange(checked ? [...selectedKeys, key] : selectedKeys.filter((k) => k !== key));
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full justify-start font-normal">
          <Tags className="size-4" />
          {selectedKeys.length === 0 ? "Todos os metadados" : `${selectedKeys.length} metadado(s) selecionado(s)`}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Filtrar por metadados</DialogTitle>
          <DialogDescription>
            Mostra só contatos que têm TODAS as chaves marcadas abaixo preenchidas no metadata.
          </DialogDescription>
        </DialogHeader>

        <div className="flex max-h-80 flex-col gap-2 overflow-y-auto">
          {keys?.map((key) => {
            const checked = selectedKeys.includes(key);
            return (
              <label
                key={key}
                className="border-border flex cursor-pointer items-center justify-between gap-3 rounded-lg border p-3"
              >
                <p className="truncate text-sm font-medium">{key}</p>
                <Checkbox
                  checked={checked}
                  onCheckedChange={(v) => toggle(key, v === true)}
                  aria-label={`Filtrar por ${key}`}
                />
              </label>
            );
          })}
          {keys && keys.length === 0 && (
            <p className="text-muted-foreground py-2 text-center text-sm">Nenhum metadado cadastrado ainda.</p>
          )}
        </div>

        <DialogFooter>
          {selectedKeys.length > 0 && (
            <Button type="button" variant="outline" onClick={() => onChange([])}>
              Limpar seleção
            </Button>
          )}
          <Button type="button" onClick={() => setOpen(false)}>
            Concluído
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
