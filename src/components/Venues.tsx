import { useEffect, useRef, useState } from 'react';
import type { PointerEvent } from 'react';
import { inView } from '../lib/frame';
import { Avatar, Eyebrow, PillButton, RevealHeading } from './ui';

const MIX_COLORS = ['var(--work)', 'var(--meet)', 'var(--play)', 'var(--unwind)'];

/** Mouse-driven tilt shared by the venue console and founding card. */
export function tiltHandlers(opts: { transform: boolean }) {
  return {
    onPointerMove(e: PointerEvent<HTMLElement>) {
      const el = e.currentTarget, r = el.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
      el.style.setProperty('--ty', (x - 0.5) * 14 + 'deg');
      el.style.setProperty('--tx', (0.5 - y) * 12 + 'deg');
      el.style.setProperty('--mx', x * 100 + '%');
      el.style.setProperty('--my', y * 100 + '%');
      if (opts.transform) el.style.transform = `perspective(1200px) rotateX(${(0.5 - y) * 6}deg) rotateY(${(x - 0.5) * 8}deg)`;
    },
    onPointerLeave(e: PointerEvent<HTMLElement>) {
      const el = e.currentTarget;
      el.style.setProperty('--tx', '0deg');
      el.style.setProperty('--ty', '0deg');
      if (opts.transform) el.style.transform = '';
    },
  };
}

/** Live-ticking venue console (sample data). */
function useVenueStats(root: React.RefObject<HTMLElement | null>) {
  const [s, setS] = useState({ inside: 14, dwell: 72, meets: 6, mix: [58, 28, 9, 5] });
  useEffect(() => {
    const t = setInterval(() => {
      if (!root.current || !inView(root.current)) return;
      setS((prev) => {
        const a = 50 + Math.random() * 14, b = 22 + Math.random() * 10, c = 6 + Math.random() * 6;
        return {
          inside: 12 + Math.floor(Math.random() * 6),
          dwell: 66 + Math.floor(Math.random() * 12),
          meets: prev.meets + (Math.random() < 0.4 ? 1 : 0),
          mix: [a, b, c, 100 - a - b - c],
        };
      });
    }, 2200);
    return () => clearInterval(t);
  }, [root]);
  return s;
}

export function Venues() {
  const con = useRef<HTMLDivElement>(null);
  const s = useVenueStats(con);
  return (
    <section id="venues" className="sec">
      <div className="wrap ven">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
          <Eyebrow className="rv">For partner venues</Eyebrow>
          <RevealHeading first="See the room." second="Sell the moment." style={{ fontSize: 'clamp(46px,6.4vw,116px)' }} />
          <p className="rv" style={{ margin: 0, maxWidth: '28em', color: '#A9B0B6', fontSize: 18 }}>
            Head-count, intent mix and dwell time, never identities. Offers fire when two people agree to meet, and you pay only when one is redeemed.
          </p>
          <PillButton href="#get" accent className="rv" style={{ alignSelf: 'flex-start' }}>
            Become a founding venue
          </PillButton>
        </div>
        <div className="con rv" ref={con} {...tiltHandlers({ transform: true })}>
          <div className="bx">
            <span className="sm">In the room</span>
            <b>{s.inside}</b>
          </div>
          <div className="bx">
            <span className="sm">Avg dwell</span>
            <b>
              {s.dwell}
              <span style={{ fontSize: '.4em', color: 'var(--mute)', letterSpacing: 0 }}> min</span>
            </b>
          </div>
          <div className="bx">
            <span className="sm">Meets today</span>
            <b>{s.meets}</b>
          </div>
          <div className="bx wide">
            <div style={{ display: 'flex', justifyContent: 'space-between' }} className="sm">
              <span>Intent mix</span>
              <span>Live</span>
            </div>
            <div className="mix">
              {s.mix.map((f, i) => (
                <i key={i} style={{ flex: f, background: MIX_COLORS[i] }} />
              ))}
            </div>
          </div>
          <div className="wide offer">
            <Avatar letter="✦" color="var(--acc)" />
            <div style={{ flex: 1 }}>
              <b>Moment offer</b>
              <div className="sm" style={{ color: '#C9CED3' }}>
                Two people agree to meet → corner table, 2-for-1 flat whites
              </div>
            </div>
            <span className="m" style={{ fontSize: 13 }}>
              Pay on redemption
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
