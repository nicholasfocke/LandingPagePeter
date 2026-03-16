"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged, signOut } from "firebase/auth";
import type { User } from "firebase/auth";
import { auth } from "@/firebase/firebaseConfig";
import "./page.css";

type VideoItem = {
  id: string;
  title: string;
  file: string;
  url: string;
  materialUrl: string;
  status: string;
  release: string;
  durationMinutes: number;
};

type VideoProgressState = {
  watchedSeconds: number;
  durationSeconds: number;
  notes: string;
};

const courseVideos: VideoItem[] = [
  {
    id: "module-01",
    title: "Primeiro contato em inglês",
    file: "primeiro contato em inglês.mp4",
    url: "https://firebasestorage.googleapis.com/v0/b/hpebrazil-be671.firebasestorage.app/o/primeiro%20contato%20em%20ingl%C3%AAs.mp4?alt=media&token=766619f0-f1bf-4682-8e95-e6a23c75a6cf",
    materialUrl: "https://firebasestorage.googleapis.com/v0/b/hpebrazil-be671.firebasestorage.app/o/PRIMEIRO%20CONTATO%20EM%20INGL%C3%8AS.pdf?alt=media&token=ef28baba-81e0-464c-927d-6607bc2bb4da",
    status: "já disponível",
    release: "Módulo 01",
    durationMinutes: 12,
  },
  {
    id: "module-02",
    title: "Perguntas inteligentes",
    file: "perguntas inteligentes.mp4",
    url: "https://firebasestorage.googleapis.com/v0/b/hpebrazil-be671.firebasestorage.app/o/perguntas%20inteligentes.mp4?alt=media&token=43c85598-767a-4cb1-967e-780669dd80bc",
    materialUrl: "https://firebasestorage.googleapis.com/v0/b/hpebrazil-be671.firebasestorage.app/o/PERGUNTAS%20INTELIGENTES.pdf?alt=media&token=207d142d-b624-43e1-890c-bd8b012a1e01",
    status: "já disponível",
    release: "Módulo 02",
    durationMinutes: 14,
  },
  {
    id: "module-03",
    title: "Análise de necessidades",
    file: "análise de necessidades.mp4",
    url: "https://firebasestorage.googleapis.com/v0/b/hpebrazil-be671.firebasestorage.app/o/an%C3%A1lise%20de%20necessidades.mp4?alt=media&token=3e73e0d9-0261-40bb-99b2-7b4bdffd5a81",
    materialUrl: "https://firebasestorage.googleapis.com/v0/b/hpebrazil-be671.firebasestorage.app/o/AN%C3%81LISE%20DE%20NECESSIDADES.pdf?alt=media&token=f2c500ec-098a-403f-b9a4-514e4f68f1a6",
    status: "já disponível",
    release: "Módulo 03",
    durationMinutes: 11,
  },
  {
    id: "module-04",
    title: "Vocabulário específico",
    file: "vocabulário específico.mp4",
    url: "https://firebasestorage.googleapis.com/v0/b/hpebrazil-be671.firebasestorage.app/o/vocabul%C3%A1rio%20espec%C3%ADfico.mp4?alt=media&token=22e02c47-eb23-4f95-abd0-c2117492483c",
    materialUrl: "https://firebasestorage.googleapis.com/v0/b/hpebrazil-be671.firebasestorage.app/o/VOCABUL%C3%81RIO%20ESPEC%C3%8DFICO.pdf?alt=media&token=e8a06ba4-cd8b-40bd-b751-61c94251e5ab",
    status: "já disponível",
    release: "Módulo 04",
    durationMinutes: 16,
  },
  {
    id: "module-05",
    title: "Apresentar im\u00f3veis e vocabul\u00e1rio no restaurante",
    file: "apresentar imóveis e vocabulário no restauranre.mp4",
    url: "https://firebasestorage.googleapis.com/v0/b/hpebrazil-be671.firebasestorage.app/o/apresentar%20im%C3%B3veis%20e%20vocabul%C3%A1rio%20no%20restauranre.mp4?alt=media&token=3ac9e9f8-004f-4356-a127-303af09868d3",
    materialUrl: "https://firebasestorage.googleapis.com/v0/b/hpebrazil-be671.firebasestorage.app/o/APRESENTAR%20IM%C3%93VEIS%20E%20VOCABUL%C3%81RIO%20NO%20RESTAURANTE.pdf?alt=media&token=c40dc003-eccb-43d8-8816-8dd29f7f3e95",
    status: "já disponível",
    release: "Módulo 05",
    durationMinutes: 13,
  },
  {
    id: "bonus-01",
    title: "Bônus primeiro contato em inglês",
    file: "bonus primeiro contato em inglês.mp4",
    url: "https://firebasestorage.googleapis.com/v0/b/hpebrazil-be671.firebasestorage.app/o/bonus%20primeiro%20contato%20em%20ingl%C3%AAs.mp4?alt=media&token=454f3c7e-3375-4bff-a41c-a3288630733f",
    materialUrl: "https://firebasestorage.googleapis.com/v0/b/hpebrazil-be671.firebasestorage.app/o/BONUS%20-%20PRIMEIRO%20CONTATO%20EM%20INGL%C3%8AS.pdf?alt=media&token=4e7c3445-bf8e-47f9-94e0-1c82e86d4974",
    status: "já disponível",
    release: "Bônus 01",
    durationMinutes: 10,
  },
  {
    id: "bonus-02",
    title: "Bônus perguntas inteligentes",
    file: "bonus perguntas inteligentes.mp4",
    url: "https://firebasestorage.googleapis.com/v0/b/hpebrazil-be671.firebasestorage.app/o/bonus%20perguntas%20inteligentes.mp4?alt=media&token=074765d0-08dd-458e-90bc-571396bb4dd8",
    materialUrl: "https://firebasestorage.googleapis.com/v0/b/hpebrazil-be671.firebasestorage.app/o/BONUS%20-%20PERGUNTAS%20INTELIGENTES.pdf?alt=media&token=767c4ea2-36f4-42a6-817d-bf9b1dae2c85",
    status: "já disponível",
    release: "Bônus 02",
    durationMinutes: 12,
  },
  {
    id: "bonus-03",
    title: "Bônus análise de necessidades",
    file: "bonus análise de necessidades.mp4",
    url: "https://firebasestorage.googleapis.com/v0/b/hpebrazil-be671.firebasestorage.app/o/bonus%20an%C3%A1lise%20de%20necessidades.mp4?alt=media&token=fe5e7ae3-e5e1-473c-8b54-24ea95bac650",
    materialUrl: "https://firebasestorage.googleapis.com/v0/b/hpebrazil-be671.firebasestorage.app/o/BONUS%20-%20AN%C3%81LISE%20DE%20NECESSIDADES.pdf?alt=media&token=9cba0794-ec9d-4190-aebb-4e9a45b5f238",
    status: "já disponível",
    release: "Bônus 03",
    durationMinutes: 10,
  },
  {
    id: "bonus-04",
    title: "Bônus vocabulário específico",
    file: "bonus vocabulãrio específico.mp4",
    url: "https://firebasestorage.googleapis.com/v0/b/hpebrazil-be671.firebasestorage.app/o/bonus%20vocabul%C3%A3rio%20espec%C3%ADfico.mp4?alt=media&token=23e96123-3620-4c28-bedb-df5e02d090a8",
    materialUrl: "https://firebasestorage.googleapis.com/v0/b/hpebrazil-be671.firebasestorage.app/o/BONUS%20-%20VOCABUL%C3%81RIO%20ESPEC%C3%8DFICO.pdf?alt=media&token=da3dbaee-ee71-40ab-8ed5-ffa64523e7ec",
    status: "já disponível",
    release: "Bônus 04",
    durationMinutes: 11,
  },
  {
    id: "bonus-05",
    title: "Bônus apresentar imóveis e vocabulário no restaurante",
    file: "bonus apresentar imóveis e vocabulário no restaurante.mp4",
    url: "https://firebasestorage.googleapis.com/v0/b/hpebrazil-be671.firebasestorage.app/o/bonus%20apresentar%20im%C3%B3veis%20e%20vocabul%C3%A1rio%20no%20restaurante.mp4?alt=media&token=df626b86-332a-42ee-ba50-67f42551d859",
    materialUrl: "https://firebasestorage.googleapis.com/v0/b/hpebrazil-be671.firebasestorage.app/o/BONUS%20-%20APRESENTAR%20IM%C3%93VEIS%20E%20VOCABUL%C3%81RIO%20NO%20RESTAURANTE.pdf?alt=media&token=1cc47b48-33aa-41cd-8f99-dd2e0efd8694",
    status: "já disponível",
    release: "Bônus 05",
    durationMinutes: 12,
  },
];

