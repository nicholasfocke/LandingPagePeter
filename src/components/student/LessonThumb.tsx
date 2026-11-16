import Icon from "@/components/ui/Icon";
import type { Lesson } from "@/lib/course/catalog";
import type { LessonStatus } from "@/lib/course/progress";

type LessonThumbProps = {
  lesson: Lesson;
  status?: LessonStatus;
  ratio?: number;
  locked?: boolean;
  size?: "sm" | "md" | "lg";
};

/**
 * Miniatura tipográfica consistente para todas as aulas (o catálogo não possui
 * capas próprias). Mostra número do módulo, tipo e estado real do progresso.
 */
export default function LessonThumb({ lesson, status = "not_started", ratio = 0, locked = false, size = "md" }: LessonThumbProps) {
  return (
    <div
      className={`lesson-thumb lesson-thumb--${lesson.kind} lesson-thumb--${size} ${
        locked ? "is-locked" : ""
      }`}
      aria-hidden="true"
    >
      <span className="lesson-thumb__lines" />
      <span className="lesson-thumb__kind">{lesson.kind === "bonus" ? "Bônus" : "Módulo"}</span>
      <span className="lesson-thumb__number">{String(lesson.moduleNumber).padStart(2, "0")}</span>

      {locked ? (
        <span className="lesson-thumb__badge lesson-thumb__badge--locked">
          <Icon name="lock" size={14} />
        </span>
      ) : status === "completed" ? (
        <span className="lesson-thumb__badge lesson-thumb__badge--done">
          <Icon name="check" size={14} strokeWidth={2.4} />
        </span>
      ) : (
        <span className="lesson-thumb__play">
          <Icon name="play" size={size === "lg" ? 22 : 14} />
        </span>
      )}

      {!locked && status === "in_progress" ? (
        <span className="lesson-thumb__progress">
          <span style={{ transform: `scaleX(${ratio})` }} />
        </span>
      ) : null}
    </div>
  );
}
