"use client";

import Link from "next/link";
import { FormEvent, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged, signInWithEmailAndPassword } from "firebase/auth";
import PasswordInput from "@/components/auth/PasswordInput";
import Icon from "@/components/ui/Icon";
import { auth, firebaseInitError } from "@/firebase/firebaseConfig";
import { getFirebaseMessage } from "@/firebase/firebaseErrors";
import { getSafeNext } from "@/lib/safeRedirect";
import { CONTACT_MESSAGES, whatsappLink } from "@/lib/site";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Apenas códigos conhecidos são exibidos — nada de texto arbitrário vindo da URL. */
const ERROR_CODES: Record<string, string> = {
  config: "O acesso está temporariamente indisponível. Tente novamente em instantes.",
  session: "Sua sessão expirou. Entre novamente para continuar.",
};

type View = "login" | "forgot";

export default function LoginForm() {
  const router = useRouter();
  const [view, setView] = useState<View>("login");
  const [nextPath, setNextPath] = useState("/videos");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailTouched, setEmailTouched] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isRedirecting, setIsRedirecting] = useState(false);

  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotError, setForgotError] = useState("");
  const [forgotSuccess, setForgotSuccess] = useState("");
  const [isForgotLoading, setIsForgotLoading] = useState(false);

  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setNextPath(getSafeNext(params.get("next")));

    const code = params.get("error");
    if (code && ERROR_CODES[code]) {
      setError(ERROR_CODES[code]);
    } else if (firebaseInitError) {
      setError(ERROR_CODES.config);
    }

    if (params.get("email")) {
      setEmail(params.get("email") ?? "");
    }
  }, []);

  useEffect(() => {
    if (!auth) {
      return;
    }
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsRedirecting(true);
        router.replace(getSafeNext(new URLSearchParams(window.location.search).get("next")));
      }
    });
    return () => unsubscribe();
  }, [router]);

  const hasSwitchedView = useRef(false);
  useEffect(() => {
    // Move o foco para o título apenas ao alternar login ⇄ recuperação.
    if (hasSwitchedView.current) {
      headingRef.current?.focus();
    }
    hasSwitchedView.current = true;
  }, [view]);

  const emailInvalid = emailTouched && email.length > 0 && !EMAIL_REGEX.test(email.trim());

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setEmailTouched(true);

    if (!EMAIL_REGEX.test(email.trim())) {
      setError("Informe um e-mail válido.");
      return;
    }
    if (!password) {
      setError("Informe sua senha.");
      return;
    }
    if (!auth) {
      setError(ERROR_CODES.config);
      return;
    }

    setIsLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
      setIsRedirecting(true);
      router.replace(nextPath);
    } catch (firebaseError) {
      setError(getFirebaseMessage(firebaseError));
      setIsLoading(false);
    }
  }

  async function handleForgotPassword(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setForgotError("");
    setForgotSuccess("");

    const normalizedEmail = forgotEmail.trim().toLowerCase();
    if (!EMAIL_REGEX.test(normalizedEmail)) {
      setForgotError("Informe o e-mail cadastrado.");
      return;
    }

    setIsForgotLoading(true);
    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: normalizedEmail }),
      });
      const payload = (await response.json().catch(() => ({}))) as { error?: string };

      if (!response.ok) {
        setForgotError(payload.error ?? "Não foi possível enviar o e-mail agora.");
        return;
      }

      setForgotSuccess(
        "Enviamos o link de redefinição para o seu e-mail. Ele é válido por 1 hora — confira também a caixa de spam."
      );
    } catch {
      setForgotError("Não foi possível enviar o e-mail agora. Verifique sua conexão.");
    } finally {
      setIsForgotLoading(false);
    }
  }

  if (view === "forgot") {
    return (
      <div className="auth-card" key="forgot">
        <button type="button" className="auth-card__back" onClick={() => setView("login")}>
          <Icon name="arrowLeft" size={16} />
          Voltar para o login
        </button>
        <span className="auth-card__icon" aria-hidden="true">
          <Icon name="key" size={22} />
        </span>
        <h1 className="auth-card__title display" ref={headingRef} tabIndex={-1}>
          Recuperar acesso
        </h1>
        <p className="auth-card__text">
          Informe o e-mail usado na compra. Enviaremos um link para você criar uma nova senha.
        </p>

        <form className="auth-card__form" onSubmit={handleForgotPassword} noValidate>
          <div className="field">
            <label className="field__label" htmlFor="forgot-email">
              E-mail
            </label>
            <input
              id="forgot-email"
              className="input"
              type="email"
              inputMode="email"
              autoComplete="email"
              placeholder="seunome@empresa.com"
              value={forgotEmail}
              onChange={(event) => setForgotEmail(event.target.value)}
              disabled={isForgotLoading}
              required
            />
          </div>

          <div aria-live="polite">
            {forgotError ? (
              <div className="alert alert--error" role="alert">
                <Icon name="alert" size={18} />
                <span>{forgotError}</span>
              </div>
            ) : null}
            {forgotSuccess ? (
              <div className="alert alert--success">
                <Icon name="checkCircle" size={18} />
                <span>{forgotSuccess}</span>
              </div>
            ) : null}
          </div>

          <button className="btn btn--primary btn--lg btn--block" type="submit" disabled={isForgotLoading}>
            {isForgotLoading ? (
              <>
                <span className="spinner" aria-hidden="true" />
                Enviando…
              </>
            ) : (
              "Enviar link de redefinição"
            )}
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="auth-card" key="login">
      <p className="eyebrow">Área do aluno</p>
      <h1 className="auth-card__title display" ref={headingRef} tabIndex={-1}>
        Bem-vindo de volta.
      </h1>
      <p className="auth-card__text">Entre com o e-mail usado na compra do curso.</p>

      <form className="auth-card__form" onSubmit={handleSubmit} noValidate>
        <div className="field">
          <label className="field__label" htmlFor="email">
            E-mail
          </label>
          <input
            id="email"
            name="email"
            className="input"
            type="email"
            inputMode="email"
            autoComplete="username"
            placeholder="seunome@empresa.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            onBlur={() => setEmailTouched(true)}
            aria-invalid={emailInvalid}
            aria-describedby={emailInvalid ? "email-error" : undefined}
            disabled={isLoading || isRedirecting}
            required
          />
          {emailInvalid ? (
            <span className="field__error" id="email-error">
              Confira o formato do e-mail.
            </span>
          ) : null}
        </div>

        <div className="field">
          <div className="field__label-row">
            <label className="field__label" htmlFor="password">
              Senha
            </label>
            <button
              type="button"
              className="auth-card__link"
              onClick={() => {
                setForgotEmail(email.trim());
                setForgotError("");
                setForgotSuccess("");
                setView("forgot");
              }}
            >
              Esqueci minha senha
            </button>
          </div>
          <PasswordInput
            id="password"
            name="password"
            autoComplete="current-password"
            placeholder="Sua senha"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            disabled={isLoading || isRedirecting}
            required
          />
        </div>

        <div aria-live="assertive">
          {error ? (
            <div className="alert alert--error" role="alert">
              <Icon name="alert" size={18} />
              <span>{error}</span>
            </div>
          ) : null}
        </div>

        <button
          className="btn btn--primary btn--lg btn--block"
          type="submit"
          disabled={isLoading || isRedirecting}
        >
          {isLoading || isRedirecting ? (
            <>
              <span className="spinner" aria-hidden="true" />
              {isRedirecting ? "Abrindo sua área…" : "Entrando…"}
            </>
          ) : (
            <>
              Entrar
              <Icon name="arrowRight" size={18} />
            </>
          )}
        </button>
      </form>

      <div className="auth-card__footer">
        <p>
          Comprou recentemente? Use o link enviado por e-mail para criar sua senha.
        </p>
        <p>
          Precisa de ajuda?{" "}
          <a
            className="text-link"
            href={whatsappLink(CONTACT_MESSAGES.support)}
            target="_blank"
            rel="noopener noreferrer"
          >
            Falar com o suporte
          </a>
        </p>
        <p className="auth-card__muted">
          Ainda não é aluno?{" "}
          <Link className="text-link" href="/#catalogo">
            Conheça o curso digital
          </Link>
        </p>
      </div>
    </div>
  );
}