function getInitialProgressState() {
  return courseVideos.reduce<Record<string, VideoProgressState>>((acc, video) => {
    acc[video.id] = {
      watchedSeconds: 0,
      durationSeconds: video.durationMinutes * 60,
      notes: "",
    };
    return acc;
  }, {});
}

function formatTime(totalSeconds: number) {
  const safeSeconds = Math.max(0, Math.floor(totalSeconds));
  const minutes = Math.floor(safeSeconds / 60);
  const seconds = safeSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

export default function VideosPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [uid, setUid] = useState("");
  const videoRefs = useRef<Record<string, HTMLVideoElement | null>>({});
  const pendingSaveTimers = useRef<Record<string, ReturnType<typeof setTimeout> | undefined>>({});
  const lastAutoSaveAt = useRef<Record<string, number>>({});
  const [progressByVideo, setProgressByVideo] = useState<Record<string, VideoProgressState>>(
    () => getInitialProgressState()
  );
  const progressByVideoRef = useRef(progressByVideo);
  const [saveStatusByVideo, setSaveStatusByVideo] = useState<Record<string, string>>({});

  const totalProgrammedMinutes = useMemo(
    () => courseVideos.reduce((sum, video) => sum + video.durationMinutes, 0),
    []
  );

  async function fetchProgressFromApi(user: User) {
    const idToken = await user.getIdToken();
    const response = await fetch("/api/video-progress", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${idToken}`,
      },
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error("Falha ao carregar progresso.");
    }

    const payload = (await response.json()) as {
      items: Array<{
        videoId: string;
        watchedSeconds: number;
        durationSeconds: number;
        notes: string;
      }>;
    };

    const nextProgress = getInitialProgressState();
    for (const item of payload.items ?? []) {
      if (!nextProgress[item.videoId]) {
        continue;
      }

      nextProgress[item.videoId] = {
        watchedSeconds: Math.max(0, Number(item.watchedSeconds || 0)),
        durationSeconds: Math.max(
          1,
          Number(item.durationSeconds || nextProgress[item.videoId].durationSeconds)
        ),
        notes: item.notes || "",
      };
    }

    setProgressByVideo(nextProgress);
  }

  useEffect(() => {
    if (!auth) {
      router.replace("/login?error=" + encodeURIComponent("Firebase não configurado."));
      return;
    }

    const authClient = auth;

    const unsubscribe = onAuthStateChanged(authClient, async (user) => {
      if (!user) {
        router.replace("/login");
        return;
      }

      try {
        setUid(user.uid);
        await fetchProgressFromApi(user);
      } catch {
        setProgressByVideo(getInitialProgressState());
      } finally {
        setIsLoading(false);
      }
    });

    return () => unsubscribe();
  }, [router]);

  useEffect(() => {
    progressByVideoRef.current = progressByVideo;
  }, [progressByVideo]);

  useEffect(() => {
    return () => {
      for (const timer of Object.values(pendingSaveTimers.current)) {
        if (timer) {
          clearTimeout(timer);
        }
      }
    };
  }, []);

  useEffect(() => {
    if (isLoading) {
      return;
    }

    for (const video of courseVideos) {
      const player = videoRefs.current[video.id];
      const watchedSeconds = progressByVideo[video.id].watchedSeconds ?? 0;
      if (!player || player.readyState < 1 || watchedSeconds <= 0) {
        continue;
      }

      const target = Math.min(
        watchedSeconds,
        Number.isFinite(player.duration) && player.duration > 0
          ? player.duration
          : watchedSeconds
      );

      if (Math.abs(player.currentTime - target) > 1) {
        player.currentTime = target;
      }
    }
  }, [isLoading, progressByVideo]);

  async function handleLogout() {
    if (!auth) {
      router.replace("/login");
      return;
    }
    const authClient = auth;

    await Promise.all(courseVideos.map((video) => saveVideoProgress(video.id, true)));
    await signOut(authClient);
    router.replace("/login");
  }

  async function saveVideoProgress(videoId: string, silent = false) {
    const authClient = auth;
    const currentUser = authClient?.currentUser;
    if (!uid || !authClient || !currentUser) {
      return;
    }

    if (!silent) {
      setSaveStatusByVideo((current) => ({ ...current, [videoId]: "Salvando..." }));
    }

    try {
      const video = courseVideos.find((item) => item.id === videoId);
      const currentProgress = progressByVideoRef.current[videoId];
      const watchedSeconds = currentProgress.watchedSeconds ?? 0;
      const notes = currentProgress.notes ?? "";
      const defaultDurationSeconds = video ? video.durationMinutes * 60 : watchedSeconds;
      const durationSeconds = currentProgress.durationSeconds ?? defaultDurationSeconds;
      const maxSeconds = Math.max(1, Math.floor(durationSeconds));
      const cappedSeconds = Math.max(0, Math.min(watchedSeconds, maxSeconds));
      const cappedMinutes = Math.round((cappedSeconds / 60) * 100) / 100;

      const idToken = await currentUser.getIdToken();
      const response = await fetch("/api/video-progress", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({
          videoId,
          watchedSeconds: cappedSeconds,
          watchedMinutes: cappedMinutes,
          durationSeconds: maxSeconds,
          notes,
        }),
      });

      if (!response.ok) {
        const payload = (await response.json().catch(() => ({}))) as { error: string };
        throw new Error(payload.error || "Falha ao salvar progresso");
      }

      setSaveStatusByVideo((current) => ({ ...current, [videoId]: "Anotações salvas." }));
    } catch (error) {
      console.error("[videos] Erro ao salvar progresso/anota\u00e7\u00e3o:", error);
      setSaveStatusByVideo((current) => ({ ...current, [videoId]: "Falha ao salvar. Tente novamente." }));
    }
  }

  function queueProgressSave(videoId: string) {
    if (pendingSaveTimers.current[videoId]) {
      clearTimeout(pendingSaveTimers.current[videoId]);
    }

    pendingSaveTimers.current[videoId] = setTimeout(() => {
      void saveVideoProgress(videoId, true);
      pendingSaveTimers.current[videoId] = undefined;
    }, 1500);
  }

  function handleVideoProgressUpdate(videoId: string, watchedSeconds: number, durationSeconds: number) {
    const normalizedDuration = Math.max(1, Math.floor(durationSeconds || 0));
    const normalizedWatched = Math.max(0, Math.min(watchedSeconds, normalizedDuration));

    setProgressByVideo((current) => ({
      ...current,
      [videoId]: {
        ...(current[videoId] ?? { watchedSeconds: 0, durationSeconds: normalizedDuration, notes: "" }),
        watchedSeconds: normalizedWatched,
        durationSeconds: normalizedDuration,
      },
    }));

    const now = Date.now();
    const lastSaved = lastAutoSaveAt.current[videoId] ?? 0;
    if (now - lastSaved > 15000) {
      lastAutoSaveAt.current[videoId] = now;
      void saveVideoProgress(videoId, true);
    }
  }

  function handleNoteChange(videoId: string, note: string) {
    setProgressByVideo((current) => ({
      ...current,
      [videoId]: {
        ...(current[videoId] ?? { watchedSeconds: 0, durationSeconds: 1, notes: "" }),
        notes: note,
      },
    }));
    queueProgressSave(videoId);
  }

  function handleVideoMetadata(videoId: string, durationSeconds: number) {
    const normalizedDuration = Math.max(1, Math.floor(durationSeconds || 0));
    setProgressByVideo((current) => ({
      ...current,
      [videoId]: {
        ...(current[videoId] ?? { watchedSeconds: 0, durationSeconds: normalizedDuration, notes: "" }),
        durationSeconds: normalizedDuration,
      },
    }));
  }

  function handleVideoPause(videoId: string) {
    void saveVideoProgress(videoId, true);
  }

  if (isLoading) {
    return (
      <div className="page">
        <main className="card videos-card">
          <p className="loading-message">{"Carregando sua \u00e1rea do aluno..."}</p>
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
            <p className="eyebrow">{"\u00c1rea do aluno HPE"}</p>
            <h1>Biblioteca de aulas liberada</h1>
            <p>
              {"As aulas principais e os b\u00f4nus j\u00e1 est\u00e3o dispon\u00edveis para voc\u00ea assistir,"}
              <br />
              {"revisar e acompanhar com suas anota\u00e7\u00f5es."}
            </p>
          </div>
          <div className="videos-hero-badge">
            <strong>{courseVideos.length}</strong>
            <span>{`v\u00eddeos dispon\u00edveis \u00b7 ${totalProgrammedMinutes} min`}</span>
          </div>
        </section>

        <section className="videos-grid" aria-label={"Biblioteca de v\u00eddeos"}>
          {courseVideos.map((video) => {
            const watchedSeconds = progressByVideo[video.id].watchedSeconds ?? 0;
            const durationSeconds =
              progressByVideo[video.id].durationSeconds ?? video.durationMinutes * 60;
            const notes = progressByVideo[video.id].notes ?? "";
            const saveFeedback = (saveStatusByVideo[video.id] ?? "")
              .replace("Anota??es salvas.", "Anota\u00e7\u00f5es salvas.")
              .replace("AnotaÃ§Ãµes salvas.", "Anota\u00e7\u00f5es salvas.");
            const progressPercent = Math.round((watchedSeconds / durationSeconds) * 100);

            return (
              <article className="video-card" key={video.id}>
                <div className="video-card-top">
                  <span className="video-module">{video.release}</span>
                  <span className="video-chip">{video.status}</span>
                </div>
                <h2>{video.title}</h2>
                <video
                  className="lesson-video"
                  controls
                  preload="metadata"
                  src={video.url ?? `/videos/${encodeURIComponent(video.file)}`}
                  ref={(element) => {
                    videoRefs.current[video.id] = element;
                  }}
                  onLoadedMetadata={(event) => {
                    handleVideoMetadata(video.id, event.currentTarget.duration);
                  }}
                  onTimeUpdate={(event) => {
                    handleVideoProgressUpdate(
                      video.id,
                      event.currentTarget.currentTime,
                      event.currentTarget.duration
                    );
                  }}
                  onPause={() => handleVideoPause(video.id)}
                  onEnded={() => handleVideoPause(video.id)}
                >
                  {"Seu navegador n\u00e3o suporta a reprodu\u00e7\u00e3o de v\u00eddeo."}
                </video>
                <p>{"Conte\u00fado j\u00e1 dispon\u00edvel para assistir agora."}</p>
                {video.materialUrl ? (
                  <a
                    className="video-material-link"
                    href={video.materialUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Material (PDF)
                  </a>
                ) : null}

                <div className="video-progress-section">
                  <div className="video-progress-header">
                    <strong>Progresso da aula: {progressPercent}%</strong>
                    <span>
                      {formatTime(watchedSeconds)} de {formatTime(durationSeconds)}
                    </span>
                  </div>
                  <progress
                    className="video-progress-bar"
                    max={durationSeconds}
                    value={watchedSeconds}
                    aria-label={`Progresso da aula ${video.title}`}
                  />
                </div>

                <div className="video-notes-section">
                  <label htmlFor={`notes-${video.id}`}>{"Anota\u00e7\u00f5es da aula (privado)"}</label>
                  <textarea
                    id={`notes-${video.id}`}
                    value={notes}
                    onChange={(event) => handleNoteChange(video.id, event.target.value)}
                    placeholder="Escreva aqui seus pontos importantes desta aula."
                    rows={4}
                  />
                  <div className="video-notes-actions">
                    <small>
                      {"Apenas voc\u00ea pode ver estas anota\u00e7\u00f5es na sua conta."}
                    </small>
                    <button type="button" className="secondary-link" onClick={() => saveVideoProgress(video.id)}>
                      {"Salvar anota\u00e7\u00e3o"}
                    </button>
                  </div>
                  {saveStatusByVideo[video.id] ? (
                    <p className="notes-save-feedback">{saveFeedback}</p>
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

