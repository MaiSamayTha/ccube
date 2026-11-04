import { useRef, useState } from 'react';
import type { CSSProperties } from 'react';
import { LOOP_CHIPS, LOOP_GLOWS, LOOP_STEPS } from '../data/content';
import { clamp, inView, lerp, pinProgress, pointer, useFrame } from '../lib/frame';
import { Avatar, Eyebrow } from './ui';

/** Pinned section: a phone steps through Enter → See the room → Wave → Meet. */
export function HowItWorks() {
  const section = useRef<HTMLElement>(null);
  const glow = useRef<HTMLDivElement>(null);
  const steps = useRef<HTMLDivElement>(null);
  const bar = useRef<HTMLDivElement>(null);
  const phone = useRef<HTMLDivElement>(null);
  const rx = useRef(0);
  const [step, setStep] = useState(0);
  const stepRef = useRef(-1);

  useFrame(() => {
    const el = section.current;
    if (!el || !inView(el)) return;
    const p = pinProgress(el);
    const s = Math.min(3, Math.floor(p * 4));
    if (s !== stepRef.current) {
      stepRef.current = s;
      setStep(s);
      glow.current!.style.setProperty('--g', LOOP_GLOWS[s]);
    }
    const row = steps.current!.querySelectorAll<HTMLElement>('.lst')[s];
    bar.current!.style.height = (row.offsetTop + row.offsetHeight - 6) * (0.35 + 0.65 * ((p * 4) % 1 || 1)) + 'px';
    rx.current = lerp(rx.current, (p - 0.5) * -16 + pointer.x * 10, 0.08);
    const ph = phone.current!.style;
    ph.setProperty('--ry', rx.current + 'deg');
    ph.setProperty('--rx', -pointer.y * 6 + 'deg');
    const avail = innerHeight - (innerWidth < 900 ? 300 : 120);
    ph.setProperty('--ps', String(clamp(avail / 650, 0.62, 1.08)));
  });

  const on = (i: number) => (i === step ? ' on' : '');

  return (
    <section id="how" className="pin" ref={section}>
      <div className="lglow" ref={glow} />
      <div className="stick">
        <div>
          <div className="lhead">
            <Eyebrow style={{ marginBottom: 22 }}>How it works</Eyebrow>
            <h2 className="d">
              Chat is the bridge.
              <br />
              <span className="dimtxt">The meet is the point.</span>
            </h2>
          </div>
          <div className="lsteps" ref={steps}>
            <div className="lbar" ref={bar} />
            {LOOP_STEPS.map((s, i) => (
              <div key={s.title} className={'lst' + on(i)}>
                <h3 className="d">{s.title}</h3>
                <p>{s.body}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="pstage">
          <div className="phone" ref={phone} aria-hidden="true">
            <div className="screen">
              <div className="island" />
              <EnterScreen className={'scr' + on(0)} />
              <RoomScreen className={'scr' + on(1)} />
              <MatchScreen className={'scr' + on(2)} />
              <MeetScreen className={'scr' + on(3)} />
            </div>
          </div>
          {LOOP_CHIPS.map((c) => (
            <div key={c.step} className={'fchip' + (c.step <= step && c.step >= step - 1 ? ' on' : '')} style={c.pos}>
              <i style={{ background: c.color }} />
              {c.text}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function StatusBar({ time }: { time: string }) {
  return (
    <div className="sbar">
      <span>{time}</span>
      <b />
    </div>
  );
}

const split: CSSProperties = { display: 'flex', justifyContent: 'space-between' };

function EnterScreen({ className }: { className: string }) {
  return (
    <div className={className}>
      <StatusBar time="9:41" />
      <span className="pill" style={{ alignSelf: 'flex-start', background: 'rgba(184,242,107,.14)', color: 'var(--play)' }}>
        ● You have arrived
      </span>
      <div className="d" style={{ fontSize: 36, marginTop: 18 }}>
        Kōhī House,
        <br />
        DIFC
      </div>
      <div className="sm" style={{ marginTop: 26 }}>
        Why are you here today?
      </div>
      <div className="ints">
        <div style={{ borderColor: 'var(--work)', background: 'rgba(95,242,230,.1)' }}>
          <i style={{ background: 'var(--work)' }} />
          Work
        </div>
        {(['meet', 'play', 'unwind'] as const).map((k) => (
          <div key={k}>
            <i style={{ background: `var(--${k})` }} />
            {k[0].toUpperCase() + k.slice(1)}
          </div>
        ))}
      </div>
      <div className="pcta">
        Enter the cube<span>→</span>
      </div>
    </div>
  );
}

const ROOM_ROWS = [
  { l: 'O', c: 'var(--work)', name: 'Omar', sub: 'Founder, payments. Hiring.', cta: 'Wave', primary: true },
  { l: 'L', c: 'var(--meet)', name: 'Layla', sub: 'Product designer. New in town.', cta: 'Wave' },
  { l: 'J', c: 'var(--work)', name: 'Jonas', sub: 'Backend engineer. Heads down.', cta: 'Busy', busy: true },
  { l: 'M', c: 'var(--unwind)', name: 'Mira', sub: 'Architect. Winding down.', cta: 'Wave' },
];

function RoomScreen({ className }: { className: string }) {
  return (
    <div className={className}>
      <StatusBar time="9:42" />
      <div style={split} className="sm">
        <span>The cube</span>
        <span style={{ color: 'var(--ink)' }}>14 inside</span>
      </div>
      <div className="d" style={{ fontSize: 25, marginTop: 12, lineHeight: 1 }}>
        12 founders, 4 hiring, 3 new to Dubai.
      </div>
      <div className="ibar">
        <i style={{ flex: 58, background: 'var(--work)' }} />
        <i style={{ flex: 28, background: 'var(--meet)' }} />
        <i style={{ flex: 14, background: 'var(--unwind)' }} />
      </div>
      <div style={{ marginTop: 8 }}>
        {ROOM_ROWS.map((r) => (
          <div className="prow" key={r.name}>
            <Avatar letter={r.l} color={r.c} style={r.busy ? { opacity: 0.5 } : undefined} />
            <div>
              <b>{r.name}</b>
              <small>{r.sub}</small>
            </div>
            <span
              className="wv"
              style={r.primary ? { background: 'var(--acc)', color: '#050607', border: 0 } : r.busy ? { opacity: 0.4 } : undefined}
            >
              {r.cta}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function MatchScreen({ className }: { className: string }) {
  return (
    <div className={className}>
      <StatusBar time="9:43" />
      <div style={split} className="sm">
        <span>Match</span>
        <span>1 of 3</span>
      </div>
      <div className="mcard">
        <Avatar letter="O" color="var(--work)" size={72} />
        <div>
          <div className="d" style={{ fontSize: 34 }}>
            Omar
          </div>
          <div className="sm" style={{ marginTop: 6 }}>
            Founder, payments · Work
          </div>
        </div>
        <div style={{ fontSize: 15, lineHeight: 1.4 }}>He is hiring a first designer. You have shipped two fintech apps.</div>
        <span className="pill" style={{ alignSelf: 'flex-start', background: 'rgba(255,255,255,.08)' }}>
          At the bar · 30 sec walk
        </span>
      </div>
      <div style={{ display: 'flex', gap: 8, marginTop: 'auto' }}>
        <div className="pcta" style={{ flex: 1, background: '#1A1D21', color: 'var(--ink)', justifyContent: 'center', padding: 0 }}>
          Not now
        </div>
        <div className="pcta" style={{ flex: 1.4 }}>
          Wave<span>→</span>
        </div>
      </div>
    </div>
  );
}

function MeetScreen({ className }: { className: string }) {
  return (
    <div className={className}>
      <StatusBar time="9:46" />
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <Avatar letter="O" color="var(--work)" />
        <b style={{ flex: 1 }}>Omar</b>
        <span className="pill" style={{ background: 'rgba(255,91,46,.15)', color: 'var(--acc)' }}>
          17:42
        </span>
      </div>
      <div style={{ marginTop: 16, padding: '12px 14px', borderRadius: 16, border: '1px dashed rgba(255,255,255,.2)', fontSize: 13 }}>
        <span className="sm">Ice-breaker</span>
        <br />
        Ask him about the Riyadh launch.
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 14 }}>
        <div className="bub a">Free in five? I'm by the window.</div>
        <div className="bub b">On my way.</div>
      </div>
      <div style={{ marginTop: 'auto', borderRadius: 20, background: '#15181B', padding: 14, display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div className="sm">Meet spot</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 44, height: 44, borderRadius: 12, border: '1.5px solid var(--meet)', display: 'grid', placeItems: 'center' }}>
            <i style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--acc)', boxShadow: '0 0 10px var(--acc)' }} />
          </div>
          <div>
            <b>Corner table</b>
            <div className="sm">2-for-1 flat whites for meets</div>
          </div>
        </div>
        <div className="pcta" style={{ marginTop: 4, height: 46 }}>
          Confirm meet<span>✓</span>
        </div>
      </div>
    </div>
  );
}
