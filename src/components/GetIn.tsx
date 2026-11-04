import { useState } from 'react';
import type { FormEvent } from 'react';
import { Eyebrow, StoreButtons } from './ui';
import { tiltHandlers } from './Venues';

const FOOTER_LINKS = [
  ['#network', 'Network'],
  ['#clubs', 'Clubs'],
  ['#venues', 'Venues'],
  ['#safety', 'Safety'],
  ['#get', 'Get the app'],
] as const;

/**
 * Called with the waitlist email. No backend exists yet — wire this to the
 * real invitation endpoint before launch.
 */
async function requestInvite(_email: string) {}

export function GetIn() {
  const [done, setDone] = useState(false);
  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const email = new FormData(e.currentTarget).get('email') as string;
    await requestInvite(email);
    setDone(true);
  };
  return (
    <section id="get">
      <div className="gglow" />
      <div className="wrap ggrid">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 30 }}>
          <Eyebrow live className="rv">
            DIFC and Downtown · this season
          </Eyebrow>
          <h2 className="d">
            <span className="rv-l rv">
              <span>Get in.</span>
            </span>
          </h2>
          <p className="rv" style={{ margin: 0, maxWidth: '24em', fontSize: 'clamp(18px,1.6vw,24px)', color: '#C9CED3' }}>
            500 founding members, then the city. Each founding card carries three invitations of its own.
          </p>
          <StoreButtons className="rv" />
          <form className={'rv' + (done ? ' done' : '')} onSubmit={submit}>
            <div className="wl">
              <input type="email" name="email" required placeholder="Or request an invitation by email" aria-label="Email address" />
              <button className="btn o" type="submit">
                Request<span className="ar">→</span>
              </button>
            </div>
            <div className="ok" role="status">
              <i />
              You are on the list. We open your district first.
            </div>
          </form>
        </div>
        <div className="fcard-st rv">
          <div className="fcard" {...tiltHandlers({ transform: false })}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <span className="mark" style={{ color: '#050607', width: 30, height: 30 }} />
              <span style={{ fontSize: 13, fontWeight: 500 }}>Founding member</span>
            </div>
            <div>
              <div className="d">
                First
                <br />
                in.
              </div>
              <div style={{ marginTop: 18, display: 'flex', justifyContent: 'space-between', fontSize: 13, paddingTop: 14, borderTop: '1.5px dashed rgba(6,7,8,.3)' }}>
                <span>Dubai</span>
                <span>One of 500</span>
              </div>
            </div>
            <div className="inv">
              <span>Invite</span>
              <span>Invite</span>
              <span>Invite</span>
            </div>
          </div>
        </div>
      </div>
      <footer>
        <p className="huge" aria-hidden="true">
          CCube
        </p>
        <div className="fbar">
          <span>C³ — Club, community, culture</span>
          <nav aria-label="Footer">
            {FOOTER_LINKS.map(([href, label]) => (
              <a key={href} href={href}>
                {label}
              </a>
            ))}
          </nav>
          <span>Dubai, 2026</span>
        </div>
      </footer>
    </section>
  );
}

