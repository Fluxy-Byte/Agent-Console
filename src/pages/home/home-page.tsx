import { Link } from "react-router-dom";
import {
  ArrowRight,
  BarChart3,
  Bot,
  BrainCircuit,
  Building2,
  CheckCircle2,
  Clock,
  Contact,
  FileSpreadsheet,
  Headset,
  Megaphone,
  MessageCircle,
  MessageSquareText,
  Network,
  PhoneCall,
  Plug,
  Sparkles,
  Waypoints,
  Webhook,
} from "lucide-react";
import fluxyLogo from "@/assets/Logo.png";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const PHONE_DISPLAY = "+55 34 9174-6481";
const PHONE_TEL = "+553491746481";
const PHONE_WHATSAPP = "https://wa.me/553491746481";

interface ModuleCard {
  icon: typeof Bot;
  title: string;
  description: string;
  to?: string;
  ctaLabel?: string;
  badge?: string;
}

const MODULES: ModuleCard[] = [
  {
    icon: Bot,
    title: "Agentes de IA",
    description:
      "Crie agentes com personalidade própria para atender no WhatsApp: mensagens de boas-vindas, transbordo, fora de horário e encerramento, tudo configurável.",
    to: "/agents",
    ctaLabel: "Ver agentes",
  },
  {
    icon: Contact,
    title: "Contatos",
    description: "Centralize e organize a base de contatos da sua empresa para segmentar campanhas e atendimentos.",
    to: "/targets",
    ctaLabel: "Ver contatos",
  },
  {
    icon: Megaphone,
    title: "Campanhas",
    description: "Dispare campanhas em massa pelo WhatsApp e acompanhe o desempenho de cada envio.",
    to: "/campaigns",
    ctaLabel: "Ver campanhas",
  },
  {
    icon: MessageSquareText,
    title: "WhatsApp Channel",
    description: "Conecte e gerencie seus canais oficiais de WhatsApp, com dashboards de conversas e volume de mensagens.",
    to: "/wc",
    ctaLabel: "Ver canais",
  },
  {
    icon: Waypoints,
    title: "Ilhas de Atendimento",
    description: "Organize filas de atendimento humano, monitore em tempo real e consulte o histórico completo de conversas.",
    to: "/service-island",
    ctaLabel: "Ver ilhas",
  },
  {
    icon: Headset,
    title: "Fluxy Desk",
    description:
      "A central de atendimento da Fluxy: tickets, despacho ativo e histórico de conversas em um só lugar para sua equipe de suporte.",
    badge: "Produto complementar",
  },
];

const AI_TECHNOLOGIES = [
  {
    icon: BrainCircuit,
    title: "IA generativa conversacional",
    description: "Agentes que entendem contexto e respondem de forma natural, com a personalidade que você definir.",
  },
  {
    icon: Sparkles,
    title: "RAG — Base de conhecimento",
    description: "O agente consulta os documentos que você anexa para responder com precisão sobre o seu negócio.",
  },
  {
    icon: Waypoints,
    title: "Transbordo inteligente",
    description: "Quando a IA não resolve, o atendimento é encaminhado automaticamente para a fila humana certa.",
  },
  {
    icon: BarChart3,
    title: "Monitoramento em tempo real",
    description: "Dashboards e métricas para acompanhar o desempenho dos agentes e das campanhas.",
  },
];

const INTEGRATIONS = [
  { icon: Webhook, text: "API REST e Webhooks para conectar seus sistemas em tempo real" },
  { icon: FileSpreadsheet, text: "Importação e exportação de contatos via CSV" },
  { icon: Network, text: "Integração com CRMs, ERPs e plataformas de e-commerce" },
  { icon: Plug, text: "Conexão direta com o WhatsApp Business Platform (WABA)" },
];

