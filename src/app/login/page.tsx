"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import PurchaseModal from "@/components/checkout/PurchaseModal";
import { useRouter } from "next/navigation";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import SiteHeader from "@/components/layout/SiteHeader";
import { auth, db, firebaseInitError } from "@/firebase/firebaseConfig";
import { getFirebaseMessage } from "@/firebase/firebaseErrors";
import "./page.css";

const loginHighlights = [
  "Acesse as aulas exclusivas compradas na landing page.",
  "Mantenha seu progresso salvo para retomar de onde parou.",
  "Receba novos módulos automaticamente assim que forem liberados.",
];

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isPurchaseModalOpen, setIsPurchaseModalOpen] = useState(false);
  const [isForgotModalOpen, setIsForgotModalOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotError, setForgotError] = useState("");
  const [forgotSuccess, setForgotSuccess] = useState("");
  const [isForgotLoading, setIsForgotLoading] = useState(false);

  useEffect(() => {
    const message = new URLSearchParams(window.location.search).get("error");

    if (message) {
      setError(message);
      return;
    }

    if (firebaseInitError) {
      setError(firebaseInitError);
    }
  }, []);

  useEffect(() => {
    if (!auth || !db) {
      return;
    }

    const authClient = auth;
    const dbClient = db;

    const unsubscribe = onAuthStateChanged(authClient, async (user) => {
      if (!user) {
        return;
      }

      try {
        const profileRef = doc(dbClient, "users", user.uid);
        const profileDoc = await getDoc(profileRef);

        if (!profileDoc.exists()) {
          await signOut(authClient);
          setError("Usuário autenticado, mas sem cadastro no banco (users/{uid}).");
          return;
        }

        router.replace("/videos");
      } catch (firebaseError) {
        setError(getFirebaseMessage(firebaseError));
      }
    });

    return () => unsubscribe();
  }, [router]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsLoading(true);

    if (!auth || !db) {
      setError(firebaseInitError || "Firebase indisponível no momento.");
      setIsLoading(false);
      return;
    }

    const authClient = auth;
    const dbClient = db;

    try {
      const credential = await signInWithEmailAndPassword(authClient, email, password);
      const profileRef = doc(dbClient, "users", credential.user.uid);
      const profileDoc = await getDoc(profileRef);

      if (!profileDoc.exists()) {
        await signOut(authClient);
        setError("Usuário autenticado, mas sem cadastro no banco (users/{uid}).");
        return;
      }

      router.replace("/videos");
    } catch (firebaseError) {
      setError(getFirebaseMessage(firebaseError));
    } finally {
      setIsLoading(false);
    }
  }

  async function handleForgotPassword(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setForgotError("");
    setForgotSuccess("");

    const normalizedEmail = forgotEmail.trim().toLowerCase();
    if (!normalizedEmail) {
      setForgotError("Informe seu e-mail para continuar.");
      return;
    }

    setIsForgotLoading(true);

    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: normalizedEmail }),
      });

      const payload = (await response.json()) as { error?: string };

      if (!response.ok) {
        setForgotError(payload.error ?? "Não foi possível enviar o e-mail agora.");
        return;
      }

      setForgotSuccess("Enviamos o link de redefinição para seu e-mail.");
      setForgotEmail("");
    } catch {
      setForgotError("Não foi possível enviar o e-mail agora.");
    } finally {
      setIsForgotLoading(false);
    }
  }

  return (
    <div className="page">
      <main className="card login-card">
        <SiteHeader onPurchaseClick={() => setIsPurchaseModalOpen(true)} />

        <section className="login-hero">
          <div className="login-copy">
            <p className="eyebrow">Área do aluno</p>
            <h1>Faça login para acessar seus vídeos</h1>
            <p className="login-description">
              Insira o e-mail utilizado na compra para entrar na plataforma e
              assistir às aulas liberadas para o seu plano.
            </p>
            <ul className="login-highlights">
              {loginHighlights.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <div className="login-actions">
              <button
                className="secondary-link"
                type="button"
                onClick={() => setIsPurchaseModalOpen(true)}
              >
                Quero comprar o curso
              </button>
              <Link className="text-link" href="/#catalogo">
                Ver catálogo de aulas
              </Link>
            </div>
          </div>

          <form className="login-form" onSubmit={handleSubmit}>
            <div className="form-field">
              <label htmlFor="email">E-mail</label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="seunome@email.com"
                autoComplete="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
              />
            </div>
            <div className="form-field">
              <label htmlFor="password">Senha</label>
              <div className="password-input-wrapper">
                <input
                  id="password"
                  name="password"
                  type={isPasswordVisible ? "text" : "password"}
                  placeholder="Digite sua senha"
                  autoComplete="current-password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  required
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setIsPasswordVisible((current) => !current)}
                  aria-label={isPasswordVisible ? "Ocultar senha" : "Mostrar senha"}
                  aria-pressed={isPasswordVisible}
                >
                  {isPasswordVisible ? (
                    <svg
                      className="password-toggle-icon"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                      focusable="false"
                    >
                      <path
                        d="M3.27 2 2 3.27l3 3A11.86 11.86 0 0 0 1 12s4 7 11 7a10.9 10.9 0 0 0 4.23-.85L20.73 22 22 20.73 3.27 2Zm8.01 8.01 2.71 2.71A3 3 0 0 1 11.28 10Zm-2.56.18A3 3 0 0 0 13.81 15Z"
                        fill="currentColor"
                      />
                      <path
                        d="M12 5a10.8 10.8 0 0 1 11 7 12.6 12.6 0 0 1-2.65 3.36l-1.42-1.42A9.1 9.1 0 0 0 20.78 12 8.92 8.92 0 0 0 12 7.06a9.1 9.1 0 0 0-2.27.29L8.11 5.73A11.2 11.2 0 0 1 12 5Z"
                        fill="currentColor"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="password-toggle-icon"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                      focusable="false"
                    >
                      <path
                        d="M12 5a10.8 10.8 0 0 1 11 7 10.8 10.8 0 0 1-11 7A10.8 10.8 0 0 1 1 12 10.8 10.8 0 0 1 12 5Zm0 2.06A8.92 8.92 0 0 0 3.22 12 8.92 8.92 0 0 0 12 16.94 8.92 8.92 0 0 0 20.78 12 8.92 8.92 0 0 0 12 7.06Z"
                        fill="currentColor"
                      />
                      <path
                        d="M12 8.5A3.5 3.5 0 1 1 8.5 12 3.5 3.5 0 0 1 12 8.5Zm0 2A1.5 1.5 0 1 0 13.5 12 1.5 1.5 0 0 0 12 10.5Z"
                        fill="currentColor"
                      />
                    </svg>
                  )}
                </button>
              </div>
            </div>
            <button className="primary-button" type="submit" disabled={isLoading}>
              {isLoading ? "Entrando..." : "Acessar área do aluno"}
            </button>
            <button
              type="button"
              className="forgot-password-button"
              onClick={() => {
                setIsForgotModalOpen(true);
                setForgotError("");
                setForgotSuccess("");
                setForgotEmail(email);
              }}
            >
              Esqueci minha senha
            </button>
            {error ? <p className="form-error">{error}</p> : null}
          </form>
        </section>
      </main>
      <PurchaseModal
        isOpen={isPurchaseModalOpen}
        onClose={() => setIsPurchaseModalOpen(false)}
      />

      {isForgotModalOpen ? (
        <div className="checkout-modal-overlay" role="presentation" onClick={() => setIsForgotModalOpen(false)}>
          <div className="checkout-modal" role="dialog" aria-modal="true" onClick={(event) => event.stopPropagation()}>
            <button
              type="button"
              className="checkout-modal-close"
              onClick={() => setIsForgotModalOpen(false)}
            >
              ×
            </button>
            <h2>Recuperar senha</h2>
            <p>Informe seu e-mail cadastrado para receber o link de redefinição.</p>

            <form className="checkout-modal-form" onSubmit={handleForgotPassword}>
              <label htmlFor="forgot-email">E-mail</label>
              <input
                id="forgot-email"
                type="email"
                value={forgotEmail}
                onChange={(event) => setForgotEmail(event.target.value)}
                required
                disabled={isForgotLoading}
              />
              <button className="primary-button" type="submit" disabled={isForgotLoading}>
                {isForgotLoading ? "Enviando..." : "Enviar link para redefinir senha"}
              </button>
              {forgotError ? <p className="form-error">{forgotError}</p> : null}
              {forgotSuccess ? <p className="form-success">{forgotSuccess}</p> : null}
            </form>
          </div>
        </div>
      ) : null}
    </div>
  );
}
