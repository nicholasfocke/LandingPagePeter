import Icon from "@/components/ui/Icon";

export const FAQ_ITEMS = [
  {
    q: "O treinamento é individual ou corporativo?",
    a: "Os dois formatos existem. Os programas podem ser individuais ou em pequenos grupos, e as empresas contam com workshops de Business Skills (módulos de 4 ou 8 horas, em grupos de até 12 participantes), imersões e consultoria VIP.",
  },
  {
    q: "Preciso ter inglês avançado?",
    a: "Todo programa personalizado começa com uma avaliação de proficiência nas quatro habilidades — reading, writing, listening e speaking. O treinamento é construído a partir do seu nível atual e dos seus objetivos.",
  },
  {
    q: "O método é personalizado?",
    a: "Sim. Cada programa começa com uma análise de necessidades para identificar desafios, objetivos e as situações profissionais em que o inglês precisa funcionar. Conteúdos, cronograma e formato são definidos a partir dela.",
  },
  {
    q: "As aulas são online?",
    a: "As aulas podem ser presenciais ou online. O formato é definido na proposta personalizada.",
  },
  {
    q: "Como funciona o treinamento para empresas?",
    a: "O processo começa com a análise das necessidades da equipe. A partir dela, Peter propõe o formato mais adequado — workshops, imersão, programa contínuo ou consultoria VIP — com conteúdo, cronograma e investimento definidos na proposta.",
  },
  {
    q: "O HPE prepara profissionais para negociação internacional?",
    a: "Sim. Negociação com estrangeiros, apresentações, reuniões e liderança estão no centro do Business English do HPE, sempre aplicados às situações do seu mercado.",
  },
  {
    q: "Como funciona o curso digital?",
    a: "O curso digital reúne cinco módulos e cinco aulas bônus em vídeo, cada uma com material de apoio em PDF. Você estuda pela área do aluno, no seu ritmo.",
  },
  {
    q: "Como acesso as aulas depois da compra?",
    a: "Assim que o pagamento é confirmado, você recebe um e-mail com o link para criar sua senha (o link é válido por 1 hora). Depois, basta entrar na área do aluno com o e-mail usado na compra. Se o link expirar, use a opção “Esqueci minha senha” na página de login.",
  },
  {
    q: "Posso retomar os vídeos de onde parei?",
    a: "Sim. O progresso de cada aula é salvo na sua conta, então você retoma do ponto em que parou — inclusive em outro dispositivo. Suas anotações por aula também ficam salvas.",
  },
  {
    q: "Como funciona o suporte?",
    a: "O atendimento é feito pelo WhatsApp do HPE, tanto para dúvidas sobre os programas quanto para ajuda com a área do aluno.",
  },
];

export default function Faq() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ_ITEMS.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };

  return (
    <section className="section faq" id="faq" aria-labelledby="faq-title">
      <div className="container faq__inner">
        <div className="faq__intro">
          <p className="eyebrow" data-reveal>
            Perguntas frequentes
          </p>
          <h2 id="faq-title" className="section-title display" data-reveal style={{ ["--reveal-delay" as string]: 80 }}>
            Antes de <em>começar.</em>
          </h2>
        </div>
        <div className="faq__list">
          {FAQ_ITEMS.map((item) => (
            <details key={item.q} className="faq-item">
              <summary>
                <span>{item.q}</span>
                <span className="faq-item__icon" aria-hidden="true">
                  <Icon name="chevronDown" size={18} />
                </span>
              </summary>
              <div className="faq-item__answer">
                <p>{item.a}</p>
              </div>
            </details>
          ))}
        </div>
      </div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
    </section>
  );
}
