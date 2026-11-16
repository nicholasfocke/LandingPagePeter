const COMPANIES = [
  "RE/MAX",
  "Nestlé",
  "IBM",
  "EY",
  "GE",
  "Janssen",
  "AstraZeneca",
  "Sanofi",
  "Roche",
  "Trakto",
  "Voltalia",
  "Vivendi",
  "AbbVie",
];

const CITIES = [
  "Maceió",
  "São Paulo",
  "Florianópolis",
  "Porto Alegre",
  "Salvador",
  "Campinas",
  "Rio Verde",
  "Lisboa",
  "Hamburgo",
  "Vancouver",
  "Miami",
];

export default function Clients() {
  return (
    <section className="section clients" id="clientes" aria-labelledby="clientes-title">
      <div className="container">
        <div className="section-head section-head--center">
          <p className="eyebrow" data-reveal>
            Empresas e profissionais atendidos
          </p>
          <h2 id="clientes-title" className="section-title display" data-reveal style={{ ["--reveal-delay" as string]: 80 }}>
            Da startup à <em>multinacional.</em>
          </h2>
          <p className="lead" data-reveal style={{ ["--reveal-delay" as string]: 160 }}>
            CEOs, empreendedores e especialistas de empresas nacionais e multinacionais já
            treinaram com o HPE.
          </p>
        </div>

        <div className="clients__marquee" data-reveal="fade">
          <ul className="clients__track" aria-label="Empresas cujos profissionais foram atendidos">
            {COMPANIES.map((company) => (
              <li key={company}>{company}</li>
            ))}
          </ul>
          <ul className="clients__track" aria-hidden="true">
            {COMPANIES.map((company) => (
              <li key={company}>{company}</li>
            ))}
          </ul>
        </div>
        <p className="clients__disclaimer">
          Empresas citadas como referência de profissionais e equipes já atendidos pelo HPE. A
          menção não representa parceria comercial ou endosso.
        </p>

        <div className="clients__facts">
          <article className="clients__fact" data-reveal>
            <h3>Profissionais atendidos</h3>
            <p>
              Executivos C-level, empreendedores, especialistas em TI, engenheiros, profissionais
              de marketing, advogados, médicos, corretores de imóveis, professores universitários
              e mais.
            </p>
          </article>
          <article className="clients__fact" data-reveal style={{ ["--reveal-delay" as string]: 100 }}>
            <h3>Presença internacional</h3>
            <ul className="clients__cities">
              {CITIES.map((city) => (
                <li key={city}>{city}</li>
              ))}
            </ul>
          </article>
        </div>
      </div>
    </section>
  );
}
