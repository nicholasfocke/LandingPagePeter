"use client";

import { useEffect, useState } from "react";
import Icon from "@/components/ui/Icon";

const SCENES = [
  {
    context: "Apresentação executiva",
    room: "Board meeting",
    line: "Let me walk you through this quarter’s results.",
    note: "Clareza para apresentar números a uma diretoria internacional.",
  },
  {
    context: "Negociação comercial",
    room: "Negotiation",
    line: "We can be flexible on timing, as long as the scope stays as agreed.",
    note: "Firmeza e cordialidade na mesma frase.",
  },
  {
    context: "Reunião com investidores",
    room: "Investor call",
    line: "Here’s how we plan to grow over the next three years.",
    note: "Defender uma visão com segurança e naturalidade.",
  },
  {
    context: "Cliente internacional",
    room: "Client meeting",
    line: "What matters most to you in this decision?",
    note: "Perguntas inteligentes que conduzem a conversa.",
  },
  {
    context: "Venda para comprador estrangeiro",
    room: "Property tour",
    line: "This property offers exactly the location you described.",
    note: "Apresentar um produto com vocabulário preciso.",
  },
];

const SCENE_DURATION = 5200;

export default function HeroScenes() {
  const [active, setActive] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  const isRunning = !isPaused && !reducedMotion;

  useEffect(() => {
    if (!isRunning) {
      return;
    }
    const timer = window.setTimeout(
      () => setActive((current) => (current + 1) % SCENES.length),
      SCENE_DURATION
    );
    return () => window.clearTimeout(timer);
  }, [active, isRunning]);

  const scene = SCENES[active];

  return (
    <div
      className={`hero-scenes ${isRunning ? "is-running" : ""}`}
      style={{ ["--scene-duration" as string]: `${SCENE_DURATION}ms` }}
    >
      <div className="hero-scenes__card" aria-live={isRunning ? "off" : "polite"}>
        <div className="hero-scenes__top">
          <span className="hero-scenes__room">
            <span className="hero-scenes__dot" aria-hidden="true" />
            {scene.room}
          </span>
          <span className="hero-scenes__count" aria-hidden="true">
            {String(active + 1).padStart(2, "0")} / {String(SCENES.length).padStart(2, "0")}
          </span>
        </div>

        <div className="hero-scenes__stage">
          <div key={active} className="hero-scenes__scene">
            <p className="hero-scenes__context">{scene.context}</p>
            <p className="hero-scenes__line" lang="en">
              “{scene.line}”
            </p>
            <p className="hero-scenes__note">{scene.note}</p>
          </div>
        </div>

        <div className="hero-scenes__footer">
          <div className="hero-scenes__progress" role="tablist" aria-label="Situações profissionais">
            {SCENES.map((item, index) => (
              <button
                key={item.room}
                type="button"
                role="tab"
                aria-selected={index === active}
                aria-label={item.context}
                className={`hero-scenes__tick ${index === active ? "is-active" : ""} ${
                  index < active ? "is-done" : ""
                }`}
                onClick={() => setActive(index)}
              >
                <span key={index === active ? `run-${active}` : "idle"} />
              </button>
            ))}
          </div>
          <button
            type="button"
            className="hero-scenes__pause"
            onClick={() => setIsPaused((paused) => !paused)}
            aria-label={isPaused ? "Retomar animação" : "Pausar animação"}
            hidden={reducedMotion}
          >
            <Icon name={isPaused ? "play" : "pause"} size={12} />
          </button>
        </div>
      </div>
    </div>
  );
}
