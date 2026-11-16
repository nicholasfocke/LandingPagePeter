/**
 * Catálogo público do curso digital.
 *
 * Este arquivo é seguro para o bundle do cliente: NÃO contém URLs de mídia.
 * As URLs dos vídeos e PDFs ficam em `src/lib/server/courseMedia.ts` (server-only)
 * e só são entregues pela API depois de validar login + direito de acesso.
 *
 * Os `id`s abaixo são as chaves usadas em `users/{uid}/video_progress/{id}` no
 * Firestore. Não altere sem migrar o progresso salvo dos alunos.
 */

export type LessonKind = "module" | "bonus";

export type Lesson = {
  id: string;
  kind: LessonKind;
  /** Número do módulo ao qual a aula pertence (o bônus herda o número do módulo). */
  moduleNumber: number;
  code: string;
  title: string;
  summary: string;
  hasMaterial: boolean;
};

export const COURSE = {
  id: "hpe-curso-digital",
  title: "Inglês para vendas e atendimento a clientes estrangeiros",
  eyebrow: "Curso digital HPE",
  shortTitle: "Curso digital HPE",
  description:
    "Aulas em vídeo conduzidas por Peter Focke, com material de apoio em PDF, para conduzir o atendimento a um cliente estrangeiro do primeiro contato à apresentação de um imóvel.",
} as const;

export const LESSONS: Lesson[] = [
  {
    id: "module-01",
    kind: "module",
    moduleNumber: 1,
    code: "Módulo 01",
    title: "Primeiro contato em inglês",
    summary: "Como abrir a conversa com um cliente estrangeiro com cordialidade e segurança.",
    hasMaterial: true,
  },
  {
    id: "module-02",
    kind: "module",
    moduleNumber: 2,
    code: "Módulo 02",
    title: "Perguntas inteligentes",
    summary: "Perguntas que conduzem a conversa e ajudam a entender o que o cliente procura.",
    hasMaterial: true,
  },
  {
    id: "module-03",
    kind: "module",
    moduleNumber: 3,
    code: "Módulo 03",
    title: "Análise de necessidades",
    summary: "Como identificar prioridades e critérios de decisão do cliente em inglês.",
    hasMaterial: true,
  },
  {
    id: "module-04",
    kind: "module",
    moduleNumber: 4,
    code: "Módulo 04",
    title: "Vocabulário específico",
    summary: "O vocabulário de negócios necessário para descrever, comparar e negociar.",
    hasMaterial: true,
  },
  {
    id: "module-05",
    kind: "module",
    moduleNumber: 5,
    code: "Módulo 05",
    title: "Apresentação de imóveis e vocabulário no restaurante",
    summary: "Apresentar um imóvel em inglês e conduzir a conversa em um almoço de negócios.",
    hasMaterial: true,
  },
  {
    id: "bonus-01",
    kind: "bonus",
    moduleNumber: 1,
    code: "Bônus 01",
    title: "Primeiro contato em inglês",
    summary: "Aula complementar ao Módulo 01.",
    hasMaterial: true,
  },
  {
    id: "bonus-02",
    kind: "bonus",
    moduleNumber: 2,
    code: "Bônus 02",
    title: "Perguntas inteligentes",
    summary: "Aula complementar ao Módulo 02.",
    hasMaterial: true,
  },
  {
    id: "bonus-03",
    kind: "bonus",
    moduleNumber: 3,
    code: "Bônus 03",
    title: "Análise de necessidades",
    summary: "Aula complementar ao Módulo 03.",
    hasMaterial: true,
  },
  {
    id: "bonus-04",
    kind: "bonus",
    moduleNumber: 4,
    code: "Bônus 04",
    title: "Vocabulário específico",
    summary: "Aula complementar ao Módulo 04.",
    hasMaterial: true,
  },
  {
    id: "bonus-05",
    kind: "bonus",
    moduleNumber: 5,
    code: "Bônus 05",
    title: "Apresentação de imóveis e vocabulário no restaurante",
    summary: "Aula complementar ao Módulo 05.",
    hasMaterial: true,
  },
];

export const LESSON_IDS = new Set(LESSONS.map((lesson) => lesson.id));

export type CourseModule = {
  number: number;
  title: string;
  lessons: Lesson[];
};

/** Módulos na ordem de estudo: a aula principal seguida do respectivo bônus. */
export const MODULES: CourseModule[] = Array.from(
  new Set(LESSONS.map((lesson) => lesson.moduleNumber))
)
  .sort((a, b) => a - b)
  .map((number) => {
    const lessons = LESSONS.filter((lesson) => lesson.moduleNumber === number).sort((a, b) =>
      a.kind === b.kind ? 0 : a.kind === "module" ? -1 : 1
    );
    return { number, title: lessons[0].title, lessons };
  });

/** Sequência recomendada de estudo (Módulo 01, Bônus 01, Módulo 02, Bônus 02…). */
export const STUDY_SEQUENCE: Lesson[] = MODULES.flatMap((module) => module.lessons);

export function getLesson(id: string) {
  return LESSONS.find((lesson) => lesson.id === id) ?? null;
}

export function getAdjacentLessons(id: string) {
  const index = STUDY_SEQUENCE.findIndex((lesson) => lesson.id === id);
  return {
    previous: index > 0 ? STUDY_SEQUENCE[index - 1] : null,
    next: index >= 0 && index < STUDY_SEQUENCE.length - 1 ? STUDY_SEQUENCE[index + 1] : null,
  };
}

export function lessonHref(id: string) {
  return `/videos/aula/${id}`;
}
