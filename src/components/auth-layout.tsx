import type { ReactNode } from "react";
import logoInicial from "@/assets/Logo inicial.png";

/// Split-screen: capa (Logo inicial.png, transparente) sobre fundo roxo
/// degradê à esquerda; o card de entrar/cadastrar (children) centralizado
/// à direita. Em telas pequenas a capa some e sobra só o card.
export function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <div className="from-primary via-primary to-primary/80 relative hidden items-center justify-center bg-gradient-to-br lg:flex lg:w-1/2">
        <img src={logoInicial} alt="Fluxy Agents" className="max-h-[85vh] w-full max-w-lg object-contain p-8" />
      </div>

      <div className="bg-dot-grid flex flex-1 items-center justify-center p-4">{children}</div>
    </div>
  );
}
