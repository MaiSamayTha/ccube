import { css } from '../lib/frame';
import { useCountUp } from '../lib/reveal';

function Count({ to }: { to: number }) {
  const { ref, value } = useCountUp(to);
  return <span ref={ref}>{value}</span>;
}

export function Stats() {
  return (
    <section className="sec">
      <div className="wrap">
        <div className="stats">
          <div className="stat rv">
            <div className="d n">
              <Count to={15} />
              <sup>min</sup>
            </div>
            <p>Door to handshake.</p>
          </div>
          <div className="stat rv" style={css({ '--dl': '.12s' })}>
            <div className="d n">
              <Count to={3} />
              <sup>max</sup>
            </div>
            <p>Matches per check-in. Quality over a feed.</p>
          </div>
          <div className="stat rv" style={css({ '--dl': '.24s' })}>
            <div className="d n">0</div>
            <p>Dots on a map. Ever.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
