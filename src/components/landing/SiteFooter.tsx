import Link from "next/link";
import Icon from "@/components/ui/Icon";
import Logo from "@/components/ui/Logo";
import { CONTACT_MESSAGES, INSTAGRAM_URL, whatsappLink } from "@/lib/site";

export default function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="container site-footer__inner">
        <div className="site-footer__brand">
          <Logo tone="light" />
          <p>
            Business English e desenvolvimento de comunicação internacional para profissionais e
            empresas.
          </p>
        </div>

        <nav className="site-footer__col" aria-label="Rodapé — HPE">
          <p className="site-footer__heading">HPE</p>
          <Link href="/#metodo">Método</Link>
          <Link href="/#peter">Peter Focke</Link>
          <Link href="/#programas">Programas</Link>
          <Link href="/#depoimentos">Depoimentos</Link>
          <Link href="/#faq">Perguntas frequentes</Link>
        </nav>

        <nav className="site-footer__col" aria-label="Rodapé — Curso digital">
          <p className="site-footer__heading">Curso digital</p>
          <Link href="/#catalogo">Conhecer o curso</Link>
          <Link href="/login">Área do aluno</Link>
        </nav>

        <div className="site-footer__col">
          <p className="site-footer__heading">Contato</p>
          <a href={whatsappLink(CONTACT_MESSAGES.general)} target="_blank" rel="noopener noreferrer">
            <Icon name="whatsapp" size={16} />
            WhatsApp
          </a>
          <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer">
            <Icon name="instagram" size={16} />
            Instagram
          </a>
        </div>
      </div>
      <div className="container site-footer__bottom">
        <span>© {year} HPE Brazil — High Performance English.</span>
        <span>Atendendo profissionais no Brasil e no exterior.</span>
      </div>
    </footer>
  );
}
