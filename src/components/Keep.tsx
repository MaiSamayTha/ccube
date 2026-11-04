import { useRef } from 'react';
import { inView, useFrame } from '../lib/frame';
import { Avatar, RevealHeading, Tag } from './ui';

const small = { height: 28, fontSize: 12 };

/** Profile card + memory polaroid with opposing scroll parallax. */
export function Keep() {
  const prof = useRef<HTMLDivElement>(null);
  const pola = useRef<HTMLDivElement>(null);
  useFrame(() => {
    for (const [el, speed, rot] of [
      [prof.current, -0.06, 0],
      [pola.current, 0.08, 5],
    ] as const) {
      if (!el || !inView(el)) continue;
      const r = el.getBoundingClientRect();
      const d = r.top + r.height / 2 - innerHeight / 2;
      el.style.transform = `translateY(${d * speed}px) rotate(${rot}deg)`;
    }
  });
  return (
    <section className="sec" style={{ paddingTop: 0 }}>
      <div className="wrap keep">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
          <RevealHeading first="Show your work." second="Keep the people." style={{ fontSize: 'clamp(46px,6.4vw,116px)' }} />
          <p className="rv" style={{ margin: 0, maxWidth: '28em', color: '#A9B0B6', fontSize: 18 }}>
            A profile built on what you have made, not how you look. And a private timeline of who you actually met, saved only when you both say yes.
          </p>
          <div className="privacy rv" style={{ margin: 0 }}>
            <Tag>Files open after a mutual wave</Tag>
            <Tag>Photos unlock after a meet</Tag>
          </div>
        </div>
        <div className="kstage">
          <div className="prof" ref={prof}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <Avatar letter="H" color="var(--meet)" size={54} />
              <div>
                <b style={{ fontSize: 18 }}>Hana</b>
                <div className="sm">Product designer · two fintech apps shipped</div>
              </div>
            </div>
            <div className="work">
              <div>Checkout redesign</div>
              <div>Riyadh bank app</div>
              <div>Workshop</div>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              <Tag style={small}>Product design</Tag>
              <Tag style={small}>Fintech</Tag>
              <Tag style={small}>Intros in Dubai</Tag>
            </div>
          </div>
          <div className="pola" ref={pola}>
            <div className="ph">Your photo</div>
            <dl>
              <dt>Who</dt>
              <dd>Omar and Hana</dd>
              <dt>Where</dt>
              <dd>Kōhī House, DIFC</dd>
              <dt>When</dt>
              <dd>Tue 4 Nov · 21:14</dd>
            </dl>
          </div>
        </div>
      </div>
    </section>
  );
}
