import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

// object E array (ex: recomendações da IA, listas de imóveis vistos etc.)
// precisam da mesma renderização recursiva em accordion — só string/number/
// etc. são "folha".
function isExpandable(value: unknown): boolean {
  return isPlainObject(value) || Array.isArray(value);
}

/// Uma linha key:value — se o valor for expansível (object/array) vira um
/// AccordionItem com a lista recursiva dentro; senão vira título (chave) e
/// valor embaixo. Mesmo padrão visual do Desk-Console.
function MetadataEntry({ label, value }: { label: string; value: unknown }) {
  if (isExpandable(value)) {
    return (
      <Accordion type="single" collapsible>
        <AccordionItem value="entry" className="group border-border bg-card rounded-lg border">
          <AccordionTrigger className="px-3 py-2 text-xs font-medium [&_svg]:size-3.5">{label}</AccordionTrigger>
          <AccordionContent className="border-border border-t px-3 pt-2">
            <MetadataValue value={value} />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    );
  }

  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-muted-foreground text-xs">{label}</span>
      <span className="truncate text-sm font-medium">{String(value)}</span>
    </div>
  );
}

/// Conteúdo de dentro de um accordion: object vira lista de key:value pelas
/// próprias keys; array vira lista de key:value indexada (#0, #1, ...). Cada
/// item que também for expansível volta a virar accordion (recursivo).
function MetadataValue({ value }: { value: unknown }) {
  if (Array.isArray(value)) {
    if (value.length === 0) return <span className="text-muted-foreground text-xs italic">lista vazia</span>;
    return (
      <div className="flex flex-col gap-2">
        {value.map((item, index) => (
          <MetadataEntry key={index} label={`#${index}`} value={item} />
        ))}
      </div>
    );
  }

  if (isPlainObject(value)) {
    const entries = Object.entries(value);
    if (entries.length === 0) return <span className="text-muted-foreground text-xs italic">vazio</span>;
    return (
      <div className="flex flex-col gap-2">
        {entries.map(([key, nested]) => (
          <MetadataEntry key={key} label={key} value={nested} />
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-0.5">
      <span className="truncate text-sm font-medium">{String(value)}</span>
    </div>
  );
}

interface MetadataViewProps {
  metadata: Record<string, unknown> | null;
}

/// Visualização só-leitura dos metadados do contato (sem edição — essa tela
/// do Agent-Console não expõe alterar metadado, só consultar).
export function MetadataView({ metadata }: MetadataViewProps) {
  const entries = Object.entries(metadata ?? {});

  if (entries.length === 0) {
    return <p className="text-muted-foreground text-sm">Nenhum metadado registrado ainda.</p>;
  }

  return (
    <div className="flex flex-col gap-3">
      {entries.map(([key, value], index) => (
        <div key={key} className={index < entries.length - 1 ? "border-border/60 border-b pb-3" : ""}>
          <MetadataEntry label={key} value={value} />
        </div>
      ))}
    </div>
  );
}
