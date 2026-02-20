"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth, firebaseInitError } from "@/firebase/firebaseConfig";
import "./page.css";

export default function VideosPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [email, setEmail] = useState("");

  useEffect(() => {
    if (!auth) {
      router.replace("/login?error=" + encodeURIComponent(firebaseInitError || "Firebase não configurado."));
      return;
    }

    const authClient = auth;

    const unsubscribe = onAuthStateChanged(authClient, (user) => {
      if (!user) {
        router.replace("/login");
        return;
      }

      setEmail(user.email || "Não informado");
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  async function handleLogout() {
    if (!auth) {
      router.replace("/login");
      return;
    }

    await signOut(auth);
    router.replace("/login");
  }

  if (isLoading) {
    return (
      <div className="page">
        <main className="card videos-card">
          <p className="loading-message">Carregando sua área do aluno...</p>
        </main>
      </div>
    );
  }

  return (
    <div className="page">
      <main className="card videos-card">
        <div className="videos-top-actions">
          <a className="secondary-link" href="#perfil-usuario">
            Ver perfil do usuário
          </a>
          <button className="primary-button" type="button" onClick={handleLogout}>
            Logout
          </button>
        </div>

        <section className="videos-empty-state">
          <p className="eyebrow">Área do aluno HPE</p>
          <h1>Vídeos indisponíveis, lançamento do curso dia 16 de março.</h1>
        </section>

        <section className="profile-card" id="perfil-usuario">
          <h2>Perfil do usuário</h2>
          <p>
            <strong>E-mail:</strong> {email || "Não informado"}
          </p>
        </section>
      </main>
    </div>
  );
}
