const SKILLS = [
  {
    en: "International Sales",
    text: "Apresentar produtos e serviços a compradores estrangeiros e conduzir a venda até o fechamento.",
  },
  {
    en: "Business Negotiation",
    text: "Defender condições, fazer concessões com critério e construir acordos duradouros.",
  },
  {
    en: "Executive Presentations",
    text: "Estruturar e apresentar ideias, resultados e propostas para públicos exigentes.",
  },
  {
    en: "Client Communication",
    text: "Atender, entender e acompanhar clientes internacionais com clareza e cordialidade.",
  },
  {
    en: "Sales Meetings",
    text: "Fazer as perguntas certas, analisar necessidades e conduzir a reunião com objetivo.",
  },
  {
    en: "Relationship Building",
    text: "Small talk, almoços de negócios e o vocabulário que aproxima pessoas.",
  },
  {
    en: "Leadership Communication",
    text: "Liderar equipes, dar feedback e alinhar expectativas em ambientes multiculturais.",
  },
];

export default function BusinessSkills() {
  return (
    <section className="section skills" id="negocios" aria-labelledby="negocios-title">
      <div className="container skills__inner">
        <div className="skills__intro">
          <p className="eyebrow" data-reveal>
            Business English para negócios internacionais
          </p>
          <h2 id="negocios-title" className="section-title display" data-reveal style={{ ["--reveal-delay" as string]: 80 }}>
            Para quem vende, negocia e <em>se relaciona</em> com o mundo.
          </h2>
          <p className="lead" data-reveal style={{ ["--reveal-delay" as string]: 160 }}>
            Empresários, gestores comerciais e corretores de imóveis que atendem clientes
            estrangeiros no Brasil — ou que levam seus negócios para fora — precisam de um
            inglês que funcione na mesa de negociação, não apenas na sala de aula.
          </p>
          <aside className="skills__callout" data-reveal style={{ ["--reveal-delay" as string]: 220 }}>
            <span className="chip chip--gold">Mercado imobiliário</span>
            <p>
              Programa específico para corretores atuarem em transações internacionais:
              vocabulário técnico, negociação e condução de clientes estrangeiros.
            </p>
          </aside>
        </div>

        <ul className="skills__list">
          {SKILLS.map((skill, index) => (
            <li
              key={skill.en}
              className="skill-row"
              data-reveal
              style={{ ["--reveal-delay" as string]: index * 60 }}
            >
              <span className="skill-row__index">{String(index + 1).padStart(2, "0")}</span>
              <span className="skill-row__en" lang="en">
                {skill.en}
              </span>
              <span className="skill-row__text">{skill.text}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
