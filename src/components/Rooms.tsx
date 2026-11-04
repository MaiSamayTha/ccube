import { useEffect, useRef } from 'react';
import { ROOM_TYPES, INTENT_LABEL, iv } from '../data/content';
import { css, inView, lerp, pinProgress, useFrame } from '../lib/frame';
import { Tag } from './ui';

/** Pinned section whose card track slides horizontally as you scroll down. */
export function Rooms() {
  const section = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const prog = useRef<HTMLElement>(null);
  const extra = useRef(0);
  const x = useRef(0);

  useEffect(() => {
    const size = () => {
      extra.current = Math.max(0, track.current!.scrollWidth - innerWidth);
      section.current!.style.height = innerHeight + extra.current + 'px';
    };
    size();
    addEventListener('resize', size);
    document.fonts?.ready.then(size);
    return () => removeEventListener('resize', size);
  }, []);

  useFrame(() => {
    const el = section.current;
    if (!el || !inView(el)) return;
    const p = pinProgress(el);
    x.current = lerp(x.current, -p * extra.current, 0.12);
    track.current!.style.transform = `translate3d(${x.current}px,0,0)`;
    prog.current!.style.transform = `scaleX(${p})`;
  });

  return (
    <section id="rooms" className="pin" ref={section}>
      <div className="stick">
        <div className="rtop">
          <h2 className="d">
            One cube
            <br />
            <span className="dimtxt">per venue.</span>
          </h2>
          <div className="rprog">
            <i ref={prog} />
          </div>
        </div>
        <div className="track" ref={track}>
          {ROOM_TYPES.map((r) => (
            <article key={r.name} className="room" style={css({ '--c': iv(r.intent) })}>
              <div className="tx">
                <div className="k">
                  <Tag dot={iv(r.intent)}>Default intent · {INTENT_LABEL[r.intent]}</Tag>
                  <Tag>{r.format}</Tag>
                </div>
                <h3 className="d">{r.name}</h3>
                <p>{r.body}</p>
              </div>
              <div className="form" style={css({ '--c': iv(r.intent) })} aria-hidden="true">
                <div className="fl" />
                {r.dots.map(([l, t, dl, variant], i) => (
                  <span
                    key={i}
                    className={'dot' + (variant === 'ghost' ? ' g' : variant === 'square' ? ' s' : '')}
                    style={css({
                      left: l + '%',
                      top: t + '%',
                      ...(dl !== undefined ? { '--dl': dl + 's' } : {}),
                      ...(variant === 'square' ? { '--c': 'var(--acc)' } : {}),
                    })}
                  />
                ))}
                {r.link && <span className="lk" style={{ left: r.link[0] + '%', top: r.link[1] + '%', width: r.link[2] + '%' }} />}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
