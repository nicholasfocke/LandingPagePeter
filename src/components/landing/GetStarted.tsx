import Icon from "@/components/ui/Icon";
import PurchaseButton from "@/components/checkout/PurchaseButton";
import { CONTACT_MESSAGES, whatsappLink } from "@/lib/site";

const CUSTOM_STEPS = [
  { title: "Contato", text: "Uma conversa com Peter pelo WhatsApp." },
  { title: "Análise de necessidades", text: "Objetivos, contexto e avaliação de proficiência." },
  { title: "Proposta", text: "Conteúdo, cronograma, formato e investimento." },
  { title: "Início do programa", text: "Aulas focadas nas suas situações reais." },
];

const DIGITAL_STEPS = [
  { title: "Compra segura", text: "Pagamento processado pela Stripe." },
  { title: "Criação de senha", text: "Você recebe por e-mail o link para criar sua senha." },
  { title: "Área do aluno", text: "Entre com o e-mail usado na compra." },
  { title: "Aulas liberadas", text: "Vídeos e PDFs disponíveis para estudar no seu ritmo." },
];

function Steps({ steps }: { steps: { title: string; text: string }[] }) {
  return (
    <ol className="journey__steps">
      {steps.map((step, index) => (
        <li key={step.title} className="journey__step">
          <span className="journey__index">{index + 1}</span>
          <div>
            <p className="journey__step-title">{step.title}</p>
            <p className="journey__step-text">{step.text}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}

export default function GetStarted() {
  return (
    <section className="section journey" id="como-comecar" aria-labelledby="comecar-title">
      <div className="container">
        <div className="section-head section-head--center">
          <p className="eyebrow" data-reveal>
            Como começar
          </p>
          <h2 id="comecar-title" className="section-title display" data-reveal style={{ ["--reveal-delay" as string]: 80 }}>
            Dois caminhos, <em>o mesmo padrão.</em>
          </h2>
        </div>

        <div className="journey__grid">
          <article className="journey__card journey__card--dark" data-reveal>
            <span className="journey__tag">Treinamento personalizado</span>
            <h3 className="journey__title display">Para executivos, equipes e empresas</h3>
            <Steps steps={CUSTOM_STEPS} />
            <a
              className="btn btn--gold btn--block"
              href={whatsappLink(CONTACT_MESSAGES.needsAnalysis)}
              target="_blank"
              rel="noopener noreferrer"
            >
              Agendar uma análise de necessidades
              <Icon name="arrowRight" size={18} />
            </a>
          </article>

          <article className="journey__card" data-reveal style={{ ["--reveal-delay" as string]: 120 }}>
            <span className="journey__tag">Curso digital</span>
            <h3 className="journey__title display">Para estudar no seu ritmo</h3>
            <Steps steps={DIGITAL_STEPS} />
            <PurchaseButton className="btn btn--primary btn--block">
              Comprar curso
              <Icon name="arrowRight" size={18} />
            </PurchaseButton>
          </article>
        </div>
      </div>
    </section>
  );
}
