"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Icon from "@/components/ui/Icon";
import { useStudent } from "@/components/student/StudentProvider";
import { MODULES, getAdjacentLessons, lessonHref, type Lesson } from "@/lib/course/catalog";
import {
  COMPLETION_THRESHOLD,
  formatTime,
  getLessonRatio,
  getLessonStatus,
  getResumePosition,
  summarizeCourse,
} from "@/lib/course/progress";
import { CONTACT_MESSAGES, whatsappLink } from "@/lib/site";

const SAVE_INTERVAL_MS = 10_000;
const NOTES_DEBOUNCE_MS = 1200;
const MAX_NOTES = 20_000;
const SPEEDS = [0.75, 1, 1.25, 1.5, 1.75, 2];
const SPEED_STORAGE_KEY = "hpe:playback-rate";

type MediaState = "loading" | "ready" | "locked" | "error";
type NotesState = "idle" | "pending" | "saving" | "saved" | "error";

function readStoredSpeed() {
  try {
    const value = Number(window.localStorage.getItem(SPEED_STORAGE_KEY));
    return SPEEDS.includes(value) ? value : 1;
  } catch {
    return 1;
  }
}

export default function LessonView({ lesson }: { lesson: Lesson }) {
  const { status, hasAccess, progressById, saveProgress, setLocalProgress, authorizedFetch, notify } =
    useStudent();
  const { previous, next } = getAdjacentLessons(lesson.id);

  const progress = progressById[lesson.id];
  const lessonStatus = getLessonStatus(progress);
  const isCompleted = progress?.completed === true;

  const [mediaState, setMediaState] = useState<MediaState>("loading");
  const [media, setMedia] = useState<{ videoUrl: string; materialUrl: string } | null>(null);
  const [videoFailed, setVideoFailed] = useState(false);
  const [hasEnded, setHasEnded] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [isOutlineOpen, setIsOutlineOpen] = useState(false);
  const [notes, setNotes] = useState<string | null>(null);
  const [notesState, setNotesState] = useState<NotesState>("idle");

  const videoRef = useRef<HTMLVideoElement>(null);
  const progressRef = useRef(progress);
  const positionRef = useRef(0);
  const durationRef = useRef(0);
  const lastSavedAtRef = useRef(0);
  const lastLocalUpdateRef = useRef(0);
  const hasPlayedRef = useRef(false);
  const completedRef = useRef(isCompleted);
  const notesTimerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const pendingNotesRef = useRef<string | null>(null);

  useEffect(() => {
    progressRef.current = progress;
    completedRef.current = progress?.completed === true;
  }, [progress]);

  // Notas: inicializa uma vez a partir do servidor.
  useEffect(() => {
    if (status === "ready" && notes === null) {
      setNotes(progressRef.current?.notes ?? "");
    }
  }, [status, notes]);

  useEffect(() => {
    setSpeed(readStoredSpeed());
  }, []);

  const loadMedia = useCallback(async () => {
    setMediaState("loading");
    setVideoFailed(false);
    try {
      const response = await authorizedFetch(`/api/course/lessons/${lesson.id}`);
      if (response.status === 403) {
        setMediaState("locked");
        return;
      }
      if (!response.ok) {
        throw new Error(String(response.status));
      }
      const payload = (await response.json()) as { videoUrl: string; materialUrl: string };
      setMedia(payload);
      setMediaState("ready");
    } catch {
      setMediaState("error");
    }
  }, [authorizedFetch, lesson.id]);

  useEffect(() => {
    if (status !== "ready") {
      return;
    }
    if (!hasAccess) {
      setMediaState("locked");
      return;
    }
    void loadMedia();
  }, [status, hasAccess, loadMedia]);

  const persistPosition = useCallback(
    (options: { keepalive?: boolean } = {}) => {
      if (!hasPlayedRef.current || !durationRef.current) {
        return;
      }
      lastSavedAtRef.current = Date.now();
      void saveProgress(
        lesson.id,
        { watchedSeconds: positionRef.current, durationSeconds: durationRef.current },
        options
      );
    },
    [lesson.id, saveProgress]
  );

  const flushNotes = useCallback(
    (options: { keepalive?: boolean } = {}) => {
      if (notesTimerRef.current) {
        clearTimeout(notesTimerRef.current);
        notesTimerRef.current = undefined;
      }
      const pending = pendingNotesRef.current;
      if (pending === null) {
        return;
      }
      pendingNotesRef.current = null;
      setNotesState("saving");
      void saveProgress(lesson.id, { notes: pending }, options).then((ok) => {
        setNotesState(ok ? "saved" : "error");
        if (!ok) {
          pendingNotesRef.current = pending;
        }
      });
    },
    [lesson.id, saveProgress]
  );

  // Salva ao trocar de aba, ao sair da página e ao desmontar (troca de aula).
  useEffect(() => {
    const onHide = () => {
      if (document.visibilityState === "hidden") {
        persistPosition({ keepalive: true });
        flushNotes({ keepalive: true });
      }
    };
    const onPageHide = () => {
      persistPosition({ keepalive: true });
      flushNotes({ keepalive: true });
    };
    document.addEventListener("visibilitychange", onHide);
    window.addEventListener("pagehide", onPageHide);
    return () => {
      document.removeEventListener("visibilitychange", onHide);
      window.removeEventListener("pagehide", onPageHide);
      persistPosition({ keepalive: true });
      flushNotes({ keepalive: true });
    };
  }, [persistPosition, flushNotes]);

  const moduleOfLesson = useMemo(
    () => MODULES.find((module) => module.number === lesson.moduleNumber),
    [lesson.moduleNumber]
  );

  const setCompleted = useCallback(
    (completed: boolean, source: "auto" | "manual") => {
      completedRef.current = completed;
      const patch = completed
        ? {
            completed: true,
            ...(durationRef.current
              ? { watchedSeconds: positionRef.current, durationSeconds: durationRef.current }
              : {}),
          }
        : { completed: false };
      void saveProgress(lesson.id, patch);

      if (!completed) {
        notify({ title: "Aula marcada como não concluída.", icon: "info" });
        return;
      }

      const moduleDone = moduleOfLesson?.lessons.every(
        (item) => item.id === lesson.id || getLessonStatus(progressById[item.id]) === "completed"
      );

      notify({
        title: moduleDone ? `Módulo ${String(lesson.moduleNumber).padStart(2, "0")} concluído` : "Aula concluída",
        text: next ? `Próxima: ${next.title}` : source === "auto" ? "Você chegou ao fim do curso." : undefined,
        icon: "checkCircle",
        action: next ? { label: "Próxima aula", href: lessonHref(next.id) } : undefined,
      });
    },
    [lesson.id, lesson.moduleNumber, moduleOfLesson, next, notify, progressById, saveProgress]
  );

  function handleLoadedMetadata() {
    const video = videoRef.current;
    if (!video) {
      return;
    }
    video.playbackRate = speed;
    const duration = Number.isFinite(video.duration) ? video.duration : 0;
    durationRef.current = duration;
    if (duration && Math.abs((progressRef.current?.durationSeconds ?? 0) - duration) > 1) {
      setLocalProgress(lesson.id, { durationSeconds: duration });
    }

    const resumeAt = getResumePosition(progressRef.current, duration);
    if (resumeAt > 0) {
      video.currentTime = resumeAt;
      positionRef.current = resumeAt;
      notify({
        title: `Retomando de ${formatTime(resumeAt)}`,
        icon: "rewind",
        action: {
          label: "Recomeçar",
          onClick: () => {
            if (videoRef.current) {
              videoRef.current.currentTime = 0;
            }
          },
        },
      });
    }
  }

  function handleTimeUpdate() {
    const video = videoRef.current;
    if (!video || !durationRef.current) {
      return;
    }
    positionRef.current = video.currentTime;
    if (!video.paused) {
      hasPlayedRef.current = true;
    }

    const now = Date.now();
    if (now - lastLocalUpdateRef.current > 1000) {
      lastLocalUpdateRef.current = now;
      setLocalProgress(lesson.id, { watchedSeconds: video.currentTime, durationSeconds: durationRef.current });
    }

    if (!video.paused && now - lastSavedAtRef.current > SAVE_INTERVAL_MS) {
      persistPosition();
    }

    if (!completedRef.current && video.currentTime / durationRef.current >= COMPLETION_THRESHOLD) {
      setCompleted(true, "auto");
    }
  }

  function handleSpeedChange(value: number) {
    setSpeed(value);
    if (videoRef.current) {
      videoRef.current.playbackRate = value;
    }
    try {
      window.localStorage.setItem(SPEED_STORAGE_KEY, String(value));
    } catch {
      /* armazenamento indisponível: mantém só na sessão */
    }
  }

  function handleNotesChange(value: string) {
    const trimmed = value.slice(0, MAX_NOTES);
    setNotes(trimmed);
    pendingNotesRef.current = trimmed;
    setNotesState("pending");
    if (notesTimerRef.current) {
      clearTimeout(notesTimerRef.current);
    }
    notesTimerRef.current = setTimeout(() => flushNotes(), NOTES_DEBOUNCE_MS);
  }

  const summary = useMemo(() => summarizeCourse(progressById), [progressById]);
  const ratio = getLessonRatio(progress);

  const notesLabel: Record<NotesState, string> = {
    idle: "Salvas automaticamente",
    pending: "Alterações não salvas…",
    saving: "Salvando…",
    saved: "Anotações salvas",
    error: "Não foi possível salvar.",
  };

  return (
    <div className="lesson">
      <div className="lesson__main">
        <nav className="lesson__crumbs" aria-label="Você está em">
          <Link href="/videos">
            <Icon name="arrowLeft" size={16} />
            Meus cursos
          </Link>
          <span aria-hidden="true">/</span>
          <span>Módulo {String(lesson.moduleNumber).padStart(2, "0")}</span>
        </nav>

        <div className="player">
          {status !== "ready" || mediaState === "loading" ? (
            <div className="player__state" aria-busy="true">
              <span className="spinner" aria-hidden="true" />
              <span>Preparando a aula…</span>
            </div>
          ) : mediaState === "locked" ? (
            <div className="player__state">
              <span className="player__state-icon">
                <Icon name="lock" size={22} />
              </span>
              <p className="player__state-title">Conteúdo indisponível para esta conta.</p>
              <p>Se você já comprou o curso, fale com o suporte para liberar seu acesso.</p>
              <a
                className="btn btn--gold btn--sm"
                href={whatsappLink(CONTACT_MESSAGES.support)}
                target="_blank"
                rel="noopener noreferrer"
              >
                Falar com o suporte
              </a>
            </div>
          ) : mediaState === "error" || videoFailed ? (
            <div className="player__state" role="alert">
              <span className="player__state-icon">
                <Icon name="alert" size={22} />
              </span>
              <p className="player__state-title">Não foi possível carregar o vídeo.</p>
              <p>Verifique sua conexão. Seu progresso continua salvo.</p>
              <div className="player__state-actions">
                <button type="button" className="btn btn--gold btn--sm" onClick={() => void loadMedia()}>
                  <Icon name="refresh" size={16} />
                  Tentar novamente
                </button>
                <a
                  className="btn btn--ghost-light btn--sm"
                  href={whatsappLink(CONTACT_MESSAGES.support)}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Suporte
                </a>
              </div>
            </div>
          ) : media ? (
            <>
              <video
                ref={videoRef}
                className="player__video"
                src={media.videoUrl}
                controls
                playsInline
                preload="metadata"
                controlsList="nodownload"
                onContextMenu={(event) => event.preventDefault()}
                onLoadedMetadata={handleLoadedMetadata}
                onTimeUpdate={handleTimeUpdate}
                onPlay={() => {
                  hasPlayedRef.current = true;
                  setHasEnded(false);
                }}
                onPause={() => persistPosition()}
                onEnded={() => {
                  positionRef.current = durationRef.current;
                  persistPosition();
                  if (!completedRef.current) {
                    setCompleted(true, "auto");
                  }
                  setHasEnded(true);
                }}
                onError={() => setVideoFailed(true)}
                aria-label={`Vídeo da aula: ${lesson.title}`}
              >
                Seu navegador não suporta a reprodução de vídeo.
              </video>
              {hasEnded ? (
                <div className="player__end">
                  <p className="player__end-kicker">
                    <Icon name="checkCircle" size={18} />
                    Aula concluída
                  </p>
                  {next ? (
                    <>
                      <p className="player__end-title display">{next.title}</p>
                      <p className="player__end-code">A seguir · {next.code}</p>
                      <div className="player__end-actions">
                        <Link className="btn btn--gold" href={lessonHref(next.id)}>
                          <Icon name="play" size={14} />
                          Assistir próxima aula
                        </Link>
                        <button
                          type="button"
                          className="btn btn--ghost-light"
                          onClick={() => {
                            setHasEnded(false);
                            if (videoRef.current) {
                              videoRef.current.currentTime = 0;
                              void videoRef.current.play();
                            }
                          }}
                        >
                          <Icon name="rewind" size={16} />
                          Rever
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <p className="player__end-title display">Você chegou ao fim do curso.</p>
                      <div className="player__end-actions">
                        <Link className="btn btn--gold" href="/videos">
                          Voltar aos meus cursos
                        </Link>
                      </div>
                    </>
                  )}
                </div>
              ) : null}
            </>
          ) : null}
        </div>

        <header className="lesson__header">
          <div className="lesson__meta">
            <span className="lesson__code">{lesson.code}</span>
            {lessonStatus === "completed" ? (
              <span className="chip chip--success">
                <Icon name="check" size={12} strokeWidth={2.4} />
                Concluída
              </span>
            ) : lessonStatus === "in_progress" ? (
              <span className="chip chip--progress">{Math.round(ratio * 100)}% assistido</span>
            ) : null}
          </div>
          <h1 className="lesson__title display">{lesson.title}</h1>
          <p className="lesson__summary">{lesson.summary}</p>
        </header>

        <div className="lesson__toolbar">
          <button
            type="button"
            className={`btn btn--sm ${isCompleted ? "btn--done" : "btn--ghost-light"}`}
            onClick={() => setCompleted(!isCompleted, "manual")}
            disabled={mediaState === "locked" || status !== "ready"}
            aria-pressed={isCompleted}
          >
            <Icon name={isCompleted ? "checkCircle" : "check"} size={16} />
            {isCompleted ? "Concluída" : "Marcar como concluída"}
          </button>

          {media?.materialUrl ? (
            <a className="btn btn--ghost-light btn--sm" href={media.materialUrl} target="_blank" rel="noopener noreferrer">
              <Icon name="file" size={16} />
              Material da aula (PDF)
            </a>
          ) : null}

          <label className="speed">
            <Icon name="speed" size={16} />
            <span className="sr-only">Velocidade de reprodução</span>
            <select value={speed} onChange={(event) => handleSpeedChange(Number(event.target.value))}>
              {SPEEDS.map((value) => (
                <option key={value} value={value}>
                  {value === 1 ? "Velocidade 1×" : `${String(value).replace(".", ",")}×`}
                </option>
              ))}
            </select>
          </label>
        </div>

        <nav className="lesson__pager" aria-label="Navegação entre aulas">
          {previous ? (
            <Link href={lessonHref(previous.id)} className="pager-link">
              <Icon name="arrowLeft" size={18} />
              <span>
                <span className="pager-link__kicker">Anterior · {previous.code}</span>
                <span className="pager-link__title">{previous.title}</span>
              </span>
            </Link>
          ) : (
            <span />
          )}
          {next ? (
            <Link href={lessonHref(next.id)} className="pager-link pager-link--next">
              <span>
                <span className="pager-link__kicker">Próxima · {next.code}</span>
                <span className="pager-link__title">{next.title}</span>
              </span>
              <Icon name="arrowRight" size={18} />
            </Link>
          ) : null}
        </nav>

        <section className="notes" aria-labelledby="notes-title">
          <div className="notes__head">
            <h2 id="notes-title" className="notes__title">
              Minhas anotações
            </h2>
            <span className={`notes__status notes__status--${notesState}`} aria-live="polite">
              {notesState === "saved" ? <Icon name="check" size={14} strokeWidth={2.4} /> : null}
              {notesLabel[notesState]}
              {notesState === "error" ? (
                <button type="button" className="notes__retry" onClick={() => flushNotes()}>
                  Tentar novamente
                </button>
              ) : null}
            </span>
          </div>
          <textarea
            className="notes__input"
            value={notes ?? ""}
            onChange={(event) => handleNotesChange(event.target.value)}
            onBlur={() => flushNotes()}
            placeholder="Registre expressões, perguntas e ideias desta aula. Só você vê estas anotações."
            rows={6}
            maxLength={MAX_NOTES}
            disabled={notes === null || mediaState === "locked"}
            aria-describedby="notes-hint"
          />
          <p id="notes-hint" className="notes__hint">
            <Icon name="lock" size={12} /> Privadas — visíveis apenas na sua conta.
          </p>
        </section>
      </div>

      <aside className={`outline ${isOutlineOpen ? "is-open" : ""}`} aria-label="Conteúdo do curso">
        <button
          type="button"
          className="outline__toggle"
          aria-expanded={isOutlineOpen}
          aria-controls="outline-list"
          onClick={() => setIsOutlineOpen((open) => !open)}
        >
          <span>
            <span className="outline__toggle-title">Conteúdo do curso</span>
            <span className="outline__toggle-meta">
              {summary.completed} de {summary.total} concluídas
            </span>
          </span>
          <Icon name="chevronDown" size={18} />
        </button>

        <div className="outline__head">
          <p className="outline__title">Conteúdo do curso</p>
          <p className="outline__meta">
            {summary.completed} de {summary.total} aulas concluídas
          </p>
          <div className="progress progress--on-dark" aria-hidden="true">
            <span className="progress__bar" style={{ ["--value" as string]: summary.ratio }} />
          </div>
        </div>

        <div className="outline__list" id="outline-list">
          {MODULES.map((module) => (
            <div key={module.number} className="outline__module">
              <p className="outline__module-title">
                <span>{String(module.number).padStart(2, "0")}</span>
                {module.title}
              </p>
              <ul>
                {module.lessons.map((item) => {
                  const itemProgress = progressById[item.id];
                  const itemStatus = getLessonStatus(itemProgress);
                  const isCurrent = item.id === lesson.id;
                  return (
                    <li key={item.id}>
                      <Link
                        href={lessonHref(item.id)}
                        className={`outline__item ${isCurrent ? "is-current" : ""}`}
                        aria-current={isCurrent ? "page" : undefined}
                        onClick={() => setIsOutlineOpen(false)}
                      >
                        <span className={`outline__status outline__status--${itemStatus}`} aria-hidden="true">
                          {!hasAccess ? (
                            <Icon name="lock" size={12} />
                          ) : itemStatus === "completed" ? (
                            <Icon name="check" size={12} strokeWidth={2.6} />
                          ) : isCurrent ? (
                            <Icon name="play" size={10} />
                          ) : null}
                        </span>
                        <span className="outline__item-body">
                          <span className="outline__item-code">{item.code}</span>
                          <span className="outline__item-title">{item.title}</span>
                        </span>
                        <span className="sr-only">
                          {!hasAccess
                            ? "Indisponível"
                            : itemStatus === "completed"
                              ? "Concluída"
                              : itemStatus === "in_progress"
                                ? "Em andamento"
                                : "Não iniciada"}
                        </span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      </aside>
    </div>
  );
}
