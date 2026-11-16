"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, type ReactNode } from "react";
import Icon from "@/components/ui/Icon";
import Logo from "@/components/ui/Logo";
import { useStudent } from "@/components/student/StudentProvider";
import { CONTACT_MESSAGES, whatsappLink } from "@/lib/site";

export default function StudentShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { profile, firstName, signOut } = useStudent();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const isLesson = pathname.startsWith("/videos/aula/");

  useEffect(() => {
    if (!isMenuOpen) {
      return;
    }
    const onPointer = (event: PointerEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsMenuOpen(false);
      }
    };
    window.addEventListener("pointerdown", onPointer);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("pointerdown", onPointer);
      window.removeEventListener("keydown", onKey);
    };
  }, [isMenuOpen]);

  const initial = (firstName || profile?.email || "A").charAt(0).toUpperCase();

  const links = [
    { href: "/videos", label: "Meus cursos", icon: "home" as const, active: pathname === "/videos" || isLesson },
    { href: "/perfil", label: "Perfil", icon: "user" as const, active: pathname === "/perfil" },
  ];

  return (
    <div className={`student ${isLesson ? "student--cinema" : ""}`}>
      <a className="skip-link" href="#area-conteudo">
        Pular para o conteúdo
      </a>
      <header className="student-bar">
        <div className="student-bar__inner">
          <Link href="/videos" className="student-bar__brand" aria-label="Área do aluno — início">
            <Logo tone={isLesson ? "light" : "dark"} compact />
            <span className="student-bar__label">Área do aluno</span>
          </Link>

          <nav className="student-bar__nav" aria-label="Área do aluno">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`student-bar__link ${link.active ? "is-active" : ""}`}
                aria-current={link.active ? "page" : undefined}
              >
                <Icon name={link.icon} size={18} />
                <span>{link.label}</span>
              </Link>
            ))}
            <a
              className="student-bar__link"
              href={whatsappLink(CONTACT_MESSAGES.support)}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Icon name="chat" size={18} />
              <span>Suporte</span>
            </a>
          </nav>

          <div className="student-bar__account" ref={menuRef}>
            <button
              type="button"
              className="student-bar__avatar"
              aria-haspopup="menu"
              aria-expanded={isMenuOpen}
              aria-label="Menu da conta"
              onClick={() => setIsMenuOpen((open) => !open)}
            >
              {initial}
            </button>
            {isMenuOpen ? (
              <div className="account-menu" role="menu">
                <div className="account-menu__head">
                  <p className="account-menu__name">{profile?.name || "Aluno HPE"}</p>
                  <p className="account-menu__email">{profile?.email}</p>
                </div>
                <Link href="/perfil" role="menuitem" className="account-menu__item" onClick={() => setIsMenuOpen(false)}>
                  <Icon name="user" size={18} />
                  Meu perfil
                </Link>
                <Link href="/" role="menuitem" className="account-menu__item" onClick={() => setIsMenuOpen(false)}>
                  <Icon name="globe" size={18} />
                  Site do HPE
                </Link>
                <button type="button" role="menuitem" className="account-menu__item" onClick={() => void signOut()}>
                  <Icon name="logout" size={18} />
                  Sair
                </button>
              </div>
            ) : null}
          </div>
        </div>
      </header>
      <div id="area-conteudo" className="student__content">
        {children}
      </div>
    </div>
  );
}
