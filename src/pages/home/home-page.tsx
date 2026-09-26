import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  Bot,
  CheckCircle2,
  Headset,
  Megaphone,
  MessageSquareText,
  Plug,
  ShieldCheck,
  Users,
  Waypoints,
} from "lucide-react";
import heroImage from "@/assets/ImagemParaTop.jpg";
import conversaImage from "@/assets/Conversa.png";
import metaLogo from "@/assets/LogoMetaOficalSemFundo.png";
import solucoesImage from "@/assets/ImagemParaSoluçoes.jpg";
import rdStationLogo from "@/assets/RDStation.png";
import sankhyaLogo from "@/assets/Sankhya.png";
import pipedriveLogo from "@/assets/Pipedrive.png";
import googleLogo from "@/assets/Google.png";
import blingLogo from "@/assets/Bling.jpg";
import asaasLogo from "@/assets/Asaas.png";
import activeCampaignLogo from "@/assets/ActiveCampaign.png";
import hubspotLogo from "@/assets/HubSpot.jpg";
import zapIcon from "@/assets/IconeZap.png";
import embarcarImage from "@/assets/EmbarcarNaViagem.png";
import fluxyIcon from "@/assets/IconeAzulSemFundo.png";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { SiteHeader } from "@/components/site-header";
import { cn } from "@/lib/utils";

const PHONE_DISPLAY = "+55 34 9174-6481";
const PHONE_WHATSAPP = "https://wa.me/553491746481";

interface ModuleCard {
  icon: typeof Bot;
  title: string;
  description: string;
  badge?: string;
  features: string[];
}

const MODULES: ModuleCard[] = [
  {
    icon: Bot,
    title: "Agentes de IA",
    description:
      "Crie agentes com personalidade própria para atender no WhatsApp: mensagens de transbordo, fora de horário e encerramento, tudo configurável.",
    features: [
      "RAG — Base de conhecimento: anexe documentos da sua empresa e o agente aprende sozinho, sem código.",
      "Personalidade configurável: defina tom de voz, saudação e regras de atendimento.",
      "Transbordo inteligente para a fila humana quando a IA não resolve.",
      "Mensagens de fora de horário e encerramento configuráveis.",
    ],
  },
  {
    icon: Users,
    title: "Contatos",
    description: "Centralize e organize a base de contatos da sua empresa para segmentar campanhas e atendimentos.",
    features: [
      "Base centralizada de contatos com histórico e segmentação por tags.",
      "Importação e exportação via CSV.",
      "Organização por listas para campanhas e atendimentos.",
    ],
  },
  {
    icon: Megaphone,
    title: "Campanhas",
    description: "Dispare campanhas em massa pelo WhatsApp e acompanhe o desempenho de cada envio.",
    features: [
      "Disparos em massa pelo WhatsApp com agendamento.",
      "Segmentação de público por listas de contatos.",
      "Métricas de entrega, leitura e resposta em tempo real.",
    ],
  },
  {
    icon: MessageSquareText,
    title: "Redes sociais",
    description: "Conecte e gerencie seus canais oficiais de WhatsApp, com dashboards de conversas e volume de mensagens.",
    features: [
      "Conexão de canais oficiais do WhatsApp Business.",
      "Gestão centralizada de múltiplos números e canais.",
      "Dashboards de volume de conversas e mensagens.",
    ],
  },
  {
    icon: Waypoints,
    title: "Ilhas de Atendimento",
    description: "Organize filas de atendimento humano, monitore em tempo real e consulte o histórico completo de conversas.",
    features: [
      "Filas de atendimento humano organizadas por equipe.",
      "Monitoramento em tempo real dos atendimentos em andamento.",
      "Histórico completo de conversas por atendimento.",
    ],
  },
  {
    icon: Headset,
    title: "Fluxy Desk",
    description:
      "A central de atendimento da Fluxy: tickets, despacho ativo e histórico de conversas em um só lugar para sua equipe de suporte.",
    badge: "Produto complementar",
    features: [
      "Central de tickets para toda a equipe de suporte.",
      "Despacho ativo de conversas para os atendentes certos.",
      "Histórico unificado de todos os atendimentos.",
    ],
  },
];

const BRAND_LOGOS = [
  { name: "RD Station", src: rdStationLogo },
  { name: "Sankhya", src: sankhyaLogo },
  { name: "Pipedrive", src: pipedriveLogo },
  { name: "Google", src: googleLogo },
  { name: "Bling", src: blingLogo },
  { name: "Asaas", src: asaasLogo },
  { name: "ActiveCampaign", src: activeCampaignLogo },
  { name: "HubSpot", src: hubspotLogo },
];

