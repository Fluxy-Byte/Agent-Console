import { type FormEvent, useEffect, useState } from "react";
import useSWR from "swr";
import { toast } from "sonner";
import { Headset, Pencil, Plus, Save, Settings, Tag, Trash2, Zap } from "lucide-react";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { PaginationControls } from "@/components/pagination-controls";
import { api, ApiError } from "@/lib/api";
import type { PreConfiguredMessageListResult, ServiceIsland, TicketCloseTagListResult } from "@/types/domain";
import { PreConfiguredMessageFormDialog } from "./pre-configured-message-form-dialog";
import { TagFormDialog } from "./tag-form-dialog";

interface GeneralSettingsTabProps {
  island: ServiceIsland;
  canWrite: boolean;
  canManageTags: boolean;
  onSaved: () => void;
}

export function GeneralSettingsTab({ island, canWrite, canManageTags, onSaved }: GeneralSettingsTabProps) {
  const [name, setName] = useState(island.name);
  const [savingName, setSavingName] = useState(false);
  const [nameError, setNameError] = useState<string | null>(null);
  const [savingSwitch, setSavingSwitch] = useState<"requireCloseTag" | "allowActiveDispatch" | null>(null);
  const [deletingTagId, setDeletingTagId] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [deletingMessageId, setDeletingMessageId] = useState<string | null>(null);
  const [messagePage, setMessagePage] = useState(1);
  const [messagePageSize, setMessagePageSize] = useState(10);

  useEffect(() => {
    setName(island.name);
  }, [island.name]);

  const { data: tags, mutate: mutateTags } = useSWR<TicketCloseTagListResult>(
    `/api/service-islands/${island.id}/tags?page=${page}&pageSize=${pageSize}`,
  );

  const { data: messages, mutate: mutateMessages } = useSWR<PreConfiguredMessageListResult>(
    `/api/service-islands/${island.id}/pre-configured-messages?page=${messagePage}&pageSize=${messagePageSize}`,
  );

  const queues = island.queues ?? [];

  async function handleRename(event: FormEvent) {
    event.preventDefault();
    setNameError(null);
    setSavingName(true);
    try {
      await api.put(`/api/service-islands/${island.id}`, { name, requireCloseTag: island.requireCloseTag });
      onSaved();
      toast.success("Ilha atualizada.");
    } catch (err) {
      setNameError(err instanceof ApiError ? err.message : "Não foi possível salvar.");
    } finally {
      setSavingName(false);
    }
  }

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

  async function handleDeleteMessage(messageId: string) {
    setDeletingMessageId(messageId);
    try {
      await api.delete(`/api/service-islands/${island.id}/pre-configured-messages/${messageId}`);
      await mutateMessages();
      toast.success("Mensagem excluída.");
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Não foi possível excluir a mensagem.");
    } finally {
      setDeletingMessageId(null);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <div className="flex items-start gap-3">
            <div className="bg-primary/15 text-primary flex size-10 shrink-0 items-center justify-center rounded-lg">
              <Headset className="size-5" />
            </div>
            <div>
              <CardTitle>Ilha de atendimento</CardTitle>
              <p className="text-muted-foreground mt-1 text-sm">Nome exibido para esta ilha de atendimento.</p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleRename} className="flex items-end gap-3">
            <div className="flex flex-1 flex-col gap-1.5">
              <Label htmlFor="island-name">Nome da ilha</Label>
              <p className="text-muted-foreground text-xs">Pertence ao canal: {island.whatsappChannel?.displayNumber}</p>
              <Input
                id="island-name"
                value={name}
                disabled={!canWrite || savingName}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            {canWrite && (
              <Button type="submit" disabled={savingName}>
                <Save className="size-4" /> {savingName ? "Salvando…" : "Salvar"}
              </Button>
            )}
          </form>

          {nameError && <p className="text-destructive mt-2 text-sm">{nameError}</p>}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-start gap-3">
            <div className="bg-primary/15 text-primary flex size-10 shrink-0 items-center justify-center rounded-lg">
              <Settings className="size-5" />
            </div>
            <div>
              <CardTitle>Configurações Gerais</CardTitle>
              <p className="text-muted-foreground mt-1 text-sm">
                Regras de encerramento de ticket e disparo ativo válidas para toda a ilha.
              </p>
            </div>
          </div>
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
              className="data-[state=checked]:bg-success"
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
              className="data-[state=checked]:bg-success"
            />
          </div>
        </CardContent>
      </Card>

      <Card className="overflow-hidden p-0">
        <CardHeader className="flex-row items-start justify-between space-y-0">
          <div className="flex items-start gap-3">
            <div className="bg-primary/15 text-primary flex size-10 shrink-0 items-center justify-center rounded-lg">
              <Tag className="size-5" />
            </div>
            <div>
              <CardTitle>Tags de fechamento</CardTitle>
              <p className="text-muted-foreground mt-1 text-sm">
                Motivos de encerramento disponíveis para os atendentes desta ilha.
              </p>
            </div>
          </div>
          {canManageTags && (
            <TagFormDialog
              serviceIslandId={island.id}
              onSaved={() => mutateTags()}
              trigger={
                <Button>
                  <Plus className="size-4" /> Nova tag
                </Button>
              }
            />
          )}
        </CardHeader>
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
                      <Button variant="outline">
                        <Pencil className="size-4" /> Editar
                      </Button>
                    }
                  />
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" disabled={deletingTagId === tag.id}>
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

      <Card className="overflow-hidden p-0">
        <CardHeader className="flex-row items-start justify-between space-y-0">
          <div className="flex items-start gap-3">
            <div className="bg-primary/15 text-primary flex size-10 shrink-0 items-center justify-center rounded-lg">
              <Zap className="size-5" />
            </div>
            <div>
              <CardTitle>Mensagens pré-configuradas</CardTitle>
              <p className="text-muted-foreground mt-1 text-sm">
                Mensagens prontas que os atendentes podem usar ao responder um ticket, vinculadas às filas escolhidas.
              </p>
            </div>
          </div>
          {canManageTags && (
            <PreConfiguredMessageFormDialog
              serviceIslandId={island.id}
              queues={queues}
              onSaved={() => mutateMessages()}
              trigger={
                <Button>
                  <Plus className="size-4" /> Nova mensagem
                </Button>
              }
            />
          )}
        </CardHeader>
        <CardContent className="flex flex-col gap-2 p-4">
          {messages?.items.map((message) => (
            <div key={message.id} className="flex items-center justify-between gap-2 rounded-md border px-3 py-2">
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">{message.name}</p>
                <p className="text-muted-foreground truncate text-xs">
                  {message.queues.length === queues.length && queues.length > 0
                    ? "Todas as filas"
                    : message.queues.map((q) => q.name).join(", ") || "Nenhuma fila"}
                </p>
              </div>
              {canManageTags && (
                <div className="flex shrink-0 items-center gap-2">
                  <PreConfiguredMessageFormDialog
                    serviceIslandId={island.id}
                    queues={queues}
                    message={message}
                    onSaved={() => mutateMessages()}
                    trigger={
                      <Button variant="outline">
                        <Pencil className="size-4" /> Editar
                      </Button>
                    }
                  />
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" disabled={deletingMessageId === message.id}>
                        <Trash2 className="size-4" /> Excluir
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Excluir mensagem "{message.name}"?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Os atendentes deixam de ver essa mensagem como atalho nas filas vinculadas. Esta ação não
                          pode ser desfeita.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction variant="destructive" onClick={() => handleDeleteMessage(message.id)}>
                          Excluir
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              )}
            </div>
          ))}
          {messages && messages.items.length === 0 && (
            <p className="text-muted-foreground text-sm">Nenhuma mensagem pré-configurada cadastrada nesta ilha ainda.</p>
          )}
        </CardContent>
        {messages && messages.total > 0 && (
          <PaginationControls
            page={messagePage}
            pageSize={messagePageSize}
            total={messages.total}
            onPageChange={setMessagePage}
            onPageSizeChange={(size) => {
              setMessagePageSize(size);
              setMessagePage(1);
            }}
          />
        )}
      </Card>
    </div>
  );
}
