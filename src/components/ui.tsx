import type { CSSProperties, ReactNode } from 'react';
import { STORE_LINKS } from '../data/content';

/** Pill button with the circular arrow */
export function PillButton({ href, children, accent, className = '', style }: { href: string; children: ReactNode; accent?: boolean; className?: string; style?: CSSProperties }) {
  return (
    <a href={href} className={`btn${accent ? ' o' : ''}${className ? ' ' + className : ''}`} style={style}>
      {children}
      <span className="ar" aria-hidden="true">→</span>
    </a>
  );
}

export function StoreButtons({ className = '' }: { className?: string }) {
  return (
    <div className={`stores${className ? ' ' + className : ''}`}>
      <a className="store" href={STORE_LINKS.appStore}>
        <small>Download on the</small>
        <b>App Store</b>
      </a>
      <a className="store o" href={STORE_LINKS.googlePlay}>
        <small>Get it on</small>
        <b>Google Play</b>
      </a>
    </div>
  );
}

export function Eyebrow({ children, live, dot, className = '', style }: { children: ReactNode; live?: boolean; dot?: string; className?: string; style?: CSSProperties }) {
  return (
    <div className={`eyebrow${live ? ' live' : ''}${className ? ' ' + className : ''}`} style={style}>
      <i style={dot ? { background: dot, boxShadow: `0 0 12px ${dot}` } : undefined} />
      {children}
    </div>
  );
}

/**
 * Two-line display heading where each line slides up out of a mask.
 * The second line is dimmed (or uses `secondColor` on light sections).
 */
export function RevealHeading({ first, second, secondColor, style }: { first: string; second?: string; secondColor?: string; style?: CSSProperties }) {
  return (
    <h2 className="d" style={style}>
      <span className="rv-l rv">
        <span>{first}</span>
      </span>
      {second && (
        <span className="rv-l rv" style={{ '--dl': '.1s' } as CSSProperties}>
          <span className={secondColor ? undefined : 'dimtxt'} style={secondColor ? { color: secondColor } : undefined}>
            {second}
          </span>
        </span>
      )}
    </h2>
  );
}

export function Avatar({ letter, color, size, style, className }: { letter: string; color?: string; size?: number; style?: CSSProperties; className?: string }) {
  return (
    <span
      className={`av${className ? ' ' + className : ''}`}
      style={{ background: color, ...(size ? { width: size, height: size, fontSize: Math.round(size * 0.41) } : null), ...style }}
    >
      {letter}
    </span>
  );
}

export function Tag({ children, dot, style }: { children: ReactNode; dot?: string; style?: CSSProperties }) {
  return (
    <span className="tag" style={style}>
      {dot && <i style={{ background: dot }} />}
      {children}
    </span>
  );
}

export function Logo() {
  return (
    <a href="#hero" className="logo" aria-label="CCube home">
      <span className="mark" aria-hidden="true" />
      CCube
    </a>
  );
}
