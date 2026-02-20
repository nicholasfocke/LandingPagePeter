"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "@/firebase/firebaseConfig";
import "./page.css";

const upcomingVideos = [
  { id: 1, title: "Introdução", status: "Disponível em breve", release: "Módulo 01" },
  {
    id: 2,
    title: "Primeiro contato em inglês",
    status: "Disponível em breve",
    release: "Módulo 02",
  },
  { id: 3, title: "Perguntas inteligentes", status: "Disponível em breve", release: "Módulo 03" },
  { id: 4, title: "Análise de necessidades", status: "Disponível em breve", release: "Módulo 04" },
  { id: 5, title: "Vocabulário Específico", status: "Disponível em breve", release: "Módulo 05" },
  {
    id: 6,
    title: "Apresentar imóveis e vocabulário no restaurante",
    status: "Disponível em breve",
    release: "Módulo 06",
  },
];

export default function VideosPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!auth || !db) {
      router.replace("/login?error=" + encodeURIComponent("Firebase não configurado."));
      return;
    }

    const authClient = auth;
    const dbClient = db;

    const unsubscribe = onAuthStateChanged(authClient, async (user) => {
      if (!user) {
        router.replace("/login");
        return;
      }

      try {
        const profileRef = doc(dbClient, "users", user.uid);
        const profileDoc = await getDoc(profileRef);

        if (!profileDoc.exists()) {
          await signOut(authClient);
          router.replace("/login");
          return;
        }

        setIsLoading(false);
      } catch {
        await signOut(authClient);
        router.replace(`/login?error=${encodeURIComponent("Sem permissão para ler users/{uid}.")}`);
      }
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
          <Link className="secondary-link" href="/perfil">
            Meu perfil
          </Link>
          <button className="primary-button" type="button" onClick={handleLogout}>
            Logout
          </button>
        </div>

        <section className="videos-hero">
          <div className="videos-hero-content">
            <p className="eyebrow">Área do aluno HPE</p>
            <h1>Biblioteca em preparação para lançamento</h1>
            <p>
              Os conteúdos estão sendo finalizados para garantir uma experiência premium.
              Os 6 primeiros módulos serão liberados em breve.
            </p>
          </div>
          <div className="videos-hero-badge">
            <strong>6</strong>
            <span>vídeos programados</span>
          </div>
        </section>

        <section className="videos-grid" aria-label="Próximos vídeos">
          {upcomingVideos.map((video) => (
            <article className="video-card" key={video.id}>
              <div className="video-card-top">
                <span className="video-module">{video.release}</span>
                <span className="video-chip">{video.status}</span>
              </div>
              <h2>{video.title}</h2>
              <p>Conteúdo desbloqueado automaticamente assim que o módulo for lançado.</p>
            </article>
          ))}
        </section>
      </main>
    </div>
  );
}
