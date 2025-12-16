import Link from "next/link";
import SiteHeader from "@/components/layout/SiteHeader";
import "./page.css";

const videoLibrary = [
  {
    title: "Domine reuniões estratégicas",
    description:
      "Técnicas para liderar calls e encontros com equipes globais sem perder clareza.",
    duration: "12 aulas • 2h40",
    status: "Disponível em breve",
  },
  {
    title: "Pitch e apresentações para investidores",
    description:
      "Estrutura de storytelling, vocabulário financeiro e frases-chave para pitch decks.",
    duration: "10 aulas • 2h10",
    status: "Disponível em breve",
  },
  {
    title: "Negociação avançada em inglês",
    description:
      "Modelos de negociação, âncoras e follow-up em um contexto internacional.",
    duration: "8 aulas • 1h50",
    status: "Disponível em breve",
  },
  {
    title: "Inglês para liderança e feedback",
    description:
      "Conduza 1:1s, feedbacks difíceis e alinhamento de expectativas com o time.",
    duration: "6 aulas • 1h15",
    status: "Disponível em breve",
  },
];

export default function VideosPage() {
  return (
    <div className="page">
      <main className="card videos-card">
        <SiteHeader />

        <section className="videos-hero">
          <div className="videos-copy">
            <p className="eyebrow">Biblioteca de aulas</p>
            <h1>Acesse os vídeos do seu curso</h1>
            <p className="videos-description">
              Assim que o pagamento for confirmado, os módulos adquiridos serão
              exibidos aqui. Você poderá retomar de onde parou e acompanhar o
              lançamento de novos conteúdos.
            </p>
            <div className="videos-actions">
              <Link className="secondary-link" href="/#servicos">
                Voltar para a landing page
              </Link>
              <Link className="text-link" href="/login">
                Sou aluno e quero fazer login
              </Link>
            </div>
          </div>
          <div className="status-card">
            <h3>Como o acesso funcionará?</h3>
            <ol>
              <li>Realize a compra pela landing page com Stripe.</li>
              <li>Crie sua senha e finalize o login.</li>
              <li>Acompanhe suas aulas e histórico de progresso por aqui.</li>
            </ol>
            <p className="status-note">
              Estamos preparando os vídeos. Você receberá um e-mail assim que
              eles forem publicados.
            </p>
          </div>
        </section>

        <section className="videos-grid">
          {videoLibrary.map((video) => (
            <article className="video-card" key={video.title}>
              <div className="video-chip">{video.status}</div>
              <h3>{video.title}</h3>
              <p>{video.description}</p>
              <div className="video-meta">{video.duration}</div>
              <button className="primary-button" type="button" disabled>
                Acessar aula
              </button>
            </article>
          ))}
        </section>
      </main>
    </div>
  );
}
