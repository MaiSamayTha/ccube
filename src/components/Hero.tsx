import { useEffect, useRef, useState } from 'react';
import { inView, pinProgress, range, useFrame } from '../lib/frame';
import { Eyebrow, StoreButtons } from './ui';

/**
 * Pinned 420vh hero. Scroll drives the 3D camera (district → cube → inside)
 * and cross-fades three text states over it.
 */
export function Hero() {
  const section = useRef<HTMLElement>(null);
  const gl = useRef<HTMLDivElement>(null);
  const labels = useRef<HTMLDivElement>(null);
  const a = useRef<HTMLDivElement>(null);
  const b = useRef<HTMLDivElement>(null);
  const c = useRef<HTMLDivElement>(null);
  const hint = useRef<HTMLDivElement>(null);
  const progress = useRef(0);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let dispose: (() => void) | undefined;
    let cancelled = false;
    import('../hero/heroScene')
      .then(({ createHeroScene, hasWebGL }) => {
        if (cancelled) return;
        if (hasWebGL()) {
          dispose = createHeroScene({ host: gl.current!, labels: labels.current!, section: section.current!, progress });
        }
        setReady(true);
      })
      .catch((err) => {
        console.warn('CCube hero: 3D scene unavailable', err);
        if (!cancelled) setReady(true);
      });
    return () => {
      cancelled = true;
      dispose?.();
    };
  }, []);

  useFrame(() => {
    const el = section.current;
    if (!el || !inView(el)) return;
    const p = pinProgress(el);
    progress.current = p;
    const ka = range(p, 0.04, 0.2);
    const sa = a.current!.style;
    sa.opacity = String(1 - ka);
    sa.transform = `translateY(${-ka * 60}px) scale(${1 + ka * 0.06})`;
    sa.pointerEvents = ka > 0.5 ? 'none' : '';
    const kb = range(p, 0.24, 0.36) * (1 - range(p, 0.52, 0.62));
    b.current!.style.opacity = String(kb);
    b.current!.style.transform = `scale(${0.92 + range(p, 0.24, 0.62) * 0.16})`;
    const kc = range(p, 0.78, 0.88);
    c.current!.style.opacity = String(kc);
    c.current!.style.transform = `translateY(${(1 - kc) * 30}px)`;
    hint.current!.style.opacity = String(1 - range(p, 0, 0.04));
  });

  return (
    <section id="hero" className="pin" ref={section} aria-label="Step into the cube">
      <div className="stick">
        <div id="hero-gl" ref={gl} className={ready ? 'ready' : undefined} />
        <div className="loader" aria-hidden="true" />
        <div className="vig" />
        <div id="hero-labels" ref={labels} aria-hidden="true" />
        <div className="hx ha" ref={a}>
          <Eyebrow live>Live in DIFC and Downtown, Dubai</Eyebrow>
          <h1 className="d">
            Step out of
            <br />
            the cubicle.
          </h1>
          <p>Every cafe, court, club and co-working space becomes a live room. See who is here and why, then meet in person.</p>
          <StoreButtons />
        </div>
        <div className="hx hb" ref={b} style={{ opacity: 0 }}>
          <h2 className="d">
            Step into
            <br />
            the <em>cube.</em>
          </h2>
        </div>
        <div className="hx hc wrap" ref={c} style={{ opacity: 0, maxWidth: 'none' }}>
          <Eyebrow live dot="var(--play)">13 inside · Kōhī House, DIFC</Eyebrow>
          <div className="d">
            Thirteen people.
            <br />
            <span className="dimtxt">Three worth meeting.</span>
          </div>
          <div className="legend">
            {(['work', 'meet', 'play', 'unwind'] as const).map((k) => (
              <span key={k}>
                <i style={{ background: `var(--${k})` }} />
                {k[0].toUpperCase() + k.slice(1)}
              </span>
            ))}
          </div>
        </div>
        <div className="hint" ref={hint} aria-hidden="true">
          <span>Scroll to step inside</span>
          <i />
        </div>
      </div>
    </section>
  );
}
