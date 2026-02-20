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
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isPurchaseModalOpen, setIsPurchaseModalOpen] = useState(false);

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

  return (
    <div className="page">
      <main className="card login-card">
        <SiteHeader />

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
              <input
                id="password"
                name="password"
                type="password"
                placeholder="Digite sua senha"
                autoComplete="current-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
              />
            </div>
            <button className="primary-button" type="submit" disabled={isLoading}>
              {isLoading ? "Entrando..." : "Acessar área do aluno"}
            </button>
            {error ? <p className="form-error">{error}</p> : null}
          </form>
        </section>
      </main>
      <PurchaseModal
        isOpen={isPurchaseModalOpen}
        onClose={() => setIsPurchaseModalOpen(false)}
      />
    </div>
  );
}
