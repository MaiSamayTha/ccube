import { NETWORK_ROWS, REQUEST_RESPONSES, REQUEST_STEPS } from '../data/content';
import { css } from '../lib/frame';
import { RevealHeading, Tag } from './ui';

export function Network() {
  return (
    <section id="network" className="sec" style={{ paddingTop: 'clamp(60px,8vw,120px)' }}>
      <div className="wrap head">
        <RevealHeading first="Bring what" second="you can do." />
        <p className="rv">The capability network. List what you can offer, browse what others can. Requests and connections only. No marketplace, no payments.</p>
      </div>
      <div className="mq">
        {NETWORK_ROWS.map((row) => {
          const chips = (dup: boolean) => (
            <>
              <div className="chip h" aria-hidden={dup || undefined}>
                {row.title} <span>{row.count}</span>
              </div>
              {row.items.map(([what, where]) => (
                <div className="chip" key={what} aria-hidden={dup || undefined}>
                  <i style={{ background: row.color }} />
                  {what}
                  <span>{where}</span>
                </div>
              ))}
            </>
          );
          return (
            <div key={row.title} className={'mrow' + (row.reverse ? ' r' : '')} style={css({ '--t': row.duration + 's' })}>
              {chips(false)}
              {chips(true)}
            </div>
          );
        })}
      </div>
      <div className="wrap privacy rv">
        <Tag>Counts per cube and city</Tag>
        <Tag>Never people on a map</Tag>
        <Tag>Identity opens only when both sides agree</Tag>
      </div>
    </section>
  );
}

export function Requests() {
  return (
    <section className="sec light">
      <div className="wrap req">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 56 }}>
          <RevealHeading first="Ask the network." second="Choose who answers." secondColor="#8A9198" style={{ fontSize: 'clamp(46px,6.4vw,116px)' }} />
          <div className="rsteps">
            {REQUEST_STEPS.map(([h, p], i) => (
              <div key={h} className="rv" style={i ? css({ '--dl': i / 10 + 's' }) : undefined}>
                <h4>{h}</h4>
                <p>{p}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="rcard rv">
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
            <span className="pill" style={{ background: '#050607', color: '#fff', height: 26 }}>
              Request · Compute
            </span>
            <span className="m">Closes Fri</span>
          </div>
          <div className="d" style={{ fontSize: 'clamp(28px,2.6vw,40px)', lineHeight: 1 }}>
            200 GPU hours to fine-tune an Arabic speech model.
          </div>
          <div className="m" style={{ fontSize: 14 }}>
            3 responses
          </div>
          {REQUEST_RESPONSES.map((r, i) => (
            <div key={r.initial} className={'resp' + (r.chosen ? ' ch' : '')} style={css({ '--dl': (0.3 + i * 0.2).toFixed(1) + 's' })}>
              <span className="av">{r.initial}</span>
              <div>
                <b>{r.title}</b>
                <small>{r.meta}</small>
              </div>
              <em>{r.chosen ? 'Chosen' : 'Choose'}</em>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
