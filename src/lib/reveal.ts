import { useEffect, useRef, useState } from 'react';

/**
 * Adds `.in` to every `.rv` element under `root` the first time it scrolls
 * into view. One observer for the whole page, mirroring the prototype.
 */
export function useRevealAll(root: React.RefObject<HTMLElement | null>) {
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('in');
            io.unobserve(e.target);
            e.target.dispatchEvent(new CustomEvent('reveal'));
          }
        }),
      { threshold: 0.18, rootMargin: '0px 0px -6% 0px' },
    );
    el.querySelectorAll('.rv').forEach((n) => io.observe(n));
    return () => io.disconnect();
  }, [root]);
}

/** Counts up from 0 to `to` (ease-out cubic, 1.4s) once its `.rv` ancestor is revealed. */
export function useCountUp(to: number) {
  const ref = useRef<HTMLSpanElement>(null);
  const [value, setValue] = useState(0);
  useEffect(() => {
    const host = ref.current?.closest('.rv');
    if (!host) return;
    let raf = 0;
    const start = () => {
      const t0 = performance.now();
      const step = (t: number) => {
        const k = Math.min(1, (t - t0) / 1400);
        setValue(Math.round(to * (1 - Math.pow(1 - k, 3))));
        if (k < 1) raf = requestAnimationFrame(step);
      };
      raf = requestAnimationFrame(step);
    };
    if (host.classList.contains('in')) start();
    else host.addEventListener('reveal', start, { once: true });
    return () => {
      host.removeEventListener('reveal', start);
      cancelAnimationFrame(raf);
    };
  }, [to]);
  return { ref, value };
}
