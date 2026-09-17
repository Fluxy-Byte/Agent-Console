import { Link } from "react-router-dom";
import { ArrowLeft, MessageCircle, ShieldCheck } from "lucide-react";
import heroImage from "@/assets/ApresentacaoInicial.jpg";
import { SiteHeader } from "@/components/site-header";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const PHONE_WHATSAPP = "https://wa.me/553491746481";

interface PolicySection {
  title: string;
  paragraphs: string[];
}

const SECTIONS: PolicySection[] = [
  {
    title: "1. Como coletamos seus dados pessoais?",
    paragraphs: [
      "Coletamos dados pessoais de quatro formas principais: informações que você mesmo nos fornece (ao criar uma conta, preencher formulários ou falar com nosso time); coleta automática por meio de tecnologias como cookies e endereço IP durante o uso da plataforma; informações recebidas de terceiros, como parceiros comerciais e candidatos a vagas; e dados de empresas que já mantêm relacionamento comercial com a Fluxy.",
    ],
  },
  {
    title: "2. Por quais razões coletamos seus dados pessoais?",
    paragraphs: [
      "Usamos os dados coletados para viabilizar o cadastro de usuários, o funcionamento da plataforma Fluxy, a cobrança pelos serviços contratados, o atendimento e suporte aos nossos clientes, ações de marketing, processos seletivos, análise de uso do produto, segurança da informação, cumprimento de obrigações legais e regulatórias, resposta a processos judiciais ou administrativos e apuração de denúncias.",
    ],
  },
  {
    title: "3. Quais dados coletamos?",
    paragraphs: [
      "Podemos coletar dados cadastrais (nome, e-mail, telefone e empresa), dados de dispositivo e navegação (endereço IP, navegador, geolocalização aproximada), dados de interação com os agentes de IA e canais de atendimento da Fluxy (como conteúdo de conversas realizadas na plataforma) e outras informações que você opte por nos fornecer voluntariamente.",
    ],
  },
  {
    title: "4. Com quem seus dados pessoais são compartilhados?",
    paragraphs: [
      "Seus dados podem ser compartilhados com empresas do nosso grupo econômico, parceiros e fornecedores que nos ajudam a operar a plataforma (como provedores de infraestrutura em nuvem e o WhatsApp Business Platform, operado pela Meta), assessores jurídicos e contábeis externos, autoridades governamentais e judiciais quando exigido por lei, e eventuais adquirentes em caso de operações societárias. Nunca vendemos seus dados pessoais a terceiros.",
    ],
  },
  {
    title: "5. Quais são as bases legais para o tratamento dos seus dados?",
    paragraphs: [
      "Tratamos dados pessoais com base no cumprimento de obrigações legais, na execução de contratos firmados com você ou com a empresa que você representa, no exercício regular de direitos, na proteção da vida ou incolumidade física, no legítimo interesse da Fluxy, na prevenção a fraudes e, quando aplicável, no seu consentimento.",
    ],
  },
  {
    title: "6. Por quanto tempo seus dados serão tratados?",
    paragraphs: [
      "Mantemos seus dados pessoais apenas pelo tempo necessário para cumprir as finalidades descritas nesta política, respeitando prazos de guarda exigidos por lei. Após esse período, os dados são eliminados ou anonimizados, salvo hipóteses legais que justifiquem sua manutenção. Você pode solicitar mais detalhes sobre prazos específicos pelos nossos canais de contato.",
    ],
  },
  {
    title: "7. Cookies",
    paragraphs: [
      "Utilizamos cookies estritamente necessários ao funcionamento da plataforma, cookies de preferência (para lembrar configurações de idioma e tema) e cookies de análise, que nos ajudam a entender como a plataforma é utilizada. Você pode gerenciar ou desativar cookies diretamente nas configurações do seu navegador, o que pode afetar algumas funcionalidades da plataforma.",
    ],
  },
  {
    title: "8. Quais são os seus direitos?",
    paragraphs: [
      "Conforme a Lei Geral de Proteção de Dados (LGPD), você tem direito à confirmação da existência de tratamento, acesso aos dados, correção de dados incompletos ou desatualizados, anonimização ou exclusão de dados desnecessários, portabilidade, informação sobre com quem seus dados foram compartilhados, revogação do consentimento, oposição a tratamentos irregulares e reclamação junto à Autoridade Nacional de Proteção de Dados (ANPD).",
    ],
  },
  {
    title: "9. Solicitação de acesso ou exclusão de dados",
    paragraphs: [
      "Você pode solicitar acesso, correção ou exclusão dos seus dados pessoais gratuitamente, entrando em contato pelos canais informados no final desta política. Para proteger sua privacidade, podemos solicitar informações adicionais para confirmar sua identidade antes de atender ao pedido. Respondemos às solicitações dentro de prazos razoáveis.",
    ],
  },
  {
    title: "10. Segurança da informação",
    paragraphs: [
      "Adotamos medidas técnicas e organizacionais para proteger seus dados pessoais, como controle de acesso por permissões, autenticação, criptografia em trânsito, monitoramento de ameaças e rotinas de backup. Nenhum sistema é 100% imune a incidentes, por isso trabalhamos continuamente para aprimorar nossos controles. Você também tem um papel importante nesse processo: mantenha suas credenciais de acesso em sigilo e não as compartilhe com terceiros.",
    ],
  },
  {
    title: "11. Segurança e gestão de risco",
    paragraphs: [
      "A gestão de riscos de segurança da informação e privacidade é parte do dia a dia da Fluxy. Buscamos identificar, avaliar e mitigar riscos de forma contínua, implementando controles proporcionais à sensibilidade dos dados tratados e acompanhando a evolução do cenário de ameaças digitais. Esse trabalho é orientado pelos princípios da LGPD e tem como objetivo garantir a confidencialidade, a integridade e a disponibilidade das informações dos nossos clientes.",
    ],
  },
  {
    title: "12. Conscientização e treinamento",
    paragraphs: [
      "Promovemos ações de conscientização sobre segurança da informação e proteção de dados junto à nossa equipe, reforçando boas práticas no manuseio de dados pessoais e no reconhecimento de tentativas de fraude e engenharia social. Colaboradores com acesso a dados sensíveis recebem orientações específicas sobre suas responsabilidades, e seguimos evoluindo esses processos à medida que a Fluxy cresce.",
    ],
  },
  {
    title: "13. Sites e serviços de terceiros",
    paragraphs: [
      "A plataforma da Fluxy pode conter links para sites ou serviços de terceiros, como o WhatsApp Business Platform. Esses serviços possuem políticas de privacidade próprias, e a Fluxy não se responsabiliza pelas práticas de terceiros fora do nosso controle.",
    ],
  },
  {
    title: "14. Como entrar em contato",
    paragraphs: [
      "Se você tiver dúvidas sobre esta Política de Privacidade ou quiser exercer algum dos seus direitos, fale com a gente pelo WhatsApp ou telefone informados no rodapé desta página, ou envie um e-mail para fluxytechnologies@gmail.com.",
    ],
  },
  {
    title: "15. Dados do agente responsável",
    paragraphs: [
      "Controladora: Fluxy [Razão social a confirmar] — CNPJ [a confirmar] — [endereço a confirmar]. Estes dados de identificação societária serão atualizados aqui antes da publicação oficial desta política.",
    ],
  },
  {
    title: "16. Atualizações desta política",
    paragraphs: [
      "Esta Política de Privacidade pode ser atualizada periodicamente para refletir melhorias na plataforma ou mudanças na legislação. Sempre que houver alterações relevantes, avisaremos você e, quando necessário, solicitaremos um novo consentimento.",
    ],
  },
];

