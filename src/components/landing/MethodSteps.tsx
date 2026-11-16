"use client";

import { useEffect, useRef, useState } from "react";

export type MethodStep = {
  title: string;
  en: string;
  text: string;
};

/**
 * Linha do tempo do método: o passo ativo acompanha o scroll (sem sequestrar a
 * rolagem) e a linha de progresso cresce via transform.
 */
export default function MethodSteps({ steps }: { steps: MethodStep[] }) {
  const [active, setActive] = useState(0);
  const itemRefs = useRef<Array<HTMLLIElement | null>>([]);

  useEffect(() => {
    const items = itemRefs.current.filter(Boolean) as HTMLLIElement[];
    if (!("IntersectionObserver" in window) || items.length === 0) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const index = Number((entry.target as HTMLElement).dataset.index);
            setActive(index);
          }
        }
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 }
    );

    items.forEach((item) => observer.observe(item));
    return () => observer.disconnect();
  }, []);

  const progress = steps.length > 1 ? active / (steps.length - 1) : 1;

  return (
    <div className="method-steps">
      <div className="method-steps__rail" aria-hidden="true">
        <span style={{ transform: `scaleY(${progress})` }} />
      </div>
      <ol className="method-steps__list">
        {steps.map((step, index) => (
          <li
            key={step.title}
            ref={(element) => {
              itemRefs.current[index] = element;
            }}
            data-index={index}
            className={`method-step ${index === active ? "is-active" : ""} ${
              index < active ? "is-past" : ""
            }`}
            aria-current={index === active ? "step" : undefined}
          >
            <span className="method-step__marker" aria-hidden="true">
              {String(index + 1).padStart(2, "0")}
            </span>
            <div className="method-step__body">
              <p className="method-step__en" lang="en">
                {step.en}
              </p>
              <h3 className="method-step__title">{step.title}</h3>
              <p className="method-step__text">{step.text}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
