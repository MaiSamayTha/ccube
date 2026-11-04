import { useRef } from 'react';
import { NAV_LINKS } from '../data/content';
import { useFrame } from '../lib/frame';
import { Logo, PillButton } from './ui';

/** Full-width bar that condenses into a floating frosted pill once scrolled. */
export function Nav() {
  const ref = useRef<HTMLElement>(null);
  useFrame(() => ref.current?.classList.toggle('c', scrollY > 40));
  return (
    <header className="nav" ref={ref}>
      <div className="nav-in">
        <Logo />
        <nav className="links" aria-label="Sections">
          {NAV_LINKS.map(([href, label]) => (
            <a key={href} href={href}>
              {label}
            </a>
          ))}
        </nav>
        <PillButton href="#get">Get the app</PillButton>
      </div>
    </header>
  );
}
