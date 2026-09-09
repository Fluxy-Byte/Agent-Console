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
import fluxyLogoInicial from "@/assets/LogoSemFundo.png";
import heroImage from "@/assets/ApresentacaoInicial.jpg";
import conversaVideo from "@/assets/VideoConversa.mp4";
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
      "Crie agentes com personalidade própria para atender no WhatsApp: mensagens de transbordo, fora de horário e encerramento, tudo configurável.",
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

function HomeHeader() {
  const navLinks = (
    <>
      <a href="#top" className="text-muted-foreground hover:text-foreground transition-colors">
        Início
      </a>
      <a href="#cases" className="text-muted-foreground hover:text-foreground transition-colors">
        Cases
      </a>
      <a href="#contato" className="text-muted-foreground hover:text-foreground transition-colors">
        Contato
      </a>
    </>
  );

  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-4">
        <a href="#top" className="flex items-center gap-2">
          <img src={fluxyLogoInicial} alt="Fluxy" className="h-8 w-auto" />
        </a>
        <nav className="hidden items-center gap-8 text-sm font-medium sm:flex">{navLinks}</nav>
        <Link to="/signin" className={cn(buttonVariants({ variant: "outline", size: "sm" }))}>
          Portal
        </Link>
      </div>
      <nav className="flex items-center justify-center gap-6 border-t px-6 py-2.5 text-sm font-medium sm:hidden">
        {navLinks}
      </nav>
    </header>
  );
}

export function HomePage() {
  return (
    <div className="bg-dot-grid min-h-screen">
      <HomeHeader />

      {/* Hero */}
      <section id="top" className="relative w-full scroll-mt-20">
        <div className="relative h-[520px] w-full overflow-hidden sm:h-[560px] lg:h-[620px]">
          <img src={heroImage} alt="Atendimento Fluxy" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/45 to-black/10" />
          <div className="absolute inset-0 flex items-center">
            <div className="mx-auto flex w-full max-w-6xl flex-col items-start gap-5 px-6">
              <h1 className="font-[family-name:var(--font-display)] max-w-2xl text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
                Conversas que geram grandes resultados para uma empresa.
              </h1>
              <p className="max-w-xl text-base text-white/85 sm:text-lg">
                Inteligência que nunca para de evoluir no mercado.
              </p>
              <a href="#contato" className={cn(buttonVariants({ size: "lg" }))}>
                <MessageCircle className="size-4" /> Falar com especialista
              </a>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto flex max-w-6xl flex-col gap-16 px-6 py-12">
        {/* Da primeira conversa ao aquecimento de leads */}
        <section className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <div className="flex flex-col gap-4">
            <h2 className="font-[family-name:var(--font-display)] text-2xl font-semibold sm:text-3xl">
              Da primeira conversa ao aquecimento de seus leads para gerar grandes resultados.
            </h2>
            <p className="text-muted-foreground text-base sm:text-lg">
              Veja como a Fluxy pode evoluir as conversas da sua empresa podendo aumentar o volume de vendas e
              atendimento da sua empresa.
            </p>
          </div>
          <div className="flex justify-center lg:justify-end">
            <video
              src={conversaVideo}
              autoPlay
              loop
              muted
              playsInline
              className="w-full max-w-md rounded-2xl shadow-lg"
            />
          </div>
        </section>

        {/* Módulos / cada ponta da ferramenta */}
        <section id="cases" className="flex flex-col gap-6 scroll-mt-20">
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
        <section id="contato" className="scroll-mt-20">
          <Card className="border-primary/30 bg-primary/5">
            <CardContent className="flex flex-col items-center gap-4 p-8 text-center">
              <h2 className="font-[family-name:var(--font-display)] text-2xl font-semibold">
                Fale com um de nossos vendedores
              </h2>
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
