import { useEffect, useRef, useState } from 'react';
import { css, inView } from '../lib/frame';
import { Avatar, Eyebrow } from './ui';

/** CSS 3D cube toggling between solid (in person) and dashed (online). */
export function Virtual() {
  const [mode, setMode] = useState<0 | 1>(0);
  const [auto, setAuto] = useState(true);
  const cube = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!auto) return;
    const t = setInterval(() => {
      if (cube.current && inView(cube.current)) setMode((m) => (m ? 0 : 1));
    }, 3600);
    return () => clearInterval(t);
  }, [auto]);

  const pick = (v: 0 | 1) => {
    setMode(v);
    setAuto(false);
  };
  const card = (v: 0 | 1) => 'vcard' + (mode !== v ? ' off' : '');

  return (
    <section id="virtual" className="sec">
      <div className="wrap vgrid">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
          <Eyebrow className="rv" dot="var(--unwind)">
            Virtual cubes
          </Eyebrow>
          <h2 className="d" style={{ fontSize: 'clamp(46px,7vw,128px)' }}>
            <span className="rv-l rv">
              <span>Same orbit.</span>
            </span>
            <span className="rv-l rv" style={css({ '--dl': '.1s' })}>
              <span className="dimtxt">No address.</span>
            </span>
          </h2>
          <p className="rv" style={{ margin: 0, maxWidth: '28em', color: '#A9B0B6', fontSize: 18 }}>
            Online cafes and clubs tied to a city or a community. Same waves, same chat. The meet becomes a fifteen-minute call that ends on time.
          </p>
          <div className="seg rv" role="group" aria-label="Cube type" style={{ alignSelf: 'flex-start' }}>
            <button type="button" className={mode === 0 ? 'on' : undefined} aria-pressed={mode === 0} onClick={() => pick(0)}>
              In person
            </button>
            <button type="button" className={mode === 1 ? 'on' : undefined} aria-pressed={mode === 1} onClick={() => pick(1)}>
              Online
            </button>
          </div>
        </div>
        <div className="cstage">
          <div className={'c3' + (mode ? ' v' : '')} ref={cube} style={css({ '--h': 'min(120px,23vw)' })} aria-hidden="true">
            {Array.from({ length: 6 }, (_, i) => (
              <div className="f" key={i} />
            ))}
            <span className="o" style={css({ '--c': 'var(--meet)', transform: 'translate3d(-30px,10px,20px)' })} />
            <span className="o" style={css({ '--c': 'var(--work)', transform: 'translate3d(34px,-20px,-30px)' })} />
            <span className="o" style={css({ '--c': 'var(--unwind)', transform: 'translate3d(10px,34px,40px)' })} />
          </div>
          <div className={card(0)} style={{ left: 0, top: '8%' }}>
            <div className="sm">You are there</div>
            <b style={{ fontSize: 18 }}>Kōhī House, DIFC</b>
          </div>
          <div className={card(0)} style={{ right: 0, bottom: '10%' }}>
            <div className="sm">14 inside</div>
            <b style={{ fontSize: 18 }}>12 founders, 4 hiring</b>
          </div>
          <div className={card(1)} style={{ left: 0, top: '8%' }}>
            <div className="sm">You are online</div>
            <b style={{ fontSize: 18 }}>Dubai Designers Club</b>
          </div>
          <div className={card(1)} style={{ right: 0, bottom: '10%', display: 'flex', alignItems: 'center', gap: 14 }}>
            <Avatar letter="L" color="var(--meet)" />
            <div>
              <div className="sm">Virtual meet with Layla</div>
              <b style={{ font: '800 26px/1 Archivo,sans-serif', letterSpacing: '-.04em' }}>15:00</b>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
