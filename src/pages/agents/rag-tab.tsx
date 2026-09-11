import { FileText, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { RagDocumentsDialog, type RagUploadBatch } from "@/components/rag-documents-dialog";
import type { RagDocument } from "@/types/domain";
import type { AgentFormTabProps } from "./agent-form-types";

const RAG_STATUS_BADGE: Record<RagDocument["status"], { label: string; variant: "warning" | "success" | "destructive" }> = {
  PROCESSING: { label: "Processando...", variant: "warning" },
  READY: { label: "Pronto", variant: "success" },
  FAILED: { label: "Falhou", variant: "destructive" },
};

interface RagTabProps extends AgentFormTabProps {
  isNew: boolean;
  uploadingRag: boolean;
  onAttachDocuments: (batch: RagUploadBatch) => void | Promise<void>;
  pendingRagUploads: RagUploadBatch[];
  ragDocuments: RagDocument[] | undefined;
}

export function RagTab({
  form,
  set,
  disabled,
  isNew,
  uploadingRag,
  onAttachDocuments,
  pendingRagUploads,
  ragDocuments,
}: RagTabProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Base de conhecimento (RAG)</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div>
            <Label>Ativar RAG</Label>
            <p className="text-muted-foreground text-xs">
              O agente consulta os documentos anexados abaixo pra responder com base neles.
            </p>
          </div>
          <Switch checked={form.ragEnabled} onCheckedChange={(v) => set("ragEnabled", v)} disabled={disabled} />
        </div>

        {form.ragEnabled && (
          <div className="flex flex-col gap-3">
            <RagDocumentsDialog
              defaultChunkSize={form.ragChunkSize}
              submitting={uploadingRag}
              onSubmit={onAttachDocuments}
              trigger={
                <Button type="button" variant="outline" size="sm" disabled={disabled} className="w-fit gap-2">
                  <Plus className="size-4" /> Anexar documentos
                </Button>
              }
            />

            {isNew && pendingRagUploads.length > 0 && (
              <div className="flex flex-col gap-1.5">
                <p className="text-muted-foreground text-xs">Serão enviados assim que o agente for criado:</p>
                {pendingRagUploads.map((batch, index) => (
                  <div key={index} className="border-border flex items-center gap-2 rounded-md border px-3 py-2 text-sm">
                    <FileText className="text-muted-foreground size-4 shrink-0" />
                    <span className="truncate">{batch.files.map((f) => f.name).join(", ")}</span>
                  </div>
                ))}
              </div>
            )}

            {!isNew && (
              <div className="flex flex-col gap-1.5">
                {!ragDocuments || ragDocuments.length === 0 ? (
                  <p className="text-muted-foreground text-sm">Nenhum documento anexado ainda.</p>
                ) : (
                  ragDocuments.map((doc) => (
                    <div
                      key={doc.id}
                      className="border-border flex items-center justify-between gap-2 rounded-md border px-3 py-2 text-sm"
                    >
                      <div className="flex min-w-0 items-center gap-2">
                        <FileText className="text-muted-foreground size-4 shrink-0" />
                        <div className="min-w-0">
                          <p className="truncate font-medium">{doc.fileName}</p>
                          {doc.categories.length > 0 && (
                            <p className="text-muted-foreground truncate text-xs">{doc.categories.join(", ")}</p>
                          )}
                        </div>
                      </div>
                      <Badge variant={RAG_STATUS_BADGE[doc.status].variant}>{RAG_STATUS_BADGE[doc.status].label}</Badge>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
