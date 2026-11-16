"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import Icon from "@/components/ui/Icon";
import LessonThumb from "@/components/student/LessonThumb";
import ProgressRing from "@/components/student/ProgressRing";
import { useStudent } from "@/components/student/StudentProvider";
import { COURSE, LESSONS, MODULES, lessonHref, type Lesson } from "@/lib/course/catalog";
import {
  formatDurationLabel,
  formatTime,
  getLessonRatio,
  getLessonStatus,
  summarizeCourse,
  type LessonStatus,
} from "@/lib/course/progress";
import { CONTACT_MESSAGES, whatsappLink } from "@/lib/site";

type Filter = "all" | LessonStatus;

const FILTERS: { id: Filter; label: string }[] = [
  { id: "all", label: "Todas" },
  { id: "in_progress", label: "Em andamento" },
  { id: "not_started", label: "Não iniciadas" },
  { id: "completed", label: "Concluídas" },
];

const STATUS_LABEL: Record<LessonStatus, string> = {
  completed: "Concluída",
  in_progress: "Em andamento",
  not_started: "Não iniciada",
};

function StatusChip({ status, locked }: { status: LessonStatus; locked: boolean }) {
  if (locked) {
    return (
      <span className="chip chip--locked">
        <Icon name="lock" size={12} />
        Indisponível
      </span>
    );
  }
  const className =
    status === "completed" ? "chip chip--success" : status === "in_progress" ? "chip chip--progress" : "chip";
  return (
    <span className={className}>
      {status === "completed" ? <Icon name="check" size={12} strokeWidth={2.4} /> : null}
      {STATUS_LABEL[status]}
    </span>
  );
}

