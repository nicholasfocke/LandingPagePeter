const SITUATIONS = [
  {
    en: "The board presentation",
    title: "Apresentar resultados para uma diretoria internacional",
    text: "Estruturar a mensagem, sustentar os números e responder perguntas sem perder o fio da apresentação.",
  },
  {
    en: "The negotiation table",
    title: "Negociar com um cliente estrangeiro",
    text: "Defender condições, conceder com critério e manter a relação comercial saudável.",
  },
  {
    en: "The strategy meeting",
    title: "Participar de uma reunião estratégica",
    text: "Entrar na discussão no momento certo, discordar com elegância e propor caminhos.",
  },
  {
    en: "The property tour",
    title: "Vender um imóvel para um comprador internacional",
    text: "Conduzir o atendimento do primeiro contato à visita, com vocabulário preciso.",
  },
  {
    en: "The pitch",
    title: "Defender uma proposta comercial",
    text: "Mostrar valor, antecipar objeções e conduzir o cliente para o próximo passo.",
  },
  {
    en: "The global team",
    title: "Liderar uma equipe multicultural",
    text: "Dar direção, feedback e contexto para pessoas de diferentes culturas.",
  },
];

export default function Situations() {
  return (
    <section className="section situations" id="situacoes" aria-labelledby="situacoes-title">
      <div className="container">
        <div className="section-head section-head--split">
          <div>
            <p className="eyebrow" data-reveal>
              Situações reais
            </p>
            <h2 id="situacoes-title" className="section-title display" data-reveal style={{ ["--reveal-delay" as string]: 80 }}>
              O inglês nas situações que <em>realmente importam.</em>
            </h2>
          </div>
          <p className="lead" data-reveal style={{ ["--reveal-delay" as string]: 160 }}>
            Não se trata de conjugar verbos. Trata-se de conduzir as conversas que definem
            contratos, carreiras e relações de negócio — com a segurança de quem domina o
            contexto.
          </p>
        </div>

        <ol className="situations__grid">
          {SITUATIONS.map((item, index) => (
            <li
              key={item.en}
              className="situation-card"
              data-reveal
              style={{ ["--reveal-delay" as string]: (index % 3) * 90 }}
            >
              <span className="situation-card__index">{String(index + 1).padStart(2, "0")}</span>
              <p className="situation-card__en" lang="en">
                {item.en}
              </p>
              <h3 className="situation-card__title">{item.title}</h3>
              <p className="situation-card__text">{item.text}</p>
              <span className="situation-card__line" aria-hidden="true" />
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
