import { useState } from "react";
import { Plus, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";

const ACCEPTED_EXTENSIONS = ".pdf,.txt,.docx";

export interface RagUploadBatch {
  files: File[];
  chunkSize: number;
  categories: string[];
}

/// Modal de anexo de documentos pra base de conhecimento (RAG) — só coleta
/// arquivos + tamanho de chunk + categorias e devolve pro chamador via
/// onSubmit; quem realmente faz o upload (presign + PUT + criar RagDocument)
/// é a página do agente, porque isso muda dependendo se o agente já existe ou
/// ainda está sendo criado.
export function RagDocumentsDialog({
  defaultChunkSize,
  submitting,
  onSubmit,
  trigger,
}: {
  defaultChunkSize: number;
  submitting: boolean;
  onSubmit: (batch: RagUploadBatch) => void;
  trigger: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [chunkSize, setChunkSize] = useState(defaultChunkSize);
  const [categories, setCategories] = useState<string[]>([]);

  function reset() {
    setFiles([]);
    setChunkSize(defaultChunkSize);
    setCategories([]);
  }

  function handleFilesSelected(fileList: FileList | null) {
    if (!fileList) return;
    setFiles((prev) => [...prev, ...Array.from(fileList)]);
  }

  function removeFile(index: number) {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  }

  function addCategory() {
    setCategories((prev) => [...prev, ""]);
  }

  function updateCategory(index: number, value: string) {
    setCategories((prev) => prev.map((c, i) => (i === index ? value : c)));
  }

  function removeCategory(index: number) {
    setCategories((prev) => prev.filter((_, i) => i !== index));
  }

  function handleSubmit() {
    const cleanCategories = categories.map((c) => c.trim()).filter(Boolean);
    onSubmit({ files, chunkSize, categories: cleanCategories });
    reset();
    setOpen(false);
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
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Anexar documentos</DialogTitle>
          <DialogDescription>
            Envie PDF, TXT ou DOCX — o conteúdo é quebrado em pedaços (chunks) e indexado pra o agente consultar
            nas respostas.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="rag-files">Arquivos</Label>
            <Input
              id="rag-files"
              type="file"
              multiple
              accept={ACCEPTED_EXTENSIONS}
              onChange={(e) => handleFilesSelected(e.target.files)}
            />
            {files.length > 0 && (
              <ul className="mt-1 flex flex-col gap-1">
                {files.map((file, index) => (
                  <li
                    key={`${file.name}-${index}`}
                    className="border-border flex items-center justify-between gap-2 rounded-md border px-2 py-1 text-sm"
                  >
                    <span className="truncate">{file.name}</span>
                    <button
                      type="button"
                      onClick={() => removeFile(index)}
                      className="text-muted-foreground hover:text-destructive shrink-0"
                      aria-label={`Remover ${file.name}`}
                    >
                      <X className="size-4" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <Label>Tamanho do chunk</Label>
              <span className="text-muted-foreground text-xs">{chunkSize} caracteres</span>
            </div>
            <Slider
              min={200}
              max={2000}
              step={50}
              value={[chunkSize]}
              onValueChange={([v]) => setChunkSize(v)}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <Label>Categorias</Label>
              <Button type="button" variant="outline" size="sm" className="gap-1.5" onClick={addCategory}>
                <Plus className="size-3.5" /> Adicionar categoria
              </Button>
            </div>
            {categories.map((category, index) => (
              <div key={index} className="flex items-center gap-2">
                <Input
                  value={category}
                  placeholder="Ex: políticas de troca"
                  onChange={(e) => updateCategory(index, e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => removeCategory(index)}
                  className="text-muted-foreground hover:text-destructive shrink-0"
                  aria-label="Remover categoria"
                >
                  <X className="size-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        <DialogFooter>
          <Button type="button" disabled={files.length === 0 || submitting} onClick={handleSubmit} className="gap-2">
            <Upload className="size-4" />
            {submitting ? "Enviando..." : "Anexar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
