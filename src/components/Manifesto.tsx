import { useRef } from 'react';
import { MANIFESTO, MANIFESTO_ACCENTS } from '../data/content';
import { inView, pinProgress, useFrame } from '../lib/frame';

const WORDS = MANIFESTO.trim().split(/\s+/).map((w) => ({
  w,
  accent: MANIFESTO_ACCENTS.has(w.replace(/[.,]$/, '').toLowerCase()) || MANIFESTO_ACCENTS.has(w),
}));

/** Statement whose words light up one by one as the section scrolls. */
export function Manifesto() {
  const section = useRef<HTMLElement>(null);
  const text = useRef<HTMLParagraphElement>(null);
  useFrame(() => {
    const el = section.current;
    if (!el || !inView(el)) return;
    const p = pinProgress(el), n = WORDS.length;
    text.current!.querySelectorAll('.w').forEach((w, i) => w.classList.toggle('on', p * 1.2 - 0.05 > i / n));
  });
  return (
    <section id="manifesto" className="pin" ref={section}>
      <div className="stick">
        <div className="wrap">
          <p className="d mf" ref={text}>
            {WORDS.map(({ w, accent }, i) => (
              <span key={i}>
                <span className={accent ? 'w acc' : 'w'}>{w}</span>
                {i < WORDS.length - 1 ? ' ' : ''}
              </span>
            ))}
          </p>
        </div>
      </div>
    </section>
  );
}
