import Link from "next/link";
import Icon from "@/components/ui/Icon";
import PurchaseButton from "@/components/checkout/PurchaseButton";
import { COURSE, LESSONS, MODULES } from "@/lib/course/catalog";

const SKILLS = [
  "Abrir a conversa com um cliente estrangeiro",
  "Fazer perguntas que conduzem a negociação",
  "Identificar necessidades e critérios de decisão",
  "Usar vocabulário específico com precisão",
  "Apresentar um imóvel e conduzir um almoço de negócios",
];

const FORMAT = [
  { icon: "play" as const, title: "Aulas em vídeo", text: "Conduzidas por Peter Focke." },
  { icon: "file" as const, title: "Material em PDF", text: "Material de apoio em cada aula." },
  { icon: "refresh" as const, title: "Progresso salvo", text: "Retome de onde parou, em qualquer dispositivo." },
];

export default function Course() {
  const moduleCount = LESSONS.filter((lesson) => lesson.kind === "module").length;
  const bonusCount = LESSONS.filter((lesson) => lesson.kind === "bonus").length;

  return (
    <section className="section course" id="catalogo" aria-labelledby="curso-title">
      <div className="container course__inner">
        <div className="course__copy">
          <p className="eyebrow" data-reveal>
            {COURSE.eyebrow} · Biblioteca digital
          </p>
          <h2 id="curso-title" className="section-title display" data-reveal style={{ ["--reveal-delay" as string]: 80 }}>
            {COURSE.title}
          </h2>
          <p className="lead" data-reveal style={{ ["--reveal-delay" as string]: 140 }}>
            {COURSE.description} Indicado para corretores, empreendedores e profissionais
            comerciais que atendem compradores estrangeiros.
          </p>

          <div className="course__skills" data-reveal style={{ ["--reveal-delay" as string]: 200 }}>
            <h3>Você vai praticar</h3>
            <ul>
              {SKILLS.map((skill) => (
                <li key={skill}>
                  <Icon name="check" size={16} />
                  {skill}
                </li>
              ))}
            </ul>
          </div>

          <ul className="course__format" data-reveal style={{ ["--reveal-delay" as string]: 240 }}>
            {FORMAT.map((item) => (
              <li key={item.title}>
                <span className="course__format-icon">
                  <Icon name={item.icon} size={18} />
                </span>
                <span>
                  <strong>{item.title}</strong>
                  {item.text}
                </span>
              </li>
            ))}
          </ul>

          <div className="course__actions" data-reveal style={{ ["--reveal-delay" as string]: 280 }}>
            <PurchaseButton className="btn btn--primary btn--lg">
              Comprar curso
              <Icon name="arrowRight" size={18} />
            </PurchaseButton>
            <a className="btn btn--ghost btn--lg" href="#modulos">
              Explorar módulos
            </a>
          </div>
          <p className="course__student" data-reveal>
            Já é aluno?{" "}
            <Link href="/login" className="text-link">
              Acessar a área do aluno
            </Link>
          </p>
        </div>

        <div className="course__syllabus" id="modulos" data-reveal="scale">
          <div className="syllabus">
            <div className="syllabus__head">
              <span className="syllabus__label">Conteúdo do curso</span>
              <span className="syllabus__count">
                {moduleCount} módulos · {bonusCount} aulas bônus
              </span>
            </div>
            <ol className="syllabus__list">
              {MODULES.map((module) => {
                const main = module.lessons.find((lesson) => lesson.kind === "module");
                const bonus = module.lessons.find((lesson) => lesson.kind === "bonus");
                return (
                  <li key={module.number} className="syllabus__item">
                    <span className="syllabus__number display">
                      {String(module.number).padStart(2, "0")}
                    </span>
                    <div className="syllabus__body">
                      <p className="syllabus__title">{module.title}</p>
                      {main ? <p className="syllabus__summary">{main.summary}</p> : null}
                      <div className="syllabus__tags">
                        <span className="chip">
                          <Icon name="play" size={10} />
                          Vídeo-aula
                        </span>
                        {bonus ? <span className="chip chip--gold">+ Aula bônus</span> : null}
                        {main?.hasMaterial ? (
                          <span className="chip">
                            <Icon name="file" size={12} />
                            PDF
                          </span>
                        ) : null}
                      </div>
                    </div>
                  </li>
                );
              })}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}
