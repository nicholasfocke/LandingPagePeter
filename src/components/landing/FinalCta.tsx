import Icon from "@/components/ui/Icon";
import { CONTACT_MESSAGES, INSTAGRAM_URL, whatsappLink } from "@/lib/site";

export default function FinalCta() {
  return (
    <section className="final-cta" id="contato" aria-labelledby="contato-title">
      <div className="final-cta__backdrop" aria-hidden="true">
        <div className="hero__grid" />
        <div className="final-cta__glow" />
      </div>
      <div className="container final-cta__inner">
        <p className="eyebrow eyebrow--gold" data-reveal>
          Próximo passo
        </p>
        <h2 id="contato-title" className="final-cta__title display" data-reveal style={{ ["--reveal-delay" as string]: 80 }}>
          Prepare seu inglês para as oportunidades <em>que estão por vir.</em>
        </h2>
        <p className="final-cta__lead" data-reveal style={{ ["--reveal-delay" as string]: 160 }}>
          Desenvolva a comunicação necessária para apresentar, negociar e construir relações
          profissionais em um mercado internacional.
        </p>
        <div className="final-cta__actions" data-reveal style={{ ["--reveal-delay" as string]: 220 }}>
          <a
            className="btn btn--gold btn--lg"
            href={whatsappLink(CONTACT_MESSAGES.needsAnalysis)}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Icon name="whatsapp" size={18} />
            Agendar uma conversa
          </a>
          <a
            className="btn btn--ghost-light btn--lg"
            href={whatsappLink(CONTACT_MESSAGES.company)}
            target="_blank"
            rel="noopener noreferrer"
          >
            Treinamento para empresas
          </a>
        </div>
        <a
          className="final-cta__social"
          href={INSTAGRAM_URL}
          target="_blank"
          rel="noopener noreferrer"
          data-reveal
        >
          <Icon name="instagram" size={18} />
          Acompanhe Peter no Instagram
        </a>
      </div>
    </section>
  );
}
