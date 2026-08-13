import type { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface MetricCardProps {
  icon: LucideIcon;
  iconClassName?: string;
  label: string;
  value: string | number;
  sublabel: string;
}

/// 1 card da fileira de métricas no topo das telas de Campanhas/Contatos —
/// ícone colorido + label, número grande, sublabel pequeno. Reusado pelas
/// duas telas (5 cards cada).
export function MetricCard({ icon: Icon, iconClassName, label, value, sublabel }: MetricCardProps) {
  return (
    <Card className="p-4">
      <div className="flex items-center gap-3">
        <div className={cn("flex size-10 shrink-0 items-center justify-center rounded-lg", iconClassName)}>
          <Icon className="size-5" />
        </div>
        <span className="text-muted-foreground text-sm">{label}</span>
      </div>
      <p className="mt-3 text-2xl font-semibold">{value}</p>
      <p className="text-muted-foreground text-xs">{sublabel}</p>
    </Card>
  );
}