export function HomePage() {
  return (
    <div className="bg-dot-grid min-h-screen">
      <div className="mx-auto flex max-w-6xl flex-col gap-16 px-6 py-12">
        {/* Hero */}
        <section className="flex flex-col items-center gap-6 text-center">
          <img src={fluxyLogo} alt="Fluxy" className="size-16 rounded-2xl shadow-sm" />
          <div className="flex flex-col gap-3">
            <h1 className="font-[family-name:var(--font-display)] text-3xl font-semibold sm:text-4xl">
              Fluxy Agents
            </h1>
            <p className="text-muted-foreground mx-auto max-w-2xl text-base sm:text-lg">
              A plataforma completa para atender, converter e encantar clientes no WhatsApp com Inteligência
              Artificial — do primeiro contato ao atendimento humano no Fluxy Desk.
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link to="/targets" className={cn(buttonVariants({ size: "lg" }))}>
              Ir para o painel <ArrowRight className="size-4" />
            </Link>
            <a href={PHONE_WHATSAPP} target="_blank" rel="noreferrer" className={cn(buttonVariants({ size: "lg", variant: "outline" }))}>
              <MessageCircle className="size-4" /> Falar com a Fluxy
            </a>
          </div>
        </section>

        {/* Módulos / cada ponta da ferramenta */}
        <section className="flex flex-col gap-6">
          <div className="text-center">
            <h2 className="font-[family-name:var(--font-display)] text-2xl font-semibold">
              Conheça cada ponta da ferramenta
            </h2>
            <p className="text-muted-foreground mt-1 text-sm">
              Um único ecossistema para automatizar, atender e acompanhar toda a jornada do seu cliente.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {MODULES.map((module) => (
              <Card key={module.title} className="flex flex-col">
                <CardHeader className="flex-row items-start gap-3 space-y-0">
                  <div className="bg-primary/10 text-primary flex size-10 shrink-0 items-center justify-center rounded-lg">
                    <module.icon className="size-5" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <CardTitle className="text-base">{module.title}</CardTitle>
                    {module.badge && (
                      <Badge variant="secondary" className="w-fit">
                        {module.badge}
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="flex flex-1 flex-col gap-3">
                  <p className="text-muted-foreground text-sm">{module.description}</p>
                  {module.to && (
                    <Link to={module.to} className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "mt-auto w-fit")}>
                      {module.ctaLabel} <ArrowRight className="size-4" />
                    </Link>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Tecnologias de IA */}
        <section className="flex flex-col gap-6">
          <div className="text-center">
            <h2 className="font-[family-name:var(--font-display)] text-2xl font-semibold">Tecnologias de IA</h2>
            <p className="text-muted-foreground mt-1 text-sm">
              Toda a inteligência artificial da Fluxy trabalhando junto para o seu atendimento.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {AI_TECHNOLOGIES.map((tech) => (
              <Card key={tech.title}>
                <CardContent className="flex items-start gap-3 p-5">
                  <div className="bg-primary/10 text-primary flex size-10 shrink-0 items-center justify-center rounded-lg">
                    <tech.icon className="size-5" />
                  </div>
                  <div>
                    <p className="font-medium">{tech.title}</p>
                    <p className="text-muted-foreground mt-1 text-sm">{tech.description}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Integração + Suporte 24h */}
        <section className="grid gap-4 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="text-primary size-5" /> Fácil integração com terceiros
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              <p className="text-muted-foreground text-sm">
                A Fluxy conversa com as ferramentas que sua empresa já usa, sem dor de cabeça.
              </p>
              <ul className="flex flex-col gap-2">
                {INTEGRATIONS.map((item) => (
                  <li key={item.text} className="flex items-start gap-2 text-sm">
                    <item.icon className="text-primary mt-0.5 size-4 shrink-0" />
                    <span>{item.text}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="text-primary size-5" /> Suporte disponível 24 horas
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              <p className="text-muted-foreground text-sm">
                Nosso time de suporte está de plantão todos os dias, a qualquer hora, para garantir que o seu
                atendimento nunca pare.
              </p>
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle2 className="text-success size-4 shrink-0" />
                <span>Atendimento 24h, todos os dias da semana</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle2 className="text-success size-4 shrink-0" />
                <span>Suporte por ligação e WhatsApp</span>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Contato */}
        <section>
          <Card className="border-primary/30 bg-primary/5">
            <CardContent className="flex flex-col items-center gap-4 p-8 text-center">
              <h2 className="font-[family-name:var(--font-display)] text-2xl font-semibold">Fale com a Fluxy</h2>
              <p className="text-muted-foreground max-w-md text-sm">
                Dúvidas, suporte ou novidades: fale com a gente por ligação ou WhatsApp.
              </p>
              <p className="font-[family-name:var(--font-display)] text-xl font-semibold">{PHONE_DISPLAY}</p>
              <div className="flex flex-wrap items-center justify-center gap-3">
                <a href={`tel:${PHONE_TEL}`} className={cn(buttonVariants({ size: "lg" }))}>
                  <PhoneCall className="size-4" /> Ligar agora
                </a>
                <a href={PHONE_WHATSAPP} target="_blank" rel="noreferrer" className={cn(buttonVariants({ size: "lg", variant: "outline" }))}>
                  <MessageCircle className="size-4" /> Chamar no WhatsApp
                </a>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}
