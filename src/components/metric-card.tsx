import { ChevronRight, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface MetricCardProps {
  icon: LucideIcon;
  iconClassName?: string;
  label: string;
  value: string | number;
  sublabel: string;
  /// Opcional — quando presente, o card vira um botão (ex: abre um modal com
  /// o detalhamento daquele número).
  onClick?: () => void;
}

/// 1 card da fileira de métricas no topo das telas de Campanhas/Contatos —
/// ícone colorido + label, número grande, sublabel pequeno. Reusado por
/// várias telas. Com `onClick`, vira um botão real (não Card+div) com
/// affordance de clique, pra manter a semântica/acessibilidade certa.
export function MetricCard({ icon: Icon, iconClassName, label, value, sublabel, onClick }: MetricCardProps) {
  const Wrapper = onClick ? "button" : "div";

  return (
    <Wrapper
      type={onClick ? "button" : undefined}
      onClick={onClick}
      className={cn(
        "bg-card text-card-foreground border-border rounded-xl border p-4 text-left shadow-sm",
        onClick &&
          "hover:border-primary/40 hover:bg-accent/40 focus-visible:ring-ring/50 cursor-pointer transition-colors focus-visible:ring-[3px] focus-visible:outline-none",
      )}
    >
      <div className="flex items-center gap-3">
        <div className={cn("flex size-10 shrink-0 items-center justify-center rounded-lg", iconClassName)}>
          <Icon className="size-5" />
        </div>
        <span className="text-muted-foreground text-sm">{label}</span>
        {onClick && <ChevronRight className="text-muted-foreground ml-auto size-4" />}
      </div>
      <p className="mt-3 text-2xl font-semibold">{value}</p>
      <p className="text-muted-foreground text-xs">{sublabel}</p>
    </Wrapper>
  );
}
