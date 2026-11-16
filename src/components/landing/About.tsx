import Image from "next/image";
import Icon from "@/components/ui/Icon";
import { CONTACT_MESSAGES, whatsappLink } from "@/lib/site";

const TIMELINE = [
  { label: "Origem", text: "Nascido em Bremerhaven, Alemanha." },
  { label: "Formação", text: "Pedagogo pela Universidade de Bremen." },
  {
    label: "Certificações",
    text: "Certificado pela Universidade de Cambridge e pela Câmara de Comércio e Indústria de Londres.",
  },
  { label: "Europa", text: "Posições de liderança em diversos países europeus." },
  { label: "1997", text: "Estabelece-se no Brasil e passa a treinar profissionais brasileiros." },
  {
    label: "Hoje",
    text: "Treinamentos, preparatórios TOEFL e IELTS, workshops e consultorias para profissionais e empresas.",
  },
];

const STATS = [
  { value: "30+", label: "anos de experiência" },
  { value: "1.300+", label: "profissionais brasileiros treinados" },
  { value: "20+", label: "nacionalidades atendidas" },
];

export default function About() {
  return (
    <section className="section about" id="peter" aria-labelledby="peter-title">
      <div className="container about__inner">
        <figure className="about__figure" data-reveal="scale">
          <div className="about__frame">
            <div className="about__frame-glow" aria-hidden="true" />
            <Image
              src="/images/peter.png"
              alt="Retrato de Peter Focke"
              width={500}
              height={499}
              sizes="(max-width: 900px) 90vw, 520px"
              className="about__photo"
            />
          </div>
          <figcaption className="about__caption">
            <span className="about__caption-name">Peter Focke</span>
            <span>Fundador do High Performance English</span>
          </figcaption>
        </figure>

        <div className="about__content">
          <p className="eyebrow eyebrow--gold" data-reveal>
            Conheça o especialista
          </p>
          <h2 id="peter-title" className="about__title display" data-reveal style={{ ["--reveal-delay" as string]: 80 }}>
            Peter Focke
          </h2>
          <p className="about__lead" data-reveal style={{ ["--reveal-delay" as string]: 140 }}>
            Educador alemão com carreira internacional, Peter dedica mais de três décadas a
            preparar profissionais para conduzir negócios em inglês — com confiança, performance e
            naturalidade.
          </p>

          <blockquote className="about__quote" data-reveal style={{ ["--reveal-delay" as string]: 200 }}>
            <Icon name="quote" size={28} />
            <p>
              Ajudar líderes a conduzir negócios em inglês com confiança, performance e
              naturalidade.
            </p>
            <cite>Propósito do método HPE</cite>
          </blockquote>

          <ol className="about__timeline">
            {TIMELINE.map((item, index) => (
              <li
                key={item.label}
                className="about__milestone"
                data-reveal
                style={{ ["--reveal-delay" as string]: 80 + index * 60 }}
              >
                <span className="about__milestone-label">{item.label}</span>
                <span className="about__milestone-text">{item.text}</span>
              </li>
            ))}
          </ol>

          <dl className="about__stats">
            {STATS.map((stat, index) => (
              <div
                key={stat.label}
                className="about__stat"
                data-reveal
                style={{ ["--reveal-delay" as string]: index * 90 }}
              >
                <dt className="sr-only">{stat.label}</dt>
                <dd>
                  <span className="about__stat-value display">{stat.value}</span>
                  <span className="about__stat-label">{stat.label}</span>
                </dd>
              </div>
            ))}
          </dl>

          <div className="about__actions" data-reveal>
            <a
              className="btn btn--gold"
              href={whatsappLink(CONTACT_MESSAGES.general)}
              target="_blank"
              rel="noopener noreferrer"
            >
              Falar com Peter
              <Icon name="arrowRight" size={18} />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
