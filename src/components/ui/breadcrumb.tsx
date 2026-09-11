import { Fragment, type ComponentProps } from "react";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export function Breadcrumb({ className, ...props }: ComponentProps<"nav">) {
  return <nav aria-label="breadcrumb" className={className} {...props} />;
}

export function BreadcrumbList({ className, ...props }: ComponentProps<"ol">) {
  return <ol className={cn("text-muted-foreground flex flex-wrap items-center gap-1.5 text-sm", className)} {...props} />;
}

export function BreadcrumbItem({ className, ...props }: ComponentProps<"li">) {
  return <li className={cn("inline-flex items-center gap-1.5", className)} {...props} />;
}

export function BreadcrumbLink({ className, ...props }: ComponentProps<typeof Link>) {
  return <Link className={cn("hover:text-foreground transition-colors", className)} {...props} />;
}

export function BreadcrumbPage({ className, ...props }: ComponentProps<"span">) {
  return <span aria-current="page" className={cn("text-foreground font-medium", className)} {...props} />;
}

export function BreadcrumbSeparator({ className, ...props }: ComponentProps<"li">) {
  return (
    <li role="presentation" aria-hidden="true" className={cn("[&>svg]:size-3.5", className)} {...props}>
      <ChevronRight />
    </li>
  );
}

export interface BreadcrumbTrailItem {
  label: string;
  to?: string;
}

/// Atalho usado no topo de cada página — evita repetir a composição
/// Breadcrumb/BreadcrumbList/BreadcrumbSeparator em todo lugar.
export function PageBreadcrumb({ items }: { items: BreadcrumbTrailItem[] }) {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        {items.map((item, index) => (
          <Fragment key={`${item.label}-${index}`}>
            {index > 0 && <BreadcrumbSeparator />}
            <BreadcrumbItem>
              {item.to ? <BreadcrumbLink to={item.to}>{item.label}</BreadcrumbLink> : <BreadcrumbPage>{item.label}</BreadcrumbPage>}
            </BreadcrumbItem>
          </Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
