"use client";

import { useEffect, useRef } from "react";

/**
 * Straightens its child as the page scrolls: `--tilt` goes from 1 (angled, at the top
 * of the page) to 0 (flat) by the time the panel has risen near the nav.
 * CSS owns the actual transform; this only feeds the progress.
 */
export function TiltOnScroll({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)");
    if (reduce.matches) return;

    let frame = 0;
    let start = 0;
    let end = 1;

    const measure = () => {
      const top = el.getBoundingClientRect().top + scrollY;
      start = 0;
      // flat once the panel's top edge is ~120px below the viewport top
      end = Math.max(1, top - 120);
    };
    const update = () => {
      frame = 0;
      const p = Math.min(1, Math.max(0, (scrollY - start) / (end - start)));
      el.style.setProperty("--tilt", String(1 - p));
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    const onResize = () => {
      measure();
      onScroll();
    };

    measure();
    update();
    addEventListener("scroll", onScroll, { passive: true });
    addEventListener("resize", onResize);
    return () => {
      removeEventListener("scroll", onScroll);
      removeEventListener("resize", onResize);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div ref={ref} className="replay__tilt">
      {children}
    </div>
  );
}
