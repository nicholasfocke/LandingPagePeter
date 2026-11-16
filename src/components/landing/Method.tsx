import Icon from "@/components/ui/Icon";
import MethodSteps, { type MethodStep } from "@/components/landing/MethodSteps";
import { CONTACT_MESSAGES, whatsappLink } from "@/lib/site";

const STEPS: MethodStep[] = [
  {
    en: "Needs analysis",
    title: "Análise das necessidades profissionais",
    text: "Mapeamos desafios, objetivos e os momentos críticos da sua rotina — ou da rotina da sua equipe — para definir as prioridades do programa.",
  },
  {
    en: "Proficiency assessment",
    title: "Avaliação de proficiência",
    text: "Avaliação detalhada do seu nível de inglês nas quatro habilidades: reading, writing, listening e speaking.",
  },
  {
    en: "Goal setting",
    title: "Definição de objetivos",
    text: "Clareza sobre onde você quer chegar e em quais situações o inglês precisa funcionar primeiro.",
  },
  {
    en: "Program design",
    title: "Construção do treinamento",
    text: "Proposta personalizada com conteúdos, cronograma, formato das aulas e investimento — sem material genérico.",
  },
  {
    en: "Real-world practice",
    title: "Aplicação em situações profissionais",
    text: "Aulas centradas em apresentações, reuniões, negociações e conversas do seu mercado.",
  },
  {
    en: "Ongoing follow-up",
    title: "Acompanhamento do desenvolvimento",
    text: "Acompanhamento contínuo ao longo do programa, ajustando o plano conforme a sua evolução.",
  },
];

export default function Method() {
  return (
    <section className="section method" id="metodo" aria-labelledby="metodo-title">
      <div className="container method__inner">
        <div className="method__intro">
          <div className="method__sticky">
            <p className="eyebrow" data-reveal>
              O método High Performance English
            </p>
            <h2 id="metodo-title" className="section-title display" data-reveal style={{ ["--reveal-delay" as string]: 80 }}>
              Um programa construído <em>a partir de você.</em>
            </h2>
            <p className="lead" data-reveal style={{ ["--reveal-delay" as string]: 160 }}>
              Cada programa começa com uma análise profunda das suas demandas. A partir dela,
              os módulos são construídos para as situações de alto impacto que você vive no dia
              a dia — em aulas individuais ou em pequenos grupos, presenciais ou online.
            </p>
            <a
              className="btn btn--primary method__cta"
              href={whatsappLink(CONTACT_MESSAGES.needsAnalysis)}
              target="_blank"
              rel="noopener noreferrer"
              data-reveal
              style={{ ["--reveal-delay" as string]: 220 }}
            >
              Começar pela análise de necessidades
              <Icon name="arrowRight" size={18} />
            </a>
          </div>
        </div>
        <MethodSteps steps={STEPS} />
      </div>
    </section>
  );
}
