import Icon from "@/components/ui/Icon";
import { CONTACT_MESSAGES, whatsappLink } from "@/lib/site";

const FEATURED = [
  {
    tag: "Programa assinatura",
    title: "Curso completo de Business English",
    text: "Desenvolvimento contínuo das habilidades essenciais para apresentar, negociar, liderar, participar de reuniões e trabalhar em equipe em inglês.",
    details: ["Individual ou em pequenos grupos", "Presencial ou online", "Conteúdo construído a partir da análise de necessidades"],
  },
  {
    tag: "Para empresas e executivos",
    title: "Consultoria VIP",
    text: "Atendimento premium para empresas e executivos que precisam de um especialista para preparar apresentações, negociações e agendas em inglês.",
    details: ["Preparação para compromissos específicos", "Apoio em apresentações e negociações", "Preparação de agendas em inglês"],
  },
];

const PROGRAMS = [
  {
    tag: "Corporativo",
    title: "Workshops de Business Skills",
    text: "Módulos de 4 ou 8 horas em grupos de até 12 participantes, focados em apresentação, negociação com estrangeiros e liderança.",
  },
  {
    tag: "Imersão",
    title: "Imersão em Business English",
    text: "Quatro encontros intensivos em dois fins de semana — 24 horas de prática sem sair do país.",
  },
  {
    tag: "Mercado imobiliário",
    title: "Vendas de imóveis em inglês",
    text: "Dois módulos para corretores atuarem em transações internacionais: vocabulário técnico, negociação e condução de clientes estrangeiros.",
  },
  {
    tag: "Certificações",
    title: "Preparatórios TOEFL & IELTS",
    text: "Plano de estudo orientado pelo seu diagnóstico, cobrindo reading, writing, listening e speaking.",
  },
];

export default function Programs() {
  return (
    <section className="section programs" id="programas" aria-labelledby="programas-title">
      <div className="container">
        <div className="section-head section-head--split">
          <div>
            <p className="eyebrow" data-reveal>
              Programas e serviços
            </p>
            <h2 id="programas-title" className="section-title display" data-reveal style={{ ["--reveal-delay" as string]: 80 }}>
              Formatos sob medida, <em>conduzidos por Peter.</em>
            </h2>
          </div>
          <p className="lead" data-reveal style={{ ["--reveal-delay" as string]: 160 }}>
            Todos os programas são personalizados, com foco prático, e começam pela análise das
            suas necessidades — ou das necessidades da sua equipe.
          </p>
        </div>

        <div className="programs__featured">
          {FEATURED.map((program, index) => (
            <article
              key={program.title}
              className="program-feature"
              data-reveal
              style={{ ["--reveal-delay" as string]: index * 120 }}
            >
              <div className="program-feature__glow" aria-hidden="true" />
              <span className="program-feature__tag">{program.tag}</span>
              <h3 className="program-feature__title display">{program.title}</h3>
              <p className="program-feature__text">{program.text}</p>
              <ul className="program-feature__details">
                {program.details.map((detail) => (
                  <li key={detail}>
                    <Icon name="check" size={16} />
                    {detail}
                  </li>
                ))}
              </ul>
              <a
                className="btn btn--gold program-feature__cta"
                href={whatsappLink(CONTACT_MESSAGES.program(program.title))}
                target="_blank"
                rel="noopener noreferrer"
              >
                Conversar sobre este programa
                <Icon name="arrowRight" size={18} />
              </a>
            </article>
          ))}
        </div>

        <div className="programs__grid">
          {PROGRAMS.map((program, index) => (
            <article
              key={program.title}
              className="program-card"
              data-reveal
              style={{ ["--reveal-delay" as string]: index * 80 }}
            >
              <span className="program-card__tag">{program.tag}</span>
              <h3 className="program-card__title">{program.title}</h3>
              <p className="program-card__text">{program.text}</p>
              <a
                className="program-card__link"
                href={whatsappLink(CONTACT_MESSAGES.program(program.title))}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Consultar disponibilidade: ${program.title}`}
              >
                Consultar disponibilidade
                <Icon name="arrowUpRight" size={16} />
              </a>
            </article>
          ))}
        </div>

        <div className="programs__digital" data-reveal>
          <p>
            <strong>Prefere começar no seu ritmo?</strong> O curso digital HPE reúne aulas em vídeo
            e material de apoio para estudar quando quiser.
          </p>
          <a className="text-link" href="#catalogo">
            Conhecer o curso digital
            <Icon name="arrowRight" size={16} />
          </a>
        </div>
      </div>
    </section>
  );
}
