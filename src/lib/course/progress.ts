import { LESSONS, STUDY_SEQUENCE, type Lesson } from "@/lib/course/catalog";

export type LessonProgress = {
  videoId: string;
  watchedSeconds: number;
  durationSeconds: number;
  notes: string;
  completed: boolean;
  updatedAt: number | null;
};

export type LessonStatus = "completed" | "in_progress" | "not_started";

/** Fração assistida a partir da qual a aula é considerada concluída. */
export const COMPLETION_THRESHOLD = 0.92;
/** Abaixo disso não vale a pena retomar (começa do início). */
const MIN_RESUME_SECONDS = 5;

export function emptyProgress(videoId: string): LessonProgress {
  return { videoId, watchedSeconds: 0, durationSeconds: 0, notes: "", completed: false, updatedAt: null };
}

export function getLessonStatus(progress: LessonProgress | undefined): LessonStatus {
  if (!progress) {
    return "not_started";
  }
  if (progress.completed) {
    return "completed";
  }
  if (progress.watchedSeconds >= MIN_RESUME_SECONDS) {
    return "in_progress";
  }
  return "not_started";
}

/** Percentual real (0–1) com base na posição salva e na duração real do vídeo. */
export function getLessonRatio(progress: LessonProgress | undefined) {
  if (!progress) {
    return 0;
  }
  if (progress.completed) {
    return 1;
  }
  if (!progress.durationSeconds) {
    return 0;
  }
  return Math.min(1, Math.max(0, progress.watchedSeconds / progress.durationSeconds));
}

export function getResumePosition(progress: LessonProgress | undefined, durationSeconds: number) {
  if (!progress || progress.completed) {
    return 0;
  }
  const position = progress.watchedSeconds;
  if (position < MIN_RESUME_SECONDS || position >= durationSeconds - 3) {
    return 0;
  }
  return position;
}

export type CourseSummary = {
  total: number;
  completed: number;
  inProgress: number;
  ratio: number;
  /** Aula para o CTA "Continuar": a mais recente em andamento, senão a próxima não concluída. */
  continueLesson: Lesson | null;
  continueMode: "resume" | "next" | "start" | "done";
  upcoming: Lesson[];
};

export function summarizeCourse(progressById: Record<string, LessonProgress>): CourseSummary {
  const total = LESSONS.length;
  let completed = 0;
  let inProgress = 0;

  for (const lesson of LESSONS) {
    const status = getLessonStatus(progressById[lesson.id]);
    if (status === "completed") completed += 1;
    if (status === "in_progress") inProgress += 1;
  }

  const inProgressLessons = STUDY_SEQUENCE.filter(
    (lesson) => getLessonStatus(progressById[lesson.id]) === "in_progress"
  ).sort((a, b) => (progressById[b.id]?.updatedAt ?? 0) - (progressById[a.id]?.updatedAt ?? 0));

  const firstPending = STUDY_SEQUENCE.find(
    (lesson) => getLessonStatus(progressById[lesson.id]) !== "completed"
  );

  let continueLesson: Lesson | null = null;
  let continueMode: CourseSummary["continueMode"] = "start";

  if (inProgressLessons.length > 0) {
    continueLesson = inProgressLessons[0];
    continueMode = "resume";
  } else if (firstPending) {
    continueLesson = firstPending;
    continueMode = completed > 0 ? "next" : "start";
  } else {
    continueLesson = STUDY_SEQUENCE[0] ?? null;
    continueMode = "done";
  }

  const startIndex = continueLesson
    ? STUDY_SEQUENCE.findIndex((lesson) => lesson.id === continueLesson?.id) + 1
    : 0;
  const upcoming = STUDY_SEQUENCE.slice(startIndex)
    .concat(STUDY_SEQUENCE.slice(0, startIndex))
    .filter(
      (lesson) =>
        lesson.id !== continueLesson?.id && getLessonStatus(progressById[lesson.id]) !== "completed"
    )
    .slice(0, 3);

  return {
    total,
    completed,
    inProgress,
    ratio: total ? completed / total : 0,
    continueLesson,
    continueMode,
    upcoming,
  };
}

export function formatTime(totalSeconds: number) {
  const safe = Math.max(0, Math.floor(totalSeconds || 0));
  const hours = Math.floor(safe / 3600);
  const minutes = Math.floor((safe % 3600) / 60);
  const seconds = safe % 60;
  const mm = hours ? String(minutes).padStart(2, "0") : String(minutes);
  return `${hours ? `${hours}:` : ""}${mm}:${String(seconds).padStart(2, "0")}`;
}

export function formatDurationLabel(totalSeconds: number) {
  if (!totalSeconds) {
    return "";
  }
  const minutes = Math.max(1, Math.round(totalSeconds / 60));
  return `${minutes} min`;
}