function DashboardSkeleton() {
  return (
    <div className="dash container-student" aria-busy="true" aria-label="Carregando sua área do aluno">
      <div className="skeleton" style={{ height: 22, width: 160 }} />
      <div className="skeleton" style={{ height: 52, width: "min(420px, 80%)", marginTop: 14 }} />
      <div className="dash__top" style={{ marginTop: 32 }}>
        <div className="skeleton" style={{ height: 260, borderRadius: 28 }} />
        <div className="skeleton" style={{ height: 260, borderRadius: 28 }} />
      </div>
      <div className="dash__lessons" style={{ marginTop: 40 }}>
        {[0, 1, 2].map((key) => (
          <div key={key} className="skeleton" style={{ height: 110, borderRadius: 20 }} />
        ))}
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const { status, firstName, hasAccess, progressById, reload } = useStudent();
  const [filter, setFilter] = useState<Filter>("all");

  const summary = useMemo(() => summarizeCourse(progressById), [progressById]);
  const locked = !hasAccess;

  if (status === "loading") {
    return <DashboardSkeleton />;
  }

  if (status === "error") {
    return (
      <div className="dash container-student">
        <div className="state-card">
          <span className="state-card__icon">
            <Icon name="alert" size={24} />
          </span>
          <h1 className="state-card__title display">Não foi possível carregar sua área.</h1>
          <p>Verifique sua conexão e tente novamente. Se o problema continuar, fale com o suporte.</p>
          <div className="state-card__actions">
            <button type="button" className="btn btn--primary" onClick={() => void reload()}>
              <Icon name="refresh" size={18} />
              Tentar novamente
            </button>
            <a
              className="btn btn--ghost"
              href={whatsappLink(CONTACT_MESSAGES.support)}
              target="_blank"
              rel="noopener noreferrer"
            >
              Falar com o suporte
            </a>
          </div>
        </div>
      </div>
    );
  }

  const continueLesson = summary.continueLesson;
  const continueProgress = continueLesson ? progressById[continueLesson.id] : undefined;
  const continueRatio = getLessonRatio(continueProgress);

  const continueCopy = {
    resume: { eyebrow: "Continue de onde parou", cta: "Continuar aula" },
    next: { eyebrow: "Próxima aula", cta: "Começar aula" },
    start: { eyebrow: "Comece por aqui", cta: "Começar o curso" },
    done: { eyebrow: "Curso concluído", cta: "Rever o curso" },
  }[summary.continueMode];

  const matchesFilter = (lesson: Lesson) =>
    filter === "all" || getLessonStatus(progressById[lesson.id]) === filter;

  const visibleModules = MODULES.map((module) => ({
    ...module,
    lessons: module.lessons.filter(matchesFilter),
  })).filter((module) => module.lessons.length > 0);

  return (
    <div className="dash container-student">
      <header className="dash__welcome">
        <p className="eyebrow">{COURSE.shortTitle}</p>
        <h1 className="dash__title display">
          {firstName ? (
            <>
              Olá, <em>{firstName}.</em>
            </>
          ) : (
            <>
              Bem-vindo de <em>volta.</em>
            </>
          )}
        </h1>
        <p className="dash__subtitle">{COURSE.title}</p>
      </header>

      {locked ? (
        <div className="access-banner" role="status">
          <span className="access-banner__icon">
            <Icon name="lock" size={20} />
          </span>
          <div className="access-banner__body">
            <p className="access-banner__title">Seu acesso ao curso ainda não está ativo.</p>
            <p>
              Não encontramos uma compra vinculada a este e-mail. Se você já comprou, fale com o
              suporte para liberarmos seu acesso.
            </p>
          </div>
          <div className="access-banner__actions">
            <a
              className="btn btn--primary btn--sm"
              href={whatsappLink(CONTACT_MESSAGES.support)}
              target="_blank"
              rel="noopener noreferrer"
            >
              Falar com o suporte
            </a>
            <Link className="btn btn--ghost btn--sm" href="/#catalogo">
              Conhecer o curso
            </Link>
          </div>
        </div>
      ) : null}

      <section className="dash__top" aria-label="Resumo do seu estudo">
        {continueLesson ? (
          <article className={`continue-card ${locked ? "is-locked" : ""}`}>
            <div className="continue-card__glow" aria-hidden="true" />
            <LessonThumb
              lesson={continueLesson}
              status={getLessonStatus(continueProgress)}
              ratio={continueRatio}
              locked={locked}
              size="lg"
            />
            <div className="continue-card__body">
              <p className="continue-card__eyebrow">{continueCopy.eyebrow}</p>
              <p className="continue-card__code">{continueLesson.code}</p>
              <h2 className="continue-card__title display">{continueLesson.title}</h2>
              <p className="continue-card__summary">{continueLesson.summary}</p>
              {summary.continueMode === "resume" && continueProgress ? (
                <div className="continue-card__progress">
                  <div className="progress progress--on-dark" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(continueRatio * 100)} aria-label="Progresso da aula">
                    <span className="progress__bar" style={{ ["--value" as string]: continueRatio }} />
                  </div>
                  <span>
                    {formatTime(continueProgress.watchedSeconds)}
                    {continueProgress.durationSeconds ? ` de ${formatTime(continueProgress.durationSeconds)}` : ""}
                  </span>
                </div>
              ) : null}
              {locked ? (
                <span className="btn btn--light" aria-disabled="true">
                  <Icon name="lock" size={16} />
                  Conteúdo indisponível
                </span>
              ) : (
                <Link className="btn btn--gold" href={lessonHref(continueLesson.id)}>
                  <Icon name="play" size={14} />
                  {continueCopy.cta}
                </Link>
              )}
            </div>
          </article>
        ) : null}

        <article className="overview-card">
          <div className="overview-card__ring">
            <ProgressRing
              value={summary.ratio}
              label={`${summary.completed} de ${summary.total} aulas concluídas`}
            />
          </div>
          <div className="overview-card__body">
            <p className="overview-card__label">Seu progresso</p>
            <p className="overview-card__value">
              <strong>{summary.completed}</strong> de {summary.total} aulas concluídas
            </p>
            <dl className="overview-card__stats">
              <div>
                <dt>Em andamento</dt>
                <dd>{summary.inProgress}</dd>
              </div>
              <div>
                <dt>Restantes</dt>
                <dd>{summary.total - summary.completed}</dd>
              </div>
              <div>
                <dt>Materiais PDF</dt>
                <dd>{LESSONS.filter((lesson) => lesson.hasMaterial).length}</dd>
              </div>
            </dl>
          </div>
        </article>
      </section>

      {summary.upcoming.length > 0 && !locked ? (
        <section className="dash__section" aria-labelledby="upcoming-title">
          <div className="dash__section-head">
            <h2 id="upcoming-title" className="dash__section-title">
              Próximas aulas
            </h2>
          </div>
          <ol className="upcoming">
            {summary.upcoming.map((lesson) => (
              <li key={lesson.id}>
                <Link href={lessonHref(lesson.id)} className="upcoming__item">
                  <LessonThumb lesson={lesson} size="sm" />
                  <span className="upcoming__body">
                    <span className="upcoming__code">{lesson.code}</span>
                    <span className="upcoming__title">{lesson.title}</span>
                  </span>
                  <Icon name="chevronRight" size={18} />
                </Link>
              </li>
            ))}
          </ol>
        </section>
      ) : null}

      <section className="dash__section" aria-labelledby="library-title">
        <div className="dash__section-head">
          <h2 id="library-title" className="dash__section-title">
            Biblioteca do curso
          </h2>
          <div className="segmented" role="group" aria-label="Filtrar aulas">
            {FILTERS.map((item) => (
              <button
                key={item.id}
                type="button"
                className={`segmented__item ${filter === item.id ? "is-active" : ""}`}
                aria-pressed={filter === item.id}
                onClick={() => setFilter(item.id)}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {visibleModules.length === 0 ? (
          <div className="empty-state">
            <Icon name="book" size={22} />
            <p>Nenhuma aula neste filtro por enquanto.</p>
            <button type="button" className="text-link" onClick={() => setFilter("all")}>
              Ver todas as aulas
            </button>
          </div>
        ) : (
          <div className="library">
            {visibleModules.map((module) => (
              <section key={module.number} className="library__module" aria-label={`Módulo ${module.number}`}>
                <header className="library__module-head">
                  <span className="library__module-number display">
                    {String(module.number).padStart(2, "0")}
                  </span>
                  <div>
                    <p className="library__module-kicker">Módulo {String(module.number).padStart(2, "0")}</p>
                    <h3 className="library__module-title">{module.title}</h3>
                  </div>
                </header>
                <ul className="dash__lessons">
                  {module.lessons.map((lesson) => {
                    const progress = progressById[lesson.id];
                    const lessonStatus = getLessonStatus(progress);
                    const ratio = getLessonRatio(progress);
                    const content = (
                      <>
                        <LessonThumb lesson={lesson} status={lessonStatus} ratio={ratio} locked={locked} />
                        <div className="lesson-row__body">
                          <div className="lesson-row__meta">
                            <span className="lesson-row__code">{lesson.code}</span>
                            <StatusChip status={lessonStatus} locked={locked} />
                          </div>
                          <p className="lesson-row__title">{lesson.title}</p>
                          <p className="lesson-row__summary">{lesson.summary}</p>
                          <div className="lesson-row__foot">
                            {lesson.hasMaterial ? (
                              <span className="lesson-row__tag">
                                <Icon name="file" size={14} />
                                PDF
                              </span>
                            ) : null}
                            {progress?.durationSeconds ? (
                              <span className="lesson-row__tag">
                                <Icon name="clock" size={14} />
                                {formatDurationLabel(progress.durationSeconds)}
                              </span>
                            ) : null}
                            {lessonStatus === "in_progress" ? (
                              <span className="lesson-row__tag">{Math.round(ratio * 100)}% assistido</span>
                            ) : null}
                          </div>
                        </div>
                        {!locked ? (
                          <span className="lesson-row__go" aria-hidden="true">
                            <Icon name="arrowRight" size={18} />
                          </span>
                        ) : null}
                      </>
                    );

                    return (
                      <li key={lesson.id}>
                        {locked ? (
                          <div className="lesson-row is-locked" aria-disabled="true">
                            {content}
                          </div>
                        ) : (
                          <Link href={lessonHref(lesson.id)} className="lesson-row">
                            {content}
                          </Link>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </section>
            ))}
          </div>
        )}
      </section>

      <aside className="support-card">
        <span className="support-card__icon">
          <Icon name="chat" size={22} />
        </span>
        <div>
          <p className="support-card__title">Precisa de ajuda?</p>
          <p>Dúvidas sobre acesso, vídeos ou materiais? Fale com o suporte do HPE pelo WhatsApp.</p>
        </div>
        <a
          className="btn btn--ghost btn--sm"
          href={whatsappLink(CONTACT_MESSAGES.support)}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Icon name="whatsapp" size={16} />
          Falar com o suporte
        </a>
      </aside>
    </div>
  );
}
