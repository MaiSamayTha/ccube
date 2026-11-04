import { useEffect, useRef } from 'react';
import type { CSSProperties } from 'react';

/* Math helpers (same semantics as the prototype's scroll.js) */
export const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
/** Normalised position of p within [a,b], clamped to 0..1 */
export const range = (p: number, a: number, b: number) => clamp((p - a) / (b - a));
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/** Scroll progress (0..1) through a tall pinned section */
export const pinProgress = (el: HTMLElement) => {
  const r = el.getBoundingClientRect();
  const total = el.offsetHeight - innerHeight;
  return total > 0 ? clamp(-r.top / total) : 0;
};

export const inView = (el: Element) => {
  const r = el.getBoundingClientRect();
  return r.bottom > -50 && r.top < innerHeight + 50;
};

/** Shared pointer position, normalised to -0.5..0.5 of the viewport */
export const pointer = { x: 0, y: 0 };
if (typeof window !== 'undefined') {
  addEventListener(
    'pointermove',
    (e) => {
      pointer.x = e.clientX / innerWidth - 0.5;
      pointer.y = e.clientY / innerHeight - 0.5;
    },
    { passive: true },
  );
}

/* One requestAnimationFrame loop drives every scroll-linked effect. */
type FrameFn = () => void;
const subscribers = new Set<FrameFn>();
let rafId = 0;
const loop = () => {
  subscribers.forEach((fn) => fn());
  rafId = requestAnimationFrame(loop);
};

export function onFrame(fn: FrameFn) {
  subscribers.add(fn);
  if (!rafId) rafId = requestAnimationFrame(loop);
  return () => {
    subscribers.delete(fn);
    if (!subscribers.size) {
      cancelAnimationFrame(rafId);
      rafId = 0;
    }
  };
}

/** Run `fn` every animation frame; always calls the latest closure. */
export function useFrame(fn: FrameFn) {
  const ref = useRef(fn);
  ref.current = fn;
  useEffect(() => onFrame(() => ref.current()), []);
}

/** Typed helper for inline styles that set CSS custom properties. */
export const css = (o: Record<string, string | number>) => o as CSSProperties;

export const prefersReducedMotion = () =>
  typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches;
