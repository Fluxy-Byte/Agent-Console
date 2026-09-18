import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import fluxyIcon from "@/assets/IconeAzulSemFundo.png";
import fluxyIconWhite from "@/assets/IconeBrancoSemFundo.png";
import { cn } from "@/lib/utils";

export function SiteHeader({ transparent = false }: { transparent?: boolean }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  // Com o menu mobile aberto, o painel do dropdown precisa de um fundo sólido
  // pra ser legível por cima do hero — então o header some do modo
  // transparente enquanto ele estiver aberto, mesmo que "transparent" siga
  // true (usuário ainda no topo da página).
  const solid = !transparent || mobileOpen;

  const linkClass = cn("transition-colors", solid ? "text-black hover:text-black/70" : "text-white hover:text-white/70");
  const mobileLinkClass = "text-foreground hover:text-foreground/70 py-2 transition-colors";

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

  const mobileNavLinks = (
    <>
      <a href="/#top" className={mobileLinkClass} onClick={() => setMobileOpen(false)}>
        Início
      </a>
      <a href="/#cases" className={mobileLinkClass} onClick={() => setMobileOpen(false)}>
        Cases
      </a>
      <a href="/#contato" className={mobileLinkClass} onClick={() => setMobileOpen(false)}>
        Contato
      </a>
      <Link to="/signin" className={mobileLinkClass} onClick={() => setMobileOpen(false)}>
        Portal
      </Link>
    </>
  );

  return (
    <header
      className={cn("fixed inset-x-0 top-0 z-50 transition-colors", solid ? "border-b bg-background/95 backdrop-blur" : "bg-transparent")}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4">
        <a href="/#top" className="flex items-center gap-2">
          <img src={solid ? fluxyIcon : fluxyIconWhite} alt="Sturnus Flow" className="h-8 w-8 object-contain" />
        </a>
        <nav className="hidden items-center gap-8 text-base font-medium sm:flex">{navLinks}</nav>
        <button
          type="button"
          onClick={() => setMobileOpen((open) => !open)}
          aria-label={mobileOpen ? "Fechar menu" : "Abrir menu"}
          aria-expanded={mobileOpen}
          className={cn("sm:hidden", solid ? "text-black" : "text-white")}
        >
          {mobileOpen ? <X className="size-6" /> : <Menu className="size-6" />}
        </button>
      </div>
      {mobileOpen && (
        <nav className="border-border flex flex-col items-center gap-1 border-t px-4 py-4 text-base font-medium sm:hidden">
          {mobileNavLinks}
        </nav>
      )}
    </header>
  );
}
