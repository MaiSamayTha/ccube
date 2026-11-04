import { SAFETY } from '../data/content';
import { RevealHeading } from './ui';

export function Safety() {
  return (
    <section id="safety" className="sec light">
      <div className="wrap">
        <div className="head">
          <RevealHeading first="Not a dating app." second="Not a map of strangers." secondColor="#8A9198" />
          <p className="rv">Nobody is shown outside a room they chose to enter. Safety ships on day one.</p>
        </div>
        {SAFETY.map(([h, p]) => (
          <div className="srow rv" key={h}>
            <h3 className="d">{h}</h3>
            <p>{p}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
