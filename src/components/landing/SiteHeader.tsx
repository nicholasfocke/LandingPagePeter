"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import Icon from "@/components/ui/Icon";
import Logo from "@/components/ui/Logo";
import { CONTACT_MESSAGES, whatsappLink } from "@/lib/site";

const NAV_LINKS = [
  { label: "Método", href: "/#metodo" },
  { label: "Peter Focke", href: "/#peter" },
  { label: "Programas", href: "/#programas" },
  { label: "Depoimentos", href: "/#depoimentos" },
  { label: "Curso digital", href: "/#catalogo" },
  { label: "FAQ", href: "/#faq" },
];

export default function SiteHeader() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!isMenuOpen) {
      return;
    }
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsMenuOpen(false);
      }
    };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isMenuOpen]);

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <header
      className={`site-header ${isScrolled ? "is-scrolled" : ""} ${isMenuOpen ? "is-open" : ""}`}
    >
      <div className="site-header__inner container">
        <Link href="/" className="site-header__brand" aria-label="HPE Brazil — página inicial">
          <Logo tone="light" />
        </Link>

        <nav className="site-header__nav" aria-label="Navegação principal">
          {NAV_LINKS.map((link) => (
            <Link key={link.href} href={link.href} className="site-header__link">
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="site-header__actions">
          <Link href="/login" className="site-header__student">
            <Icon name="user" size={16} />
            Área do aluno
          </Link>
          <a
            href={whatsappLink(CONTACT_MESSAGES.general)}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn--gold btn--sm site-header__cta"
          >
            Falar com Peter
          </a>
          <button
            type="button"
            className="site-header__toggle"
            aria-expanded={isMenuOpen}
            aria-controls="mobile-menu"
            aria-label={isMenuOpen ? "Fechar menu" : "Abrir menu"}
            onClick={() => setIsMenuOpen((open) => !open)}
          >
            <Icon name={isMenuOpen ? "close" : "menu"} size={22} />
          </button>
        </div>
      </div>

      <div id="mobile-menu" className="mobile-menu" hidden={!isMenuOpen}>
        <nav className="mobile-menu__nav" aria-label="Navegação principal (celular)">
          {NAV_LINKS.map((link, index) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={closeMenu}
              className="mobile-menu__link"
              style={{ animationDelay: `${60 + index * 40}ms` }}
            >
              {link.label}
              <Icon name="arrowRight" size={18} />
            </Link>
          ))}
        </nav>
        <div className="mobile-menu__footer">
          <a
            href={whatsappLink(CONTACT_MESSAGES.needsAnalysis)}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn--gold btn--lg btn--block"
            onClick={closeMenu}
          >
            Agendar uma análise de necessidades
          </a>
          <Link href="/login" className="btn btn--ghost-light btn--lg btn--block" onClick={closeMenu}>
            <Icon name="user" size={18} />
            Área do aluno
          </Link>
        </div>
      </div>
    </header>
  );
}
