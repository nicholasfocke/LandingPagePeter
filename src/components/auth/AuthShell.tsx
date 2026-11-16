import Link from "next/link";
import type { ReactNode } from "react";
import Icon from "@/components/ui/Icon";
import Logo from "@/components/ui/Logo";
import "./auth.css";

type AuthShellProps = {
  children: ReactNode;
  asideTitle?: ReactNode;
  asideItems?: string[];
};

const DEFAULT_ITEMS = [
  "Continue a aula exatamente de onde parou.",
  "Progresso e anotações sincronizados entre dispositivos.",
  "Material de apoio em PDF junto de cada aula.",
];

export default function AuthShell({
  children,
  asideTitle = (
    <>
      Seu espaço de estudo <em>HPE.</em>
    </>
  ),
  asideItems = DEFAULT_ITEMS,
}: AuthShellProps) {
  return (
    <div className="auth">
      <aside className="auth__aside">
        <div className="auth__aside-grid" aria-hidden="true" />
        <div className="auth__aside-glow" aria-hidden="true" />
        <Link href="/" className="auth__brand" aria-label="HPE Brazil — página inicial">
          <Logo tone="light" />
        </Link>
        <div className="auth__aside-body">
          <h2 className="auth__aside-title display">{asideTitle}</h2>
          <ul className="auth__aside-list">
            {asideItems.map((item) => (
              <li key={item}>
                <span className="auth__aside-check">
                  <Icon name="check" size={14} strokeWidth={2.2} />
                </span>
                {item}
              </li>
            ))}
          </ul>
        </div>
        <p className="auth__aside-footer" lang="en">
          High Performance English · Business English for professionals
        </p>
      </aside>

      <main className="auth__main">
        <div className="auth__mobile-brand">
          <Link href="/" aria-label="HPE Brazil — página inicial">
            <Logo tone="dark" />
          </Link>
        </div>
        <div className="auth__panel">{children}</div>
        <Link href="/" className="auth__back">
          <Icon name="arrowLeft" size={16} />
          Voltar ao site
        </Link>
      </main>
    </div>
  );
}
