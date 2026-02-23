"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged, signOut } from "firebase/auth";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import { auth, db } from "@/firebase/firebaseConfig";
import "./page.css";

type VideoItem = {
  id: string;
  title: string;
  status: string;
  release: string;
  durationMinutes: number;
};

type VideoProgressState = {
  watchedMinutes: number;
  notes: string;
};

const upcomingVideos: VideoItem[] = [
  {
    id: "module-01",
    title: "Introdução",
    status: "Disponível em breve",
    release: "Módulo 01",
    durationMinutes: 10,
  },
  {
    id: "module-02",
    title: "Primeiro contato em inglês",
    status: "Disponível em breve",
    release: "Módulo 02",
    durationMinutes: 12,
  },
  {
    id: "module-03",
    title: "Perguntas inteligentes",
    status: "Disponível em breve",
    release: "Módulo 03",
    durationMinutes: 14,
  },
  {
    id: "module-04",
    title: "Análise de necessidades",
    status: "Disponível em breve",
    release: "Módulo 04",
    durationMinutes: 11,
  },
  {
    id: "module-05",
    title: "Vocabulário Específico",
    status: "Disponível em breve",
    release: "Módulo 05",
    durationMinutes: 16,
  },
  {
    id: "module-06",
    title: "Apresentar imóveis e vocabulário no restaurante",
    status: "Disponível em breve",
    release: "Módulo 06",
    durationMinutes: 13,
  },
];

function getInitialProgressState() {
  return upcomingVideos.reduce<Record<string, VideoProgressState>>((acc, video) => {
    acc[video.id] = { watchedMinutes: 0, notes: "" };
    return acc;
  }, {});
}

export default function VideosPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [uid, setUid] = useState("");
  const [progressByVideo, setProgressByVideo] = useState<Record<string, VideoProgressState>>(
    () => getInitialProgressState()
  );
  const [saveStatusByVideo, setSaveStatusByVideo] = useState<Record<string, string>>({});

  const totalProgrammedMinutes = useMemo(
    () => upcomingVideos.reduce((sum, video) => sum + video.durationMinutes, 0),
    []
  );

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

        setUid(user.uid);

        const progressCollection = collection(dbClient, "users", user.uid, "video_progress");
        const progressSnapshot = await getDocs(progressCollection);

        const nextProgress = getInitialProgressState();
        progressSnapshot.forEach((item) => {
          const data = item.data() as { watchedMinutes?: number; notes?: string };
          if (!nextProgress[item.id]) {
            return;
          }

          nextProgress[item.id] = {
            watchedMinutes: Math.max(0, Number(data.watchedMinutes || 0)),
            notes: data.notes || "",
          };
        });

        setProgressByVideo(nextProgress);
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

  async function saveVideoProgress(videoId: string) {
    if (!db || !uid) {
      return;
    }

    setSaveStatusByVideo((current) => ({ ...current, [videoId]: "Salvando..." }));

    try {
      const video = upcomingVideos.find((item) => item.id === videoId);
      const watchedMinutes = progressByVideo[videoId]?.watchedMinutes ?? 0;
      const notes = progressByVideo[videoId]?.notes ?? "";
      const cappedMinutes = video ? Math.min(watchedMinutes, video.durationMinutes) : watchedMinutes;

      await setDoc(
        doc(db, "users", uid, "video_progress", videoId),
        {
          watchedMinutes: cappedMinutes,
          notes,
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );

      setSaveStatusByVideo((current) => ({ ...current, [videoId]: "Anotações salvas." }));
    } catch {
      setSaveStatusByVideo((current) => ({ ...current, [videoId]: "Falha ao salvar. Tente novamente." }));
    }
  }

  function handleWatchedMinutesChange(video: VideoItem, value: number) {
    const normalized = Math.max(0, Math.min(value, video.durationMinutes));
    setProgressByVideo((current) => ({
      ...current,
      [video.id]: {
        ...(current[video.id] ?? { watchedMinutes: 0, notes: "" }),
        watchedMinutes: normalized,
      },
    }));
  }

  function handleNoteChange(videoId: string, note: string) {
    setProgressByVideo((current) => ({
      ...current,
      [videoId]: {
        ...(current[videoId] ?? { watchedMinutes: 0, notes: "" }),
        notes: note,
      },
    }));
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
            <strong>{upcomingVideos.length}</strong>
            <span>vídeos programados · {totalProgrammedMinutes} min</span>
          </div>
        </section>

        <section className="videos-grid" aria-label="Próximos vídeos">
          {upcomingVideos.map((video) => {
            const watchedMinutes = progressByVideo[video.id]?.watchedMinutes ?? 0;
            const notes = progressByVideo[video.id]?.notes ?? "";
            const progressPercent = Math.round((watchedMinutes / video.durationMinutes) * 100);

            return (
              <article className="video-card" key={video.id}>
                <div className="video-card-top">
                  <span className="video-module">{video.release}</span>
                  <span className="video-chip">{video.status}</span>
                </div>
                <h2>{video.title}</h2>
                <p>Conteúdo desbloqueado automaticamente assim que o módulo for lançado.</p>

                <div className="video-progress-section">
                  <div className="video-progress-header">
                    <strong>Progresso da aula: {progressPercent}%</strong>
                    <span>
                      {watchedMinutes} de {video.durationMinutes} min
                    </span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={video.durationMinutes}
                    value={watchedMinutes}
                    onChange={(event) =>
                      handleWatchedMinutesChange(video, Number(event.target.value))
                    }
                    aria-label={`Progresso da aula ${video.title}`}
                  />
                </div>

                <div className="video-notes-section">
                  <label htmlFor={`notes-${video.id}`}>Anotações da aula (privado)</label>
                  <textarea
                    id={`notes-${video.id}`}
                    value={notes}
                    onChange={(event) => handleNoteChange(video.id, event.target.value)}
                    placeholder="Escreva aqui seus pontos importantes desta aula."
                    rows={4}
                  />
                  <div className="video-notes-actions">
                    <small>
                      Apenas você pode ver estas anotações na sua conta.
                    </small>
                    <button type="button" className="secondary-link" onClick={() => saveVideoProgress(video.id)}>
                      Salvar anotação
                    </button>
                  </div>
                  {saveStatusByVideo[video.id] ? (
                    <p className="notes-save-feedback">{saveStatusByVideo[video.id]}</p>
                  ) : null}
                </div>
              </article>
            );
          })}
        </section>
      </main>
    </div>
  );
}
