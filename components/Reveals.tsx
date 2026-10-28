"use client";

import { useEffect } from "react";

/** Animate entrances without leaving content hidden if client scripts fail to load. */
export function Reveals() {
  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]"));
    const reduce = matchMedia("(prefers-reduced-motion: reduce)");
    if (!("IntersectionObserver" in window) || reduce.matches) {
      els.forEach((el) => el.classList.add("in"));
      return;
    }
    const animations: Animation[] = [];
    const easing = getComputedStyle(document.documentElement).getPropertyValue("--ease-out").trim();
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            const element = e.target as HTMLElement;
            element.classList.add("in");
            if (!reduce.matches && typeof element.animate === "function") {
              animations.push(
                element.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 700, easing }),
                element.animate([{ transform: "translateY(14px)" }, { transform: "translateY(0)" }], { duration: 900, easing }),
              );
            }
            io.unobserve(e.target);
          }
        }
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.05 },
    );
    els.forEach((el) => {
      if (el.getBoundingClientRect().top < window.innerHeight) el.classList.add("in");
      else io.observe(el);
    });
    return () => {
      io.disconnect();
      animations.forEach((animation) => animation.cancel());
    };
  }, []);
  return null;
}
