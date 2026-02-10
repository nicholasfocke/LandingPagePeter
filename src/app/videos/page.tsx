import Link from "next/link";
import SiteHeader from "@/components/layout/SiteHeader";
import "./page.css";

const quickStats = [
  { label: "Carga horária total", value: "24h de conteúdo" },
  { label: "Aulas disponíveis hoje", value: "32 aulas" },
  { label: "Novos módulos", value: "Atualizações quinzenais" },
];

const studyTracks = [
  {
    title: "Trilha 01 · Comunicação executiva",
    description:
      "Aulas para reuniões estratégicas, apresentações e posicionamento com clareza em inglês.",
    lessons: [
      "Como abrir reuniões internacionais com autoridade",
      "Vocabulário de negócios para alinhamento de metas",
      "Estrutura de apresentação para board e investidores",
    ],
  },
  {
    title: "Trilha 02 · Negociação e vendas",
    description:
      "Conteúdo para conduzir objeções, defender propostas e fechar acordos com confiança.",
    lessons: [
      "Framework de negociação com clientes globais",
      "Como defender preço e margem em inglês",
      "Follow-up profissional que acelera decisões",
    ],
  },
  {
    title: "Trilha 03 · Liderança internacional",
    description:
      "Desenvolva linguagem de liderança para feedback, gestão de times e tomada de decisão.",
    lessons: [
      "Feedback difícil sem ruído cultural",
      "Rituais de gestão para times remotos",
      "Inglês para liderança em cenários de alta pressão",
    ],
  },
];

const featuredVideos = [
  { title: "Abertura de calls estratégicas", src: "/videos/Lucas.mp4" },
  { title: "Negociação em reuniões críticas", src: "/videos/paulo toledo.mp4" },
  { title: "Comunicação para liderança", src: "/videos/Rodrigo coifman.mp4" },
];

export default function VideosPage() {
  return (
    <div className="page">
      <main className="card videos-card">
        <SiteHeader />

        <section className="videos-hero">
          <div className="videos-hero-copy">
            <p className="eyebrow">Área do aluno HPE</p>
            <h1>Seu ambiente de estudos para evoluir o inglês de alta performance</h1>
            <p>
              Após a compra do curso, esta é a página onde você acompanha as
              aulas liberadas, revisa conteúdos estratégicos e organiza sua
              rotina de evolução com foco no que gera resultado real no seu
              contexto profissional.
            </p>
            <div className="videos-hero-actions">
              <Link href="/#contato" className="primary-link">
                Falar com suporte acadêmico
              </Link>
              <Link href="/#catalogo" className="secondary-link">
                Ver catálogo na landing page
              </Link>
            </div>
          </div>

          <aside className="stats-panel" aria-label="Resumo da plataforma do aluno">
            <h2>Visão geral da plataforma</h2>
            <ul>
              {quickStats.map((stat) => (
                <li key={stat.label}>
                  <span>{stat.label}</span>
                  <strong>{stat.value}</strong>
                </li>
              ))}
            </ul>
          </aside>
        </section>

        <section className="tracks-section">
          <div className="section-heading">
            <h2>Trilhas recomendadas para acelerar seu progresso</h2>
            <p>
              Conteúdo dividido por objetivos para facilitar sua rotina de
              estudos e aplicação imediata em reuniões, negociações e liderança.
            </p>
          </div>

          <div className="tracks-grid">
            {studyTracks.map((track) => (
              <article key={track.title} className="track-card">
                <h3>{track.title}</h3>
                <p>{track.description}</p>
                <ul>
                  {track.lessons.map((lesson) => (
                    <li key={lesson}>{lesson}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>

        <section className="video-library" id="biblioteca-aulas">
          <div className="section-heading">
            <h2>Aulas já disponíveis para assistir</h2>
            <p>
              Estrutura desenhada para facilitar estudo contínuo e revisão
              rápida dos temas mais importantes para sua rotina profissional.
            </p>
          </div>

          <div className="video-grid">
            {featuredVideos.map((video) => (
              <article key={video.title} className="video-card">
                <video controls preload="metadata">
                  <source src={video.src} type="video/mp4" />
                  Seu navegador não suporta reprodução de vídeo.
                </video>
                <h3>{video.title}</h3>
              </article>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
