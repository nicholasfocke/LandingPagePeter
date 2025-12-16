"use client";

import Link from "next/link";
import type { MouseEvent } from "react";
import "./site-header.css";

type SiteHeaderProps = {
  onSectionClick?: (
    event: MouseEvent<HTMLAnchorElement>,
    targetId: string
  ) => void;
};

const navigationLinks = [
  { label: "Início", href: "/#home", targetId: "#home" },
  { label: "Método", href: "/#metodo", targetId: "#metodo" },
  { label: "Serviços", href: "/#servicos", targetId: "#servicos" },
  { label: "Clientes", href: "/#clientes", targetId: "#clientes" },
  { label: "Testemunhos", href: "/#testemunhos", targetId: "#testemunhos" },
  { label: "Contato", href: "/#contato", targetId: "#contato" },
];

export default function SiteHeader({ onSectionClick }: SiteHeaderProps) {
  return (
    <header className="navbar">
      <span className="brand">HPE</span>
      <nav className="nav-links">
        {navigationLinks.map((link) => (
          <Link
            key={link.label}
            href={link.href}
            scroll={false}
            onClick={
              onSectionClick
                ? (event) => onSectionClick(event, link.targetId)
                : undefined
            }
          >
            {link.label}
          </Link>
        ))}
      </nav>
      <div className="auth-actions">
        <span className="auth-note">Já possui uma conta no curso?</span>
        <Link className="auth-button" href="/login">
          Fazer login
        </Link>
      </div>
    </header>
  );
}
