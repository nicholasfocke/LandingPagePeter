"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Revela elementos com `data-reveal` quando entram na tela (adiciona `.is-visible`).
 *
 * - IntersectionObserver para o caso comum;
 * - verificação leve em requestAnimationFrame durante o scroll, para que seções
 *   "puladas" numa rolagem rápida (ou num salto por âncora) também apareçam.
 * Depois da animação, o atributo é removido para devolver ao elemento as suas
 * próprias transições (hover etc.).
 */
export default function RevealObserver() {
  const pathname = usePathname();

  useEffect(() => {
    document.documentElement.setAttribute("data-reveal-ready", "");

    const pending = new Set(
      Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]:not(.is-visible)"))
    );
    if (pending.size === 0) {
      return;
    }

    let observer: IntersectionObserver | null = null;

    const reveal = (element: HTMLElement) => {
      if (!pending.has(element)) {
        return;
      }
      pending.delete(element);
      observer?.unobserve(element);
      element.classList.add("is-visible");
      const delay = Number(getComputedStyle(element).getPropertyValue("--reveal-delay")) || 0;
      window.setTimeout(() => element.removeAttribute("data-reveal"), delay + 1000);
    };

    if ("IntersectionObserver" in window) {
      observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting) {
              reveal(entry.target as HTMLElement);
            }
          }
        },
        { rootMargin: "0px 0px -8% 0px", threshold: 0.12 }
      );
      pending.forEach((element) => observer?.observe(element));
    }

    let frame = 0;
    const sweep = () => {
      frame = 0;
      const limit = window.innerHeight * 0.92;
      for (const element of Array.from(pending)) {
        if (element.getBoundingClientRect().top < limit) {
          reveal(element);
        }
      }
      if (pending.size === 0) {
        window.removeEventListener("scroll", onScroll);
      }
    };
    const onScroll = () => {
      if (!frame) {
        frame = window.requestAnimationFrame(sweep);
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    sweep();

    return () => {
      observer?.disconnect();
      window.removeEventListener("scroll", onScroll);
      if (frame) {
        window.cancelAnimationFrame(frame);
      }
    };
  }, [pathname]);

  return null;
}
