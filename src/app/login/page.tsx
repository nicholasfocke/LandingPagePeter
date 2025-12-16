import Link from "next/link";
import SiteHeader from "@/components/layout/SiteHeader";
import "./page.css";

const loginHighlights = [
  "Acesse as aulas exclusivas compradas na landing page.",
  "Mantenha seu progresso salvo para retomar de onde parou.",
  "Receba novos módulos automaticamente assim que forem liberados.",
];

export default function LoginPage() {
  return (
    <div className="page">
      <main className="card login-card">
        <SiteHeader />

        <section className="login-hero">
          <div className="login-copy">
            <p className="eyebrow">Área do aluno</p>
            <h1>Faça login para acessar seus vídeos</h1>
            <p className="login-description">
              Insira o e-mail utilizado na compra para entrar na plataforma e
              assistir às aulas liberadas para o seu plano.
            </p>
            <ul className="login-highlights">
              {loginHighlights.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <div className="login-actions">
              <Link className="secondary-link" href="/#contato">
                Quero comprar o curso
              </Link>
              <Link className="text-link" href="/videos">
                Ver catálogo de aulas
              </Link>
            </div>
          </div>

          <form className="login-form">
            <div className="form-field">
              <label htmlFor="email">E-mail</label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="seunome@email.com"
              />
            </div>
            <div className="form-field">
              <label htmlFor="password">Senha</label>
              <input
                id="password"
                name="password"
                type="password"
                placeholder="Digite sua senha"
              />
            </div>
            <button className="primary-button" type="button">
              Fazer login
            </button>
            <p className="form-note">
              Após a confirmação de pagamento pelo Stripe, seus vídeos serão
              liberados automaticamente nesta área.
            </p>
          </form>
        </section>
      </main>
    </div>
  );
}
