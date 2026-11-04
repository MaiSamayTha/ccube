import type { PointerEvent } from 'react';
import { CLUBS, INTENT_LABEL, iv } from '../data/content';
import { css } from '../lib/frame';
import { Avatar, PillButton, RevealHeading, Tag } from './ui';

const MEMBER_SHADES = ['#ECEFF1', '#C9CED3', '#8A9198'];

/** Cursor-following glow on hover */
const trackGlow = (e: PointerEvent<HTMLElement>) => {
  const el = e.currentTarget, r = el.getBoundingClientRect();
  el.style.setProperty('--mx', e.clientX - r.left + 'px');
  el.style.setProperty('--my', e.clientY - r.top + 'px');
};

export function Clubs() {
  return (
    <section id="clubs" className="sec">
      <div className="wrap">
        <div className="head">
          <RevealHeading first="Small clubs." second="Run by members." />
          <p className="rv">Six to twelve people, a host, and a next session on the calendar. The fastest way from met once to see you Thursday.</p>
        </div>
        <div className="bento">
          {CLUBS.map((c, i) => (
            <article
              key={c.name}
              className="club rv"
              onPointerMove={trackGlow}
              style={css({ '--c': iv(c.intent), ...(i ? { '--dl': i / 10 + 's' } : {}) })}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Tag dot={iv(c.intent)}>
                  {INTENT_LABEL[c.intent]} · {c.mode}
                </Tag>
                <span className="m">
                  {c.filled} of {c.capacity}
                </span>
              </div>
              <div className="cap" role="meter" aria-label="Seats taken" aria-valuemin={0} aria-valuemax={c.capacity} aria-valuenow={c.filled}>
                <i style={css({ '--f': +(c.filled / c.capacity).toFixed(2) })} />
              </div>
              <h3 className="d">{c.name}</h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div className="avs">
                  {c.members.map((m, j) => (
                    <Avatar key={j} letter={m} color={j ? MEMBER_SHADES[j - 1] : iv(c.intent)} />
                  ))}
                </div>
                <span className="m" style={{ fontSize: 14 }}>
                  Hosted by {c.host}
                </span>
              </div>
              <div className="next">
                <div>
                  <span className="m" style={{ fontSize: 13 }}>
                    Next session
                  </span>
                  <b>{c.next}</b>
                  <span className="m" style={{ fontSize: 13 }}>
                    {c.place}
                  </span>
                </div>
                <PillButton href="#get">{c.cta}</PillButton>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
