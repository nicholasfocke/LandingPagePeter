"use client";

import Link from "next/link";
import { useState } from "react";
import Icon from "@/components/ui/Icon";
import { useStudent } from "@/components/student/StudentProvider";
import { summarizeCourse } from "@/lib/course/progress";
import { CONTACT_MESSAGES, whatsappLink } from "@/lib/site";

export default function PerfilPage() {
  const { status, profile, firstName, hasAccess, progressById, signOut } = useStudent();
  const [resetState, setResetState] = useState<"idle" | "sending" | "sent" | "error">("idle");

  if (status === "loading") {
    return (
      <div className="profile container-student" aria-busy="true">
        <div className="skeleton" style={{ height: 120, borderRadius: 28 }} />
        <div className="skeleton" style={{ height: 240, borderRadius: 28, marginTop: 20 }} />
      </div>
    );
  }

  const summary = summarizeCourse(progressById);
  const initial = (firstName || profile?.email || "A").charAt(0).toUpperCase();

  async function requestPasswordReset() {
    if (!profile?.email) {
      return;
    }
    setResetState("sending");
    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: profile.email }),
      });
      setResetState(response.ok ? "sent" : "error");
    } catch {
      setResetState("error");
    }
  }

  return (
    <div className="profile container-student">
      <header className="profile__hero">
        <span className="profile__avatar" aria-hidden="true">
          {initial}
        </span>
        <div>
          <p className="eyebrow">Meu perfil</p>
          <h1 className="profile__name display">{profile?.name || "Aluno HPE"}</h1>
          <p className="profile__email">{profile?.email}</p>
        </div>
      </header>

      <div className="profile__grid">
        <section className="profile-card" aria-labelledby="dados-title">
          <h2 id="dados-title" className="profile-card__title">
            Dados da conta
          </h2>
          <dl className="profile-card__list">
            <div>
              <dt>Nome completo</dt>
              <dd>{profile?.name || "Não informado"}</dd>
            </div>
            <div>
              <dt>E-mail de acesso</dt>
              <dd>{profile?.email || "Não informado"}</dd>
            </div>
            <div>
              <dt>Telefone</dt>
              <dd>{profile?.phone || "Não informado"}</dd>
            </div>
            <div>
              <dt>Acesso ao curso digital</dt>
              <dd>
                {hasAccess ? (
                  <span className="chip chip--success">
                    <Icon name="check" size={12} strokeWidth={2.4} />
                    Ativo
                  </span>
                ) : (
                  <span className="chip chip--locked">
                    <Icon name="lock" size={12} />
                    Não ativo
                  </span>
                )}
              </dd>
            </div>
          </dl>
          <p className="profile-card__hint">
            Para alterar seus dados cadastrais, fale com o{" "}
            <a className="text-link" href={whatsappLink(CONTACT_MESSAGES.support)} target="_blank" rel="noopener noreferrer">
              suporte
            </a>
            .
          </p>
        </section>

        <div className="profile__side">
          <section className="profile-card" aria-labelledby="estudo-title">
            <h2 id="estudo-title" className="profile-card__title">
              Seu estudo
            </h2>
            <p className="profile-card__big">
              <strong className="display">{summary.completed}</strong> de {summary.total} aulas concluídas
            </p>
            <div className="progress" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(summary.ratio * 100)} aria-label="Progresso no curso">
              <span className="progress__bar" style={{ ["--value" as string]: summary.ratio }} />
            </div>
            <Link className="btn btn--primary btn--sm" href="/videos">
              Ir para as aulas
              <Icon name="arrowRight" size={16} />
            </Link>
          </section>

          <section className="profile-card" aria-labelledby="seguranca-title">
            <h2 id="seguranca-title" className="profile-card__title">
              Segurança
            </h2>
            <p className="profile-card__text">
              Enviaremos um link para {profile?.email || "seu e-mail"} para você definir uma nova senha.
            </p>
            <div aria-live="polite">
              {resetState === "sent" ? (
                <div className="alert alert--success">
                  <Icon name="checkCircle" size={18} />
                  <span>Link enviado. Ele é válido por 1 hora.</span>
                </div>
              ) : resetState === "error" ? (
                <div className="alert alert--error" role="alert">
                  <Icon name="alert" size={18} />
                  <span>Não foi possível enviar agora. Tente novamente.</span>
                </div>
              ) : null}
            </div>
            <div className="profile-card__actions">
              <button
                type="button"
                className="btn btn--ghost btn--sm"
                onClick={() => void requestPasswordReset()}
                disabled={resetState === "sending" || !profile?.email}
              >
                {resetState === "sending" ? <span className="spinner" aria-hidden="true" /> : <Icon name="key" size={16} />}
                Redefinir senha
              </button>
              <button type="button" className="btn btn--ghost btn--sm" onClick={() => void signOut()}>
                <Icon name="logout" size={16} />
                Sair da conta
              </button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
