"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import Icon from "@/components/ui/Icon";

/** Cargos conforme as legendas exibidas nos próprios vídeos. */
const TESTIMONIALS = [
  { slug: "eduardo-acioli", name: "Eduardo Acioli", role: "International Real Estate Entrepreneur" },
  { slug: "paulo-toledo", name: "Paulo Toledo", role: "CEO · CIA Inteligência Imobiliária" },
  { slug: "joao-marcelo-lyra", name: "João Marcelo Lyra", role: "Médico oftalmologista" },
  { slug: "hugo", name: "Hugo", role: "Consultor financeiro" },
  { slug: "rodrigo-coifman", name: "Rodrigo Coifman", role: "Software specialist" },
  { slug: "gerard-deokaran", name: "Gerard Deokaran", role: "Perito em investigação de explosivos" },
  { slug: "lucas", name: "Lucas", role: "" },
];

export default function Testimonials() {
  const [playing, setPlaying] = useState<string | null>(null);
  const [failed, setFailed] = useState<Record<string, boolean>>({});
  const trackRef = useRef<HTMLUListElement>(null);
  const videoRefs = useRef<Record<string, HTMLVideoElement | null>>({});

  useEffect(() => {
    if (!playing) {
      return;
    }
    const video = videoRefs.current[playing];
    video?.play().catch(() => {
      /* autoplay bloqueado: o usuário usa os controles nativos */
    });
  }, [playing]);

  function start(slug: string) {
    if (playing && playing !== slug) {
      videoRefs.current[playing]?.pause();
    }
    setPlaying(slug);
  }

  function scrollByCard(direction: 1 | -1) {
    const track = trackRef.current;
    if (!track) {
      return;
    }
    const card = track.querySelector<HTMLElement>(".testimonial");
    const step = card ? card.offsetWidth + 20 : track.clientWidth * 0.8;
    track.scrollBy({ left: step * direction, behavior: "smooth" });
  }

  return (
    <section className="section testimonials" id="depoimentos" aria-labelledby="depoimentos-title">
      <div className="container">
        <div className="section-head section-head--split testimonials__head">
          <div>
            <p className="eyebrow eyebrow--gold" data-reveal>
              Depoimentos em vídeo
            </p>
            <h2 id="depoimentos-title" className="section-title display" data-reveal style={{ ["--reveal-delay" as string]: 80 }}>
              Quem treina com Peter, <em>conta em inglês.</em>
            </h2>
          </div>
          <div className="testimonials__aside">
            <p className="lead" data-reveal style={{ ["--reveal-delay" as string]: 160 }}>
              Depoimentos reais, gravados pelos próprios alunos — empresários, médicos,
              consultores e especialistas.
            </p>
            <div className="testimonials__nav">
              <button type="button" className="round-button" onClick={() => scrollByCard(-1)} aria-label="Depoimentos anteriores">
                <Icon name="arrowLeft" size={18} />
              </button>
              <button type="button" className="round-button" onClick={() => scrollByCard(1)} aria-label="Próximos depoimentos">
                <Icon name="arrowRight" size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <ul className="testimonials__track" ref={trackRef} aria-label="Depoimentos em vídeo">
        {TESTIMONIALS.map((item, index) => {
          const isPlaying = playing === item.slug;
          return (
            <li
              key={item.slug}
              className="testimonial"
              data-reveal
              style={{ ["--reveal-delay" as string]: Math.min(index, 4) * 80 }}
            >
              <div className={`testimonial__media ${isPlaying ? "is-playing" : ""}`}>
                {isPlaying ? (
                  failed[item.slug] ? (
                    <div className="testimonial__error" role="alert">
                      <Icon name="alert" size={22} />
                      <p>Não foi possível reproduzir este vídeo agora.</p>
                      <button
                        type="button"
                        className="btn btn--ghost-light btn--sm"
                        onClick={() => {
                          setFailed((current) => ({ ...current, [item.slug]: false }));
                          setPlaying(null);
                          window.setTimeout(() => setPlaying(item.slug), 0);
                        }}
                      >
                        Tentar novamente
                      </button>
                    </div>
                  ) : (
                    <video
                      ref={(element) => {
                        videoRefs.current[item.slug] = element;
                      }}
                      className="testimonial__video"
                      src={`/media/depoimentos/${item.slug}.mp4`}
                      poster={`/images/depoimentos/${item.slug}.jpg`}
                      controls
                      playsInline
                      preload="metadata"
                      onPlay={() => {
                        if (playing !== item.slug) {
                          start(item.slug);
                        }
                      }}
                      onError={() => setFailed((current) => ({ ...current, [item.slug]: true }))}
                      aria-label={`Depoimento de ${item.name}`}
                    />
                  )
                ) : (
                  <button
                    type="button"
                    className="testimonial__poster"
                    onClick={() => start(item.slug)}
                    aria-label={`Assistir ao depoimento de ${item.name}`}
                  >
                    <Image
                      src={`/images/depoimentos/${item.slug}.jpg`}
                      alt=""
                      fill
                      sizes="(max-width: 640px) 78vw, 300px"
                      className="testimonial__image"
                    />
                    <span className="testimonial__shade" aria-hidden="true" />
                    <span className="testimonial__play" aria-hidden="true">
                      <Icon name="play" size={22} />
                    </span>
                  </button>
                )}
              </div>
              <div className="testimonial__meta">
                <p className="testimonial__name">{item.name}</p>
                {item.role ? <p className="testimonial__role">{item.role}</p> : null}
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
