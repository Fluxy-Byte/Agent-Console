import type { ReactNode } from "react";
import { Bot, MessageSquare, ShieldCheck, Zap } from "lucide-react";
import fluxyLogo from "@/assets/Logo.png";

const FEATURES = [
  { icon: Bot, text: "Agentes de IA que atendem seus clientes 24 horas por dia" },
  { icon: MessageSquare, text: "Direto no WhatsApp, sem app novo pra ninguém aprender" },
  { icon: Zap, text: "Handoff instantâneo pra um atendente humano quando precisar" },
  { icon: ShieldCheck, text: "Conversas e dados isolados por empresa, com controle de acesso" },
];

/// Split-screen: painel de marca degradê roxo à esquerda (headline + destaques
/// do produto) e o card de entrar/cadastrar (children) centralizado à
/// direita. Em telas pequenas o painel de marca some e sobra só o card, com
/// a logo pequena acima dele.
export function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <div className="from-primary via-primary to-primary/70 relative hidden overflow-hidden bg-gradient-to-br lg:flex lg:w-1/2 lg:flex-col lg:justify-between lg:p-12">
        <div className="pointer-events-none absolute -top-24 -left-24 size-96 rounded-full bg-white/10 blur-3xl" />
        <div className="pointer-events-none absolute -right-32 bottom-0 size-[28rem] rounded-full bg-white/10 blur-3xl" />
        <div className="bg-dot-grid pointer-events-none absolute inset-0 opacity-[0.07]" />

        <div className="relative flex items-center gap-2">
          <img src={fluxyLogo} alt="Fluxy" className="size-9 rounded-lg" />
          <span className="font-[family-name:var(--font-display)] text-lg font-semibold text-white">Fluxy Agents</span>
        </div>

        <div className="relative flex flex-col gap-8">
          <h1 className="font-[family-name:var(--font-display)] max-w-md text-4xl leading-tight font-semibold text-white">
            Atendimento no WhatsApp, potencializado por IA.
          </h1>
          <ul className="flex flex-col gap-4">
            {FEATURES.map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-start gap-3">
                <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-white/15 text-white">
                  <Icon className="size-4" />
                </span>
                <span className="mt-1 text-sm text-white/90">{text}</span>
              </li>
            ))}
          </ul>
        </div>

        <p className="relative text-xs text-white/60">© {new Date().getFullYear()} Fluxy Technologies</p>
      </div>

      <div className="bg-dot-grid flex flex-1 flex-col items-center justify-center gap-6 p-4">
        <div className="flex items-center gap-2 lg:hidden">
          <img src={fluxyLogo} alt="Fluxy" className="size-8 rounded-lg" />
          <span className="font-[family-name:var(--font-display)] text-lg font-semibold">Fluxy Agents</span>
        </div>
        {children}
      </div>
    </div>
  );
}
