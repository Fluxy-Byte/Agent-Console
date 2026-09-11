import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface SortableThProps {
  label: string;
  active: boolean;
  dir: "asc" | "desc";
  onClick: () => void;
}

/// Cabeçalho de coluna clicável com chevron indicando direção — usado nas
/// colunas ordenáveis das tabelas de Campanhas/Contatos.
export function SortableTh({ label, active, dir, onClick }: SortableThProps) {
  return (
    <button type="button" onClick={onClick} className="hover:text-foreground inline-flex items-center gap-1 font-medium">
      {label}
      <ChevronDown className={cn("size-3.5 transition-transform", active ? (dir === "asc" ? "rotate-180" : "") : "opacity-40")} />
    </button>
  );
}
