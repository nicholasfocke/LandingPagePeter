"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback } from "react";
import type { MouseEvent } from "react";
import "./page.css";

export default function Home() {
  const handleSmoothScroll = useCallback(
    (event: MouseEvent<HTMLAnchorElement>, target: string) => {
      event.preventDefault();

      const element = document.querySelector(target);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
        window.history.pushState(null, "", target);
      }
    },
    []
  );

  return (
    <div className="page">
      <main className="card">
        <header className="navbar">
          <span className="brand">HPE</span>
          <nav className="nav-links">
            <Link
              href="#home"
              scroll={false}
              onClick={(event) => handleSmoothScroll(event, "#home")}
            >
              Início
            </Link>
            <Link
              href="#metodo"
              scroll={false}
              onClick={(event) => handleSmoothScroll(event, "#metodo")}
            >
              Método
            </Link>
            <Link
              href="#servicos"
              scroll={false}
              onClick={(event) => handleSmoothScroll(event, "#servicos")}
            >
              Serviços
            </Link>
            <Link
              href="#clientes"
              scroll={false}
              onClick={(event) => handleSmoothScroll(event, "#clientes")}
            >
              Clientes
            </Link>
            <Link
              href="#testemunhos"
              scroll={false}
              onClick={(event) => handleSmoothScroll(event, "#testemunhos")}
            >
              Testemunhos
            </Link>
            <Link
              href="#contato"
              scroll={false}
              onClick={(event) => handleSmoothScroll(event, "#contato")}
            >
              Contato
            </Link>
          </nav>
        </header>

        <section className="hero" id="home">
          <div className="hero-content">
            <p className="hero-subtitle">High Performance English</p>
            <h1 className="hero-title">
              Inglês de alto desempenho para profissionais de alta performance
            </h1>
            <p className="hero-description">
              Método exclusivo criado por Peter Focke para CEOs, executivos e
              empreendedores que precisam negociar, apresentar e liderar em
              inglês sem perder tempo com conteúdos genéricos.
            </p>
            <div className="hero-highlights">
              <div className="hero-highlight">Análise completa das suas necessidades</div>
              <div className="hero-highlight">Treinamento personalizado e focado em resultados</div>
              <div className="hero-highlight">Domine apresentações, reuniões e negociações em inglês</div>
            </div>
            <div className="hero-actions">
              <Link
                className="hero-button"
                href="https://api.whatsapp.com/send/?phone=5582999214182"
                target="_blank"
                rel="noopener noreferrer"
              >
                Fale com Peter
              </Link>
              <span className="hero-location">Atendendo líderes no Brasil e no exterior</span>
            </div>
          </div>
          <div className="hero-image">
            <div className="hero-portrait">
              <Image
                src="/images/peter.png"
                alt="Peter Focke"
                width={560}
                height={725}
                priority
              />
            </div>
          </div>
        </section>

        <section className="section" id="metodo">
          <div className="section-intro">
            <h2 className="section-title">O que é o método HPE?</h2>
            <p className="section-description">
              HPE – High Performance English é o Rolls Royce do treinamento de
              inglês para negócios. Cada programa começa com uma análise profunda
              das demandas do cliente para construir módulos totalmente
              personalizados, 100% focados nas situações de alto impacto que você
              vivencia no dia a dia.
            </p>
          </div>
          <div className="feature-grid">
            <div className="feature-card">
              <h3>Diagnóstico preciso</h3>
              <p>
                Avaliação inicial detalhada para identificar dores, objetivos e
                momentos críticos da sua rotina profissional.
              </p>
            </div>
            <div className="feature-card">
              <h3>Conteúdo sob medida</h3>
              <p>
                Módulos personalizados que desenvolvem as competências mais
                importantes para você apresentar, negociar e liderar em inglês.
              </p>
            </div>
            <div className="feature-card">
              <h3>Resultados acelerados</h3>
              <p>
                Treinamento intensivo, focado em desempenho e imediatamente
                aplicável às suas reuniões, viagens e negociações.
              </p>
            </div>
          </div>
        </section>

        <section className="split-section">
          <div className="split-copy">
            <h2>Por que o HPE é diferente?</h2>
            <p>
              Os clientes de Peter permanecem por anos porque percebem progresso
              imediato e sustentado. Após o treinamento, executivos conseguem
              apresentar, negociar, participar de reuniões complexas e discutir
              assuntos estratégicos em inglês com confiança.
            </p>
          </div>
          <ul className="split-list">
            <li>Anos de experiência treinando líderes em empresas globais.</li>
            <li>Metodologia exclusiva criada para profissionais de alta performance.</li>
            <li>Aulas individuais ou em pequenos grupos, presenciais ou online.</li>
            <li>Foco total em Business English e situações reais do seu mercado.</li>
          </ul>
        </section>

        <section className="section" id="clientes">
          <div className="section-intro">
            <h2 className="section-title">Quem confia no HPE?</h2>
            <p className="section-description">
              CEOs, empreendedores e especialistas de empresas nacionais e
              multinacionais. Entre os clientes atendidos estão RE/MAX, Nestlé,
              IBM, EY, GE, Janssen, AstraZeneca, Sanofi, Roche, Trakto, Voltalia,
              Vivendi, AbbVie e muitos outros.
            </p>
          </div>
          <div className="client-grid">
            <div className="client-card">
              <h3>Profissionais atendidos</h3>
              <p>
                Executivos C-level, empreendedores, especialistas em TI,
                engenheiros, marketeiros, advogados, médicos, corretores de
                imóveis, professores universitários e mais.
              </p>
            </div>
            <div className="client-card">
              <h3>Presença internacional</h3>
              <p>
                Programas ativos em Maceió, São Paulo, Florianópolis, Porto
                Alegre, Salvador, Campinas, Rio Verde, Lisboa, Hamburgo,
                Vancouver e Miami.
              </p>
            </div>
            <div className="client-card">
              <h3>Histórias reais</h3>
              <p>
                Peixoto, Eduardo, Paulo, Hugo, Carol e dezenas de líderes elevam
                suas carreiras ao dominar o inglês corporativo com Peter.
              </p>
            </div>
          </div>
        </section>

        <section className="section" id="servicos">
          <div className="section-intro">
            <h2 className="section-title">Serviços e experiências exclusivas</h2>
            <p className="section-description">
              Escolha o formato ideal para o seu momento. Todos os programas são
              personalizados, com foco prático e conduzidos pessoalmente por
              Peter Focke.
            </p>
          </div>
          <div className="services-grid">
            <article className="service-card">
              <span className="service-chip">Programa assinatura</span>
              <h3>Curso completo de Business English</h3>
              <p>
                Desenvolvimento contínuo das habilidades essenciais: apresentações,
                negociação, liderança, reuniões e trabalho em equipe em inglês.
              </p>
            </article>
            <article className="service-card">
              <span className="service-chip">Pista acelerada</span>
              <h3>Preparatórios TOEFL &amp; IELTS</h3>
              <p>
                Plano de estudo orientado pelos resultados do seu diagnóstico para
                evoluir rapidamente em reading, writing, listening e speaking.
              </p>
            </article>
            <article className="service-card">
              <span className="service-chip">Turma imersiva</span>
              <h3>Imersão em Business English</h3>
              <p>
                Quatro encontros intensivos em dois fins de semana (24 horas) para
                acelerar sua fluência sem sair do país. 
              </p>
            </article>
            <article className="service-card">
              <span className="service-chip">Mercado global</span>
              <h3>Vendas de imóveis em inglês</h3>
              <p>
                2 módulos para corretores atuarem em transações
                internacionais: vocabulário técnico, negociação e condução de
                clientes estrangeiros.
              </p>
            </article>
            <article className="service-card">
              <span className="service-chip">Workshops táticos</span>
              <h3>Workshops de Business Skills</h3>
              <p>
                Módulos de 4 ou 8 horas em grupos de até 12 participantes focados
                em apresentação, negociação com estrangeiros e liderança.
              </p>
            </article>
            <article className="service-card">
              <span className="service-chip">Consultoria VIP</span>
              <h3>VIP Consultoria</h3>
              <p>
                Atendimento premium para empresas e executivos que precisam de um
                especialista para preparar apresentações, negociações e agendas em
                inglês.
              </p>
            </article>
          </div>
        </section>

        <section className="section section-alt">
          <div className="section-intro">
            <h2 className="section-title">Como cada programa é estruturado</h2>
            <p className="section-description">
              Um processo claro garante que você saiba exatamente o que esperar e
              como será acompanhado em cada etapa do treinamento.
            </p>
          </div>
          <div className="steps-grid">
            <div className="step-card">
              <span className="step-number">01</span>
              <h3>Análise de necessidades</h3>
              <p>
                Identificamos dores, desafios e objetivos do cliente ou da equipe
                para definir as prioridades do programa.
              </p>
            </div>
            <div className="step-card">
              <span className="step-number">02</span>
              <h3>Avaliação de proficiência</h3>
              <p>
                Exame detalhado do nível de inglês e das quatro habilidades:
                reading, writing, listening e speaking.
              </p>
            </div>
            <div className="step-card">
              <span className="step-number">03</span>
              <h3>Proposta personalizada</h3>
              <p>
                Definição de conteúdos, cronograma, formato das aulas e
                investimento, com acompanhamento contínuo dos resultados.
              </p>
            </div>
          </div>
        </section>

        <section className="bio-section" id="sobre">
          <div className="bio-copy">
            <h2>Quem está à frente do HPE?</h2>
            <p>
              Peter Focke nasceu em Bremerhaven, Alemanha, é pedagogo pela
              Universidade de Bremen e certificado pela Universidade de Cambridge
              e pela Câmara de Comércio e Indústria de Londres. Atuou em diversos
              países europeus em posições de liderança antes de se estabelecer no
              Brasil em 1997.
            </p>
            <p>
              Com mais de 30 anos de experiência, já treinou mais de 1300
              profissionais brasileiros, preparou executivos para TOEFL e IELTS e
              conduziu workshops e consultorias para empresas como RE/MAX,
              Nestlé, IBM, EY, GE, Janssen, AstraZeneca, Sanofi, Roche, Trakto e
              muitas outras.
            </p>
            <p>
              Seu propósito é ajudar líderes a conduzir negócios em inglês com
              confiança, performance e naturalidade, por meio do método High
              Performance English.
            </p>
          </div>
          <div className="bio-highlight">
            <div className="stat-card">
              <span className="stat-number">+30</span>
              <span className="stat-label">anos de experiência</span>
            </div>
            <div className="stat-card">
              <span className="stat-number">+1300</span>
              <span className="stat-label">profissionais treinados</span>
            </div>
            <div className="stat-card">
              <span className="stat-number">+20</span>
              <span className="stat-label">nacionalidades atendidas</span>
            </div>
          </div>
        </section>

        <section className="section" id="testemunhos">
          <div className="section-intro">
            <h2 className="section-title">Testemunhos em vídeo</h2>
            <p className="section-description">
              Assista aos depoimentos de clientes que transformaram sua atuação
              profissional em inglês com o HPE.
            </p>
          </div>
          <div className="testimonial-grid">
            {[
              { name: "Eduardo Acioli", file: "Eduardo acioli.mp4" },
              { name: "Gerard", file: "gerard.mp4" },
              { name: "Hugo", file: "hugo .mp4" },
              { name: "João Marcelo Lyra", file: "Joao marcelo lyra.mp4" },
              { name: "Lucas", file: "Lucas.mp4" },
              { name: "Paulo Toledo", file: "paulo toledo.mp4" },
              { name: "Rodrigo Coifman", file: "Rodrigo coifman.mp4" },
            ].map((testimonial) => (
              <div className="testimonial-card" key={testimonial.file}>
                <video
                  className="testimonial-video"
                  controls
                  preload="metadata"
                  src={`/videos/${encodeURIComponent(testimonial.file)}`}
                >
                  Seu navegador não suporta a reprodução de vídeo.
                </video>
                <div>
                  <h3>{testimonial.name}</h3>
                  <p className="file-name">Arquivo: {testimonial.file}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="contact-card" id="contato">
          <div className="contact-text">
            <h4>Pronto para elevar seu inglês de negócios?</h4>
            <p>
              Agende uma conversa para receber uma análise personalizada e um
              plano sob medida para as suas metas profissionais.
            </p>
          </div>
          <a
            className="contact-button"
            href="https://api.whatsapp.com/send/?phone=5582999214182"
            target="_blank"
            rel="noopener noreferrer"
          >
            Fale com Peter
          </a>
        </section>
      </main>
    </div>
  );
}
