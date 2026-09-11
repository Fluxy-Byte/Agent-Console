import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  BarChart3,
  Bot,
  BrainCircuit,
  Building2,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
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
  ShieldCheck,
  Sparkles,
  Waypoints,
  Webhook,
} from "lucide-react";
import heroImage from "@/assets/ApresentacaoInicial.jpg";
import conversaImage from "@/assets/Conversa.png";
import metaLogo from "@/assets/LogoMetaOficalSemFundo.png";
import identidadeAgenteImage from "@/assets/IndentidadeAgente.png";
import mensagensAgenteImage from "@/assets/MensagensAgente.png";
import ragAgenteImage from "@/assets/RagAgente.png";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SiteHeader } from "@/components/site-header";
import { cn } from "@/lib/utils";

const PHONE_DISPLAY = "+55 34 9174-6481";
const PHONE_TEL = "+553491746481";
const PHONE_WHATSAPP = "https://wa.me/553491746481";

interface ModuleCarouselSlide {
  image: string;
  title: string;
  description: string;
}

interface ModuleCard {
  icon: typeof Bot;
  title: string;
  description: string;
  to?: string;
  ctaLabel?: string;
  badge?: string;
  carousel?: ModuleCarouselSlide[];
}

const MODULES: ModuleCard[] = [
  {
    icon: Bot,
    title: "Agentes de IA",
    description:
      "Crie agentes com personalidade própria para atender no WhatsApp: mensagens de transbordo, fora de horário e encerramento, tudo configurável.",
    to: "/agents",
    ctaLabel: "Ver agentes",
    carousel: [
      {
        image: identidadeAgenteImage,
        title: "Identidade do agente",
        description:
          "Defina o nome, ative ou desative o agente e escreva a personalidade que guia todas as respostas: tom de voz, regras do que pode ou não falar e o contexto do seu negócio. Tudo isso entra automaticamente no prompt usado pela IA para gerar cada resposta.",
      },
      {
        image: mensagensAgenteImage,
        title: "Mensagens obrigatórias e opcionais",
        description:
          "As mensagens obrigatórias — processando, transbordo para humano, formato não suportado e número bloqueado — garantem que o cliente nunca fique sem retorno. As opcionais, como o aviso de fora do horário de atendimento, você ativa ou desativa quando quiser. Todos os textos são livres para editar.",
      },
      {
        image: ragAgenteImage,
        title: "RAG — Base de conhecimento",
        description:
          "Basta ativar o RAG e anexar os documentos da sua empresa: o agente passa a consultar esse material automaticamente para responder com precisão sobre o seu negócio. Sem código e sem configuração complexa — é só anexar o arquivo e o agente já aprende.",
      },
    ],
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

function ModuleCarousel({ slides }: { slides: ModuleCarouselSlide[] }) {
  const [index, setIndex] = useState(0);
  const slide = slides[index];

  function goTo(next: number) {
    setIndex((next + slides.length) % slides.length);
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="bg-muted relative overflow-hidden border">
        <img src={slide.image} alt={slide.title} className="w-full object-cover" />
        <button
          type="button"
          onClick={() => goTo(index - 1)}
          aria-label="Slide anterior"
          className="absolute top-1/2 left-2 flex size-8 -translate-y-1/2 items-center justify-center rounded-full bg-black/60 text-white transition-colors hover:bg-black/80"
        >
          <ChevronLeft className="size-4" />
        </button>
        <button
          type="button"
          onClick={() => goTo(index + 1)}
          aria-label="Próximo slide"
          className="absolute top-1/2 right-2 flex size-8 -translate-y-1/2 items-center justify-center rounded-full bg-black/60 text-white transition-colors hover:bg-black/80"
        >
          <ChevronRight className="size-4" />
        </button>
      </div>

      <div>
        <p className="text-sm font-semibold">{slide.title}</p>
        <p className="text-muted-foreground text-sm">{slide.description}</p>
      </div>

      <div className="flex items-center justify-center gap-1.5">
        {slides.map((s, i) => (
          <button
            key={s.image}
            type="button"
            onClick={() => setIndex(i)}
            aria-label={`Ir para slide ${i + 1}`}
            className={cn("h-1.5 rounded-full transition-all", i === index ? "bg-primary w-6" : "bg-muted-foreground/30 w-1.5")}
          />
        ))}
      </div>
    </div>
  );
}

export function HomePage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const [pastHero, setPastHero] = useState(false);
  const [activeModule, setActiveModule] = useState(0);
  const selectedModule = MODULES[activeModule];

  useEffect(() => {
    function handleScroll() {
      const heroHeight = heroRef.current?.offsetHeight ?? 0;
      setPastHero(window.scrollY >= heroHeight - 1);
    }
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="bg-dot-grid min-h-screen">
      <SiteHeader transparent={!pastHero} />

      {/* Hero */}
      <section id="top" className="relative w-full scroll-mt-20">
        <div ref={heroRef} className="relative h-[520px] w-full overflow-hidden sm:h-[560px] lg:h-[620px]">
          <img src={heroImage} alt="Atendimento Fluxy" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/45 to-black/10" />
          <div className="absolute inset-0 flex items-center">
            <div className="mx-auto flex w-full max-w-6xl flex-col items-start gap-5">
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

      <div className="mx-auto flex max-w-6xl flex-col gap-24 py-28">
        {/* Da primeira conversa ao aquecimento de leads */}
        <section className="grid items-stretch gap-6 lg:grid-cols-2 lg:gap-16">
          <div className="flex flex-col justify-start gap-4">
            <span className="text-primary text-xs font-semibold tracking-widest uppercase">Conheça mais</span>
            <h2 className="font-[family-name:var(--font-display)] text-2xl font-semibold sm:text-3xl">
              Da primeira conversa ao aquecimento de seus leads para gerar grandes resultados.
            </h2>
            <p className="text-muted-foreground text-base sm:text-lg">
              Veja como a Fluxy pode evoluir as conversas da sua empresa podendo aumentar o volume de vendas e
              atendimento da sua empresa.
            </p>
            <a href="#contato" className={cn(buttonVariants({ size: "lg" }), "w-fit")}>
              Saber mais
            </a>
          </div>
          <div className="flex items-center justify-center">
            <img
              src={conversaImage}
              alt="Conversa da Fluxy no WhatsApp"
              className="h-[420px] w-auto max-w-full object-cover sm:h-[480px] lg:h-[560px]"
            />
          </div>
        </section>

        {/* Segurança e parceria com a Meta */}
        <section className="grid items-stretch gap-6 py-28 lg:min-h-[420px] lg:grid-cols-2 lg:gap-16">
          <div className="flex items-center justify-center">
            <img src={metaLogo} alt="Meta Business Partner" className="w-full" />
          </div>
          <div className="flex flex-col justify-start gap-4">
            <span className="text-primary flex items-center gap-2 text-xs font-semibold tracking-widest uppercase">
              <ShieldCheck className="size-4" /> Segurança de ponta a ponta
            </span>
            <h2 className="font-[family-name:var(--font-display)] text-2xl font-semibold sm:text-3xl">
              O padrão de segurança modelado nas maiores empresas do mundo.
            </h2>
            <p className="text-muted-foreground text-base sm:text-lg">
              Temos parceria com a Meta para utilização do canal oficial do WhatsApp, com mais de 20 mil mensagens
              processadas por dia.
            </p>
            <Link to="/politica-de-privacidade" className={cn(buttonVariants({ size: "lg" }), "w-fit")}>
              Saber mais sobre a política de segurança
            </Link>
          </div>
        </section>

        {/* Módulos / cada ponta da ferramenta */}
        <section id="cases" className="flex flex-col gap-6 scroll-mt-20">
          <div className="text-center">
            <h2 className="font-[family-name:var(--font-display)] text-2xl font-semibold">
              Soluções completas para todas as jornadas
            </h2>
            <p className="text-muted-foreground mt-1 text-sm">
              Um único ecossistema para automatizar, atender e acompanhar toda a jornada do seu cliente.
            </p>
          </div>
          <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
            <div className="flex flex-col gap-2">
              {MODULES.map((module, index) => {
                const isActive = index === activeModule;
                return (
                  <button
                    key={module.title}
                    type="button"
                    onClick={() => setActiveModule(index)}
                    className={cn(
                      "flex items-center gap-3 rounded-none border p-4 text-left transition-colors",
                      isActive ? "border-primary bg-primary/5" : "border-transparent hover:bg-muted",
                    )}
                  >
                    <div
                      className={cn(
                        "flex size-10 shrink-0 items-center justify-center rounded-lg",
                        isActive ? "bg-primary text-primary-foreground" : "bg-primary/10 text-primary",
                      )}
                    >
                      <module.icon className="size-5" />
                    </div>
                    <span className="text-sm font-medium">{module.title}</span>
                  </button>
                );
              })}
            </div>

            <Card className="flex flex-col rounded-none">
              <CardHeader className="flex-row items-start gap-3 space-y-0">
                <div className="bg-primary/10 text-primary flex size-10 shrink-0 items-center justify-center rounded-lg">
                  <selectedModule.icon className="size-5" />
                </div>
                <div className="flex flex-col gap-1">
                  <CardTitle className="text-base">{selectedModule.title}</CardTitle>
                  {selectedModule.badge && (
                    <Badge variant="secondary" className="w-fit">
                      {selectedModule.badge}
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="flex flex-1 flex-col gap-3">
                <p className="text-muted-foreground text-sm">{selectedModule.description}</p>
                {selectedModule.carousel && <ModuleCarousel key={selectedModule.title} slides={selectedModule.carousel} />}
                {selectedModule.to && (
                  <Link
                    to={selectedModule.to}
                    className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "mt-auto w-fit")}
                  >
                    {selectedModule.ctaLabel} <ArrowRight className="size-4" />
                  </Link>
                )}
              </CardContent>
            </Card>
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
