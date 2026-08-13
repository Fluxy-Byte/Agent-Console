import { useState } from "react";
import useSWR from "swr";
import { toast } from "sonner";
import { Pencil, Plus, Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { PaginationControls } from "@/components/pagination-controls";
import { api, ApiError } from "@/lib/api";
import type { ServiceIsland, TicketCloseTagListResult } from "@/types/domain";
import { TagFormDialog } from "./tag-form-dialog";

interface GeneralSettingsTabProps {
  island: ServiceIsland;
  canWrite: boolean;
  canManageTags: boolean;
  onSaved: () => void;
}

export function GeneralSettingsTab({ island, canWrite, canManageTags, onSaved }: GeneralSettingsTabProps) {
  const [savingSwitch, setSavingSwitch] = useState<"requireCloseTag" | "allowActiveDispatch" | null>(null);
  const [deletingTagId, setDeletingTagId] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const { data: tags, mutate: mutateTags } = useSWR<TicketCloseTagListResult>(
    `/api/service-islands/${island.id}/tags?page=${page}&pageSize=${pageSize}`,
  );

  async function handleToggle(field: "requireCloseTag" | "allowActiveDispatch", value: boolean) {
    setSavingSwitch(field);
    try {
      await api.put(`/api/service-islands/${island.id}`, { name: island.name, [field]: value });
      onSaved();
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Não foi possível salvar.");
    } finally {
      setSavingSwitch(null);
    }
  }

  async function handleDeleteTag(tagId: string) {
    setDeletingTagId(tagId);
    try {
      await api.delete(`/api/service-islands/${island.id}/tags/${tagId}`);
      await mutateTags();
      toast.success("Tag excluída.");
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Não foi possível excluir a tag.");
    } finally {
      setDeletingTagId(null);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Configurações Gerais</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Exigir tag ao encerrar</Label>
              <p className="text-muted-foreground text-xs">
                Atendentes não conseguem encerrar um ticket de nenhuma fila desta ilha sem escolher uma tag.
              </p>
            </div>
            <Switch
              checked={island.requireCloseTag}
              disabled={!canWrite || savingSwitch !== null}
              onCheckedChange={(v) => handleToggle("requireCloseTag", v)}
            />
          </div>
          <div className="flex items-center justify-between border-t pt-4">
            <div>
              <Label>Permitir disparo ativo pelo Desk</Label>
              <p className="text-muted-foreground text-xs">
                Atendentes de qualquer fila desta ilha podem disparar campanha ativa direto pelo Fluxy Desk.
              </p>
            </div>
            <Switch
              checked={island.allowActiveDispatch}
              disabled={!canWrite || savingSwitch !== null}
              onCheckedChange={(v) => handleToggle("allowActiveDispatch", v)}
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex items-center justify-between">
        <h2 className="font-[family-name:var(--font-display)] text-lg font-semibold">Tags de fechamento</h2>
        {canManageTags && (
          <TagFormDialog
            serviceIslandId={island.id}
            onSaved={() => mutateTags()}
            trigger={
              <Button size="sm">
                <Plus className="size-4" /> Nova tag
              </Button>
            }
          />
        )}
      </div>

      <Card className="overflow-hidden p-0">
        <CardContent className="flex flex-col gap-2 p-4">
          {tags?.items.map((tag) => (
            <div key={tag.id} className="flex items-center justify-between gap-2 rounded-md border px-3 py-2">
              <p className="text-sm font-medium">{tag.name}</p>
              {canManageTags && (
                <div className="flex items-center gap-2">
                  <TagFormDialog
                    serviceIslandId={island.id}
                    tag={tag}
                    onSaved={() => mutateTags()}
                    trigger={
                      <Button size="sm" variant="outline">
                        <Pencil className="size-4" /> Editar
                      </Button>
                    }
                  />
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button size="sm" variant="destructive" disabled={deletingTagId === tag.id}>
                        <Trash2 className="size-4" /> Excluir
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Excluir tag "{tag.name}"?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Tickets já encerrados com essa tag mantêm o histórico, mas ela deixa de aparecer como opção
                          para novos encerramentos. Esta ação não pode ser desfeita.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction variant="destructive" onClick={() => handleDeleteTag(tag.id)}>
                          Excluir
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              )}
            </div>
          ))}
          {tags && tags.items.length === 0 && (
            <p className="text-muted-foreground text-sm">Nenhuma tag de fechamento cadastrada nesta ilha ainda.</p>
          )}
        </CardContent>
        {tags && tags.total > 0 && (
          <PaginationControls
            page={page}
            pageSize={pageSize}
            total={tags.total}
            onPageChange={setPage}
            onPageSizeChange={(size) => {
              setPageSize(size);
              setPage(1);
            }}
          />
        )}
      </Card>
    </div>
  );
}
