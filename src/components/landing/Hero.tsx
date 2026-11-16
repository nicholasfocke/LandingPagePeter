import Image from "next/image";
import Icon from "@/components/ui/Icon";
import HeroScenes from "@/components/landing/HeroScenes";
import { CONTACT_MESSAGES, whatsappLink } from "@/lib/site";

const CREDENTIALS = [
  { value: "30+", label: "anos de experiência" },
  { value: "1.300+", label: "profissionais treinados" },
  { value: "20+", label: "nacionalidades atendidas" },
];

export default function Hero() {
  return (
    <section className="hero" id="inicio" aria-labelledby="hero-title">
      <div className="hero__backdrop" aria-hidden="true">
        <div className="hero__grid" />
        <div className="hero__glow hero__glow--a" />
        <div className="hero__glow hero__glow--b" />
      </div>

      <div className="hero__inner container">
        <div className="hero__copy">
          <p className="eyebrow eyebrow--gold hero__enter" style={{ ["--i" as string]: 0 }}>
            High Performance English
          </p>

          <h1 id="hero-title" className="hero__title display">
            <span className="hero__line hero__enter" style={{ ["--i" as string]: 1 }}>
              O mundo dos negócios fala inglês.
            </span>{" "}
            <span className="hero__line hero__enter" style={{ ["--i" as string]: 2 }}>
              Esteja preparado para <em>liderar a conversa.</em>
            </span>
          </h1>

          <p className="hero__lead hero__enter" style={{ ["--i" as string]: 3 }}>
            Treinamento personalizado em Business English para executivos, empreendedores e
            profissionais que precisam apresentar, negociar, vender e liderar em inglês.
          </p>

          <div className="hero__actions hero__enter" style={{ ["--i" as string]: 4 }}>
            <a
              className="btn btn--gold btn--lg"
              href={whatsappLink(CONTACT_MESSAGES.needsAnalysis)}
              target="_blank"
              rel="noopener noreferrer"
            >
              Agendar uma análise de necessidades
              <Icon name="arrowRight" size={18} />
            </a>
            <a className="btn btn--ghost-light btn--lg" href="#metodo">
              Conhecer o método
            </a>
          </div>

          <dl className="hero__credentials hero__enter" style={{ ["--i" as string]: 5 }}>
            {CREDENTIALS.map((item) => (
              <div key={item.label} className="hero__credential">
                <dt className="sr-only">{item.label}</dt>
                <dd>
                  <span className="hero__credential-value">{item.value}</span>
                  <span className="hero__credential-label">{item.label}</span>
                </dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="hero__visual hero__enter" style={{ ["--i" as string]: 2 }}>
          <div className="hero__portrait">
            <div className="hero__arc" aria-hidden="true" />
            <Image
              src="/images/peter.png"
              alt="Peter Focke, fundador do High Performance English"
              width={500}
              height={499}
              priority
              sizes="(max-width: 900px) 80vw, 500px"
              className="hero__photo"
            />
            <div className="hero__nameplate">
              <span className="hero__nameplate-name">Peter Focke</span>
              <span className="hero__nameplate-role">Fundador · Business English Trainer</span>
            </div>
          </div>
          <HeroScenes />
        </div>
      </div>

      <a href="#situacoes" className="hero__scroll" aria-label="Rolar para a próxima seção">
        <span />
      </a>
    </section>
  );
}
