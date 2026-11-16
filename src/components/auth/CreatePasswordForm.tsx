"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import PasswordInput from "@/components/auth/PasswordInput";
import Icon from "@/components/ui/Icon";
import { CONTACT_MESSAGES, whatsappLink } from "@/lib/site";

const RULES = [
  { id: "length", label: "Pelo menos 8 caracteres", test: (value: string) => value.length >= 8 },
  { id: "letter", label: "Ao menos uma letra", test: (value: string) => /[A-Za-z]/.test(value) },
  { id: "number", label: "Ao menos um número", test: (value: string) => /\d/.test(value) },
];

export default function CreatePasswordForm() {
  const [token, setToken] = useState<string | null>(null);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [confirmTouched, setConfirmTouched] = useState(false);
  const [error, setError] = useState("");
  const [requestId, setRequestId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    setToken(new URLSearchParams(window.location.search).get("token") ?? "");
  }, []);

  const passedRules = RULES.filter((rule) => rule.test(password)).length;
  const isStrong = passedRules === RULES.length;
  const mismatch = confirmTouched && confirmPassword.length > 0 && confirmPassword !== password;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setRequestId("");
    setConfirmTouched(true);

    if (!token) {
      setError("Link inválido ou incompleto.");
      return;
    }
    if (!isStrong) {
      setError("A senha deve ter ao menos 8 caracteres, com letras e números.");
      return;
    }
    if (password !== confirmPassword) {
      setError("As senhas não coincidem.");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("/api/auth/set-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });
      const payload = (await response.json().catch(() => ({}))) as {
        error?: string;
        requestId?: string;
      };

      if (!response.ok) {
        setError(payload.error ?? "Não foi possível definir a senha.");
        setRequestId(payload.requestId ?? "");
        return;
      }

      setIsDone(true);
      setPassword("");
      setConfirmPassword("");
    } catch {
      setError("Não foi possível definir a senha. Verifique sua conexão e tente novamente.");
    } finally {
      setIsLoading(false);
    }
  }

  if (token === null) {
    return (
      <div className="auth-card" aria-busy="true">
        <div className="skeleton" style={{ height: 28, width: "40%" }} />
        <div className="skeleton" style={{ height: 44, width: "80%", marginTop: 16 }} />
        <div className="skeleton" style={{ height: 52, marginTop: 28 }} />
        <div className="skeleton" style={{ height: 52, marginTop: 16 }} />
      </div>
    );
  }

  if (isDone) {
    return (
      <div className="auth-card auth-card--center">
        <span className="auth-card__icon auth-card__icon--success" aria-hidden="true">
          <Icon name="check" size={26} strokeWidth={2.2} />
        </span>
        <h1 className="auth-card__title display">Senha definida.</h1>
        <p className="auth-card__text">
          Tudo pronto. Agora é só entrar na área do aluno com o seu e-mail e a nova senha.
        </p>
        <Link href="/login" className="btn btn--primary btn--lg btn--block">
          Entrar na área do aluno
          <Icon name="arrowRight" size={18} />
        </Link>
      </div>
    );
  }

  if (!token) {
    return (
      <div className="auth-card">
        <span className="auth-card__icon" aria-hidden="true">
          <Icon name="alert" size={22} />
        </span>
        <h1 className="auth-card__title display">Link incompleto</h1>
        <p className="auth-card__text">
          Abra o link exatamente como recebido por e-mail. Se ele expirou, solicite um novo na
          página de login, em “Esqueci minha senha”.
        </p>
        <Link href="/login" className="btn btn--primary btn--lg btn--block">
          Ir para o login
        </Link>
      </div>
    );
  }

  const tokenProblem = /token/i.test(error);

  return (
    <div className="auth-card">
      <p className="eyebrow">Acesso ao curso</p>
      <h1 className="auth-card__title display">Crie sua senha.</h1>
      <p className="auth-card__text">
        Defina a senha que você usará para entrar na área do aluno.
      </p>

      <form className="auth-card__form" onSubmit={handleSubmit} noValidate>
        <div className="field">
          <label className="field__label" htmlFor="password">
            Nova senha
          </label>
          <PasswordInput
            id="password"
            autoComplete="new-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            aria-describedby="password-rules"
            disabled={isLoading}
            required
          />
          <ul className="password-rules" id="password-rules" aria-label="Requisitos da senha">
            {RULES.map((rule) => {
              const ok = rule.test(password);
              return (
                <li key={rule.id} className={ok ? "is-ok" : ""}>
                  <Icon name={ok ? "checkCircle" : "info"} size={14} />
                  {rule.label}
                  <span className="sr-only">{ok ? " — atendido" : " — pendente"}</span>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="field">
          <label className="field__label" htmlFor="confirm-password">
            Confirmar senha
          </label>
          <PasswordInput
            id="confirm-password"
            autoComplete="new-password"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            onBlur={() => setConfirmTouched(true)}
            aria-invalid={mismatch}
            aria-describedby={mismatch ? "confirm-error" : undefined}
            disabled={isLoading}
            required
          />
          {mismatch ? (
            <span className="field__error" id="confirm-error">
              As senhas não coincidem.
            </span>
          ) : null}
        </div>

        <div aria-live="assertive">
          {error ? (
            <div className="alert alert--error" role="alert">
              <Icon name="alert" size={18} />
              <span>
                {error}
                {tokenProblem ? (
                  <>
                    {" "}
                    Solicite um novo link em{" "}
                    <Link href="/login" className="text-link">
                      Esqueci minha senha
                    </Link>
                    .
                  </>
                ) : null}
                {requestId ? <span className="alert__code"> Código: {requestId}</span> : null}
              </span>
            </div>
          ) : null}
        </div>

        <button className="btn btn--primary btn--lg btn--block" type="submit" disabled={isLoading}>
          {isLoading ? (
            <>
              <span className="spinner" aria-hidden="true" />
              Salvando…
            </>
          ) : (
            "Salvar senha"
          )}
        </button>
      </form>

      <div className="auth-card__footer">
        <p>
          Problemas com o link?{" "}
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
  );
}