export function PrivacyPolicyPage() {
  return (
    <div className="bg-dot-grid min-h-screen">
      <SiteHeader />

      <div className="mx-auto max-w-4xl px-6 pt-28 pb-20">
        <Link
          to="/"
          className="text-muted-foreground hover:text-foreground mb-6 inline-flex items-center gap-1.5 text-sm transition-colors"
        >
          <ArrowLeft className="size-4" /> Voltar para o início
        </Link>

        <span className="text-primary flex items-center gap-2 text-xs font-semibold tracking-widest uppercase">
          <ShieldCheck className="size-4" /> Privacidade &amp; Segurança
        </span>
        <h1 className="font-[family-name:var(--font-display)] mt-3 text-3xl font-bold sm:text-4xl">
          Política de Privacidade
        </h1>
        <p className="text-muted-foreground mt-3 max-w-2xl text-base sm:text-lg">
          A Fluxy é uma plataforma que cria agentes de IA para atendimento, vendas e relacionamento no WhatsApp.
          Esta política explica como coletamos, usamos, compartilhamos e protegemos os dados pessoais de clientes,
          usuários da plataforma e visitantes do nosso site.
        </p>
        <p className="text-muted-foreground mt-1 text-sm">Última atualização: setembro de 2026.</p>

        <div className="mt-12 flex flex-col gap-10">
          {SECTIONS.slice(0, 10).map((section) => (
            <section key={section.title} className="flex flex-col gap-2">
              <h2 className="font-[family-name:var(--font-display)] text-xl font-semibold">{section.title}</h2>
              {section.paragraphs.map((paragraph, i) => (
                <p key={i} className="text-muted-foreground text-sm leading-relaxed sm:text-base">
                  {paragraph}
                </p>
              ))}
            </section>
          ))}

          <img
            src={heroImage}
            alt="Especialista da Fluxy monitorando o atendimento com segurança"
            className="h-56 w-full rounded-2xl object-cover sm:h-72"
          />

          {SECTIONS.slice(10).map((section) => (
            <section key={section.title} className="flex flex-col gap-2">
              <h2 className="font-[family-name:var(--font-display)] text-xl font-semibold">{section.title}</h2>
              {section.paragraphs.map((paragraph, i) => (
                <p key={i} className="text-muted-foreground text-sm leading-relaxed sm:text-base">
                  {paragraph}
                </p>
              ))}
            </section>
          ))}
        </div>

        <div className="mt-14 flex flex-wrap items-center gap-3 border-t pt-8">
          <p className="text-muted-foreground text-sm">Ainda com dúvidas sobre privacidade e segurança?</p>
          <a href={PHONE_WHATSAPP} target="_blank" rel="noreferrer" className={cn(buttonVariants({ size: "sm" }))}>
            <MessageCircle className="size-4" /> Falar no WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}
