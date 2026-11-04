# CCube landing

Production build of the `CCube Landing v3` design (Claude Design handoff).
React 19 · Vite · Tailwind 4 · three.js 0.160.

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # typecheck + production build to dist/
npm run preview
```

## Structure

```
src/
  App.tsx                 page composition, one reveal observer for all `.rv`
  styles/site.css         design CSS + Tailwind theme tokens (no preflight)
  data/content.ts         copy, people, rooms, network offers, clubs
  lib/frame.ts            single rAF loop (useFrame), scroll/pointer helpers
  lib/reveal.ts           reveal-on-scroll + count-up
  hero/heroScene.ts       three.js hero (lazy-loaded chunk)
  components/             one file per section
```

- **Hero**: a 420vh pinned section. Scroll progress drives the camera from the
  district lattice into the cube, then inside it. The 3D scene is code-split and only
  loads after first paint. Without WebGL, the hero text still renders over the dark
  background.
- **Pinned sections** (`#manifesto`, `#how`, `#rooms`) read their progress from
  `pinProgress()` in the shared frame loop.
- **Reduced motion**: camera drift, orbits, marquees and reveal transitions are disabled.
- Tailwind's preflight reset is intentionally left out. The design depends on browser
  defaults (e.g. `<sup>`), so tokens and utilities are imported on their own.
- Rules that combine Archivo's `font-stretch` with a font size use longhand
  properties. Vite's minifier would otherwise merge them into an invalid `font:`
  shorthand, and the browser would drop the rule.

## Before launch

- `STORE_LINKS` in `src/data/content.ts`: real App Store / Google Play URLs
  (currently `#get`).
- `requestInvite()` in `src/components/GetIn.tsx`: wire up the waitlist endpoint.
- Venue console numbers are sample data that tick randomly.
