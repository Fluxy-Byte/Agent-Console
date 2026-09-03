import { AccordionItem } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";

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
/// AccordionItem com a lista recursiva dentro; senão o valor vai num Badge.
/// Mesmo padrão visual do Desk-Console (badge roxo pra key, branco pra value).
function MetadataEntry({ label, value }: { label: string; value: unknown }) {
  if (isExpandable(value)) {
    return (
      <AccordionItem title={label}>
        <MetadataValue value={value} />
      </AccordionItem>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Badge variant="default" className="bg-primary/10 text-primary h-8 shrink-0">
        {label}
      </Badge>
      <Badge
        variant="outline"
        className="h-8 min-w-0 max-w-full justify-start truncate border-neutral-200 bg-white text-neutral-900"
      >
        {String(value)}
      </Badge>
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
      <div className="flex flex-col gap-1.5">
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
      <div className="flex flex-col gap-1.5">
        {entries.map(([key, nested]) => (
          <MetadataEntry key={key} label={key} value={nested} />
        ))}
      </div>
    );
  }

  return (
    <Badge variant="outline" className="h-8 max-w-full truncate border-neutral-200 bg-white text-neutral-900">
      {String(value)}
    </Badge>
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
    <div className="flex flex-col gap-2">
      {entries.map(([key, value]) => (
        <MetadataEntry key={key} label={key} value={value} />
      ))}
    </div>
  );
}
