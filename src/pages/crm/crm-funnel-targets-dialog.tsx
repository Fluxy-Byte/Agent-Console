import useSWR from "swr";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { CrmFunnelField, CrmFunnelFieldTargets } from "@/types/domain";

interface CrmFunnelTargetsDialogProps {
  field: CrmFunnelField | null;
  onOpenChange: (open: boolean) => void;
}

/// Contatos que converteram numa etapa do funil, com o valor encontrado no
/// metadata de cada um.
export function CrmFunnelTargetsDialog({ field, onOpenChange }: CrmFunnelTargetsDialogProps) {
  const { data, isLoading } = useSWR<CrmFunnelFieldTargets>(
    field ? `/api/crm/funnel/fields/${field.id}/targets` : null,
  );

  return (
    <Dialog open={Boolean(field)} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="font-mono text-base">{field?.name}</DialogTitle>
          <DialogDescription>
            {field?.useValue ? `Contatos com o valor "${field.value}" neste campo.` : "Contatos com este campo preenchido."}
          </DialogDescription>
        </DialogHeader>

        {isLoading || !data ? (
          <p className="text-muted-foreground text-sm">Carregando…</p>
        ) : data.items.length === 0 ? (
          <p className="text-muted-foreground text-sm">Nenhum contato converteu nesta etapa ainda.</p>
        ) : (
          <div className="flex max-h-[60vh] flex-col gap-2 overflow-y-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Contato</TableHead>
                  <TableHead>Telefone</TableHead>
                  <TableHead>Valor</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.items.map((target) => (
                  <TableRow key={target.id}>
                    <TableCell>
                      <Link to={`/targets/${target.id}`} className="font-medium hover:underline">
                        {target.name || target.waId || "Contato sem nome"}
                      </Link>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{target.waId ?? "—"}</TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="max-w-48 truncate">
                        {target.metadataValue}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {data.total > data.items.length && (
              <p className="text-muted-foreground text-xs">
                Mostrando os {data.items.length} mais recentes de {data.total} contatos.
              </p>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