function LogoMarquee() {
  return (
    <div className="relative flex w-full min-w-0 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
      <div className="animate-marquee hover:[animation-play-state:paused] flex w-max items-center gap-16 py-4">
        {[...BRAND_LOGOS, ...BRAND_LOGOS].map((logo, index) => (
          <img
            key={`${logo.name}-${index}`}
            src={logo.src}
            alt={logo.name}
            className="h-16 w-auto shrink-0 object-contain grayscale transition-all hover:grayscale-0"
          />
        ))}
      </div>
    </div>
  );
}

export function HomePage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const [pastHero, setPastHero] = useState(false);

  // "pastHero" na verdade significa "fora da faixa do hero escuro" — cabeçalho
  // fica sólido depois de passar do hero (sobre o conteúdo claro abaixo); só
  // fica transparente enquanto a imagem escura do hero está atrás dele.
  useEffect(() => {
    function handleScroll() {
      const hero = heroRef.current;
      if (!hero) return;
      const heroTop = hero.offsetTop;
      const heroBottom = heroTop + hero.offsetHeight;
      const insideHero = window.scrollY >= heroTop - 1 && window.scrollY < heroBottom;
      setPastHero(!insideHero);
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
        <div ref={heroRef} className="relative h-screen w-full overflow-hidden">
          <img src={heroImage} alt="Atendimento Fluxy" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/45 to-black/10" />
          <div className="absolute inset-0 flex items-end pb-16 sm:pb-20">
            <div className="mx-auto flex w-full max-w-6xl flex-col items-center gap-8 px-4 text-center sm:flex-row sm:items-end sm:justify-between sm:px-0 sm:text-left">
              <h1 className="font-[family-name:var(--font-display)] max-w-2xl text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
                Conversas que geram grandes resultados para uma empresa.
              </h1>
              <div className="flex max-w-xl flex-col items-center gap-5 sm:items-start">
                <p className="text-base text-white/85 sm:text-lg">
                  Automatize seu funil de vendas. A Sturnus Flow cria jornadas conversacionais completas para
                  escalar seus resultados com precisão.
                </p>
                <a href="#contato" className={cn(buttonVariants({ size: "lg" }), "text-base")}>
                  <img src={zapIcon} alt="" className="size-4" /> Agendar uma conversa
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto flex max-w-6xl flex-col gap-52 py-28">
        {/* Da primeira conversa ao aquecimento de leads */}
        <section className="grid items-stretch gap-6 lg:grid-cols-2 lg:gap-16">
          <div className="flex flex-col items-center gap-4 text-center lg:items-start lg:text-left">
            <span className="text-primary text-xs font-semibold tracking-widest uppercase">Conheça mais</span>
            <h2 className="font-[family-name:var(--font-display)] text-2xl font-semibold sm:text-3xl">
              Da primeira conversa ao aquecimento de seus leads para gerar grandes resultados.
            </h2>
            <p className="text-muted-foreground text-base sm:text-lg">
              Descubra como a Sturnus Flow transforma as conversas do seu negócio, acelerando vendas e otimizando o
              atendimento.
            </p>
            <a href="#contato" className={cn(buttonVariants({ size: "lg" }), "w-fit text-base")}>
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
        <section className="grid items-stretch gap-6 lg:min-h-[420px] lg:grid-cols-2 lg:gap-16">
          <div className="order-last flex items-center justify-center lg:order-first">
            <img src={metaLogo} alt="Meta Business Partner" className="w-full" />
          </div>
          <div className="flex flex-col items-center gap-4 text-center lg:items-start lg:text-left">
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
            <Link to="/politica-de-privacidade" className={cn(buttonVariants({ size: "lg" }), "w-fit text-base")}>
              Saber mais sobre a política de segurança
            </Link>
          </div>
        </section>

        {/* Módulos / cada ponta da ferramenta */}
        <section id="cases" className="scroll-mt-20">
          <div className="grid items-start gap-8 lg:grid-cols-2 lg:gap-16">
            <div className="flex flex-col gap-6">
              <div className="text-center lg:text-left">
                <h2 className="font-[family-name:var(--font-display)] text-2xl font-semibold sm:text-3xl">
                  Soluções completas para todas as jornadas
                </h2>
                <p className="text-muted-foreground mt-1 text-sm">
                  Um único ecossistema para automatizar, atender e acompanhar toda a jornada do seu cliente.
                </p>
              </div>
              <Accordion type="single" collapsible className="px-4 lg:px-0">
                {MODULES.map((module) => (
                  <AccordionItem key={module.title} value={module.title}>
                    <AccordionTrigger>
                      <span className="flex items-center gap-3">
                        <span className="text-primary flex shrink-0 items-center justify-center">
                          <module.icon className="size-8" />
                        </span>
                        <span className="text-sm font-semibold">{module.title}</span>
                        {module.badge && (
                          <Badge variant="secondary" className="ml-2">
                            {module.badge}
                          </Badge>
                        )}
                      </span>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="flex flex-col gap-3">
                        <p className="text-muted-foreground text-sm">{module.description}</p>
                        <ul className="flex flex-col gap-2">
                          {module.features.map((feature) => (
                            <li key={feature} className="flex items-start gap-2 text-sm">
                              <CheckCircle2 className="text-success mt-0.5 size-4 shrink-0" />
                              <span className="text-muted-foreground">{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>

            <img
              src={solucoesImage}
              alt="Soluções completas Sturnus Flow"
              className="h-[420px] w-full object-cover sm:h-[480px] lg:sticky lg:top-24 lg:h-[560px]"
            />
          </div>
        </section>

        {/* Integrações com terceiros */}
        <section className="grid items-stretch gap-6 lg:grid-cols-2 lg:gap-16">
          <div className="order-last flex min-w-0 items-center justify-center lg:order-first">
            <LogoMarquee />
          </div>
          <div className="flex flex-col items-center justify-center gap-4 text-center lg:items-start lg:text-left">
            <span className="text-primary flex items-center gap-2 text-xs font-semibold tracking-widest uppercase">
              <Plug className="size-4" /> Conecte sua operação
            </span>
            <h2 className="font-[family-name:var(--font-display)] text-2xl font-semibold sm:text-3xl">
              Integração com terceiros
            </h2>
            <p className="text-muted-foreground text-base sm:text-lg">
              A Sturnus Flow se integra perfeitamente às ferramentas que você já utiliza, conectando sua operação de
              forma simples e imediata.
            </p>
          </div>
        </section>
      </div>

      {/* Contato */}
      <section
        id="contato"
        className="bg-primary text-primary-foreground mt-52 grid w-full scroll-mt-20 items-stretch gap-8 lg:grid-cols-2 lg:gap-16 lg:pl-[max(1rem,calc((100vw-72rem)/2))]"
      >
        <div className="mx-auto flex w-full max-w-xl flex-col items-center justify-center gap-4 px-4 py-20 text-center lg:mx-0 lg:items-start lg:px-0 lg:text-left">
          <h2 className="font-[family-name:var(--font-display)] text-2xl font-semibold sm:text-3xl">
            Fale com um de nossos especialistas
          </h2>
          <p className="text-primary-foreground/80 max-w-md text-sm sm:text-base">
            Pronto para escalar seus resultados? Solicite um orçamento, tire dúvidas ou conheça as novidades da
            Sturnus Flow.
          </p>
          <p className="font-[family-name:var(--font-display)] text-xl font-semibold">{PHONE_DISPLAY}</p>
          <a
            href={PHONE_WHATSAPP}
            target="_blank"
            rel="noreferrer"
            className={cn(
              buttonVariants({ size: "lg", variant: "outline" }),
              "border-white bg-transparent text-base text-white hover:bg-white/10 hover:text-white",
            )}
          >
            <img src={zapIcon} alt="" className="size-4" /> Chamar no WhatsApp
          </a>
        </div>
        <div className="flex items-stretch justify-center">
          <img src={embarcarImage} alt="Embarque na jornada Sturnus Flow" className="h-full w-full object-cover" />
        </div>
      </section>

      {/* Footer */}
      <footer className="border-border w-full border-t">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 py-8 sm:flex-row">
          <div className="flex items-center gap-2">
            <img src={fluxyIcon} alt="" className="h-8 w-8 object-contain" />
            <span className="font-[family-name:var(--font-display)] text-lg font-semibold">Sturnus Flow</span>
          </div>
          <div className="flex flex-col items-center gap-1 sm:items-end">
            <a href="mailto:sturnusflow@gmail.com" className="text-muted-foreground text-sm hover:underline">
              sturnusflow@gmail.com
            </a>
            <span className="text-muted-foreground text-xs">© 2026 Sturnus Flow. Todos os direitos reservados.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
