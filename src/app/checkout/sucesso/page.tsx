import type { Metadata } from "next";
import Link from "next/link";
import AuthShell from "@/components/auth/AuthShell";
import Icon from "@/components/ui/Icon";
import { CONTACT_MESSAGES, whatsappLink } from "@/lib/site";

export const metadata: Metadata = {
  title: "Pagamento confirmado",
  robots: { index: false, follow: false },
};

const NEXT_STEPS = [
  {
    icon: "mail" as const,
    title: "Verifique seu e-mail",
    text: "Em instantes você recebe o link para criar sua senha. Confira também a caixa de spam.",
  },
  {
    icon: "key" as const,
    title: "Crie sua senha",
    text: "O link é válido por 1 hora. Se expirar, use “Esqueci minha senha” no login.",
  },
  {
    icon: "play" as const,
    title: "Acesse as aulas",
    text: "Entre na área do aluno com o e-mail usado na compra.",
  },
];

export default function CheckoutSuccessPage() {
  return (
    <AuthShell
      asideTitle={
        <>
          Bem-vindo ao <em>HPE.</em>
        </>
      }
    >
      <div className="auth-card">
        <span className="auth-card__icon auth-card__icon--success" aria-hidden="true">
          <Icon name="check" size={26} strokeWidth={2.2} />
        </span>
        <h1 className="auth-card__title display">Pagamento confirmado.</h1>
        <p className="auth-card__text">
          Recebemos sua compra. Veja os próximos passos para acessar o curso.
        </p>
        <ol className="next-steps">
          {NEXT_STEPS.map((step, index) => (
            <li key={step.title}>
              <span className="next-steps__icon">
                <Icon name={step.icon} size={18} />
              </span>
              <div>
                <p className="next-steps__title">
                  {index + 1}. {step.title}
                </p>
                <p className="next-steps__text">{step.text}</p>
              </div>
            </li>
          ))}
        </ol>
        <Link href="/login" className="btn btn--primary btn--lg btn--block">
          Ir para a área do aluno
          <Icon name="arrowRight" size={18} />
        </Link>
        <div className="auth-card__footer">
          <p>
            Não recebeu o e-mail?{" "}
            <a
              className="text-link"
              href={whatsappLink(CONTACT_MESSAGES.support)}
              target="_blank"
              rel="noopener noreferrer"
            >
              Falar com o suporte
            </a>
          </p>
        </div>
      </div>
    </AuthShell>
  );
}
