import { Link } from "react-router-dom";
import fluxyIcon from "@/assets/IconeAzulSemFundo.png";
import fluxyIconWhite from "@/assets/IconeBrancoSemFundo.png";
import { cn } from "@/lib/utils";

export function SiteHeader({ transparent = false }: { transparent?: boolean }) {
  const linkClass = cn(
    "transition-colors",
    transparent ? "text-white hover:text-white/70" : "text-black hover:text-black/70",
  );

  const navLinks = (
    <>
      <a href="/#top" className={linkClass}>
        Início
      </a>
      <a href="/#cases" className={linkClass}>
        Cases
      </a>
      <a href="/#contato" className={linkClass}>
        Contato
      </a>
      <Link to="/signin" className={linkClass}>
        Portal
      </Link>
    </>
  );

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-colors",
        transparent ? "bg-transparent" : "border-b bg-background/95 backdrop-blur",
      )}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 py-4">
        <a href="/#top" className="flex items-center gap-2">
          <img src={transparent ? fluxyIconWhite : fluxyIcon} alt="Sturnus Flow" className="h-8 w-8 object-contain" />
        </a>
        <nav className="hidden items-center gap-8 text-base font-medium sm:flex">{navLinks}</nav>
      </div>
      <nav
        className={cn(
          "flex items-center justify-center gap-6 px-6 py-2.5 text-base font-medium sm:hidden",
          !transparent && "border-t",
        )}
      >
        {navLinks}
      </nav>
    </header>
  );
}
