import type { Metadata } from "next";
import Link from "next/link";
import AuthShell from "@/components/auth/AuthShell";
import Icon from "@/components/ui/Icon";
import { CONTACT_MESSAGES, whatsappLink } from "@/lib/site";

export const metadata: Metadata = {
  title: "Pagamento não concluído",
  robots: { index: false, follow: false },
};

export default function CheckoutCanceledPage() {
  return (
    <AuthShell>
      <div className="auth-card">
        <span className="auth-card__icon" aria-hidden="true">
          <Icon name="info" size={22} />
        </span>
        <h1 className="auth-card__title display">Pagamento não concluído.</h1>
        <p className="auth-card__text">
          Nenhuma cobrança foi realizada. Você pode tentar novamente quando quiser.
        </p>
        <Link href="/#catalogo" className="btn btn--primary btn--lg btn--block">
          Voltar ao curso digital
        </Link>
        <a
          className="btn btn--ghost btn--lg btn--block"
          href={whatsappLink(CONTACT_MESSAGES.general)}
          target="_blank"
          rel="noopener noreferrer"
        >
          Tirar dúvidas com Peter
        </a>
      </div>
    </AuthShell>
  );
}
