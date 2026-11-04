import type { CSSProperties } from 'react';

export type Intent = 'work' | 'meet' | 'play' | 'unwind';

export const INTENT: Record<Intent, string> = {
  work: '#5FF2E6',
  meet: '#FFB86B',
  play: '#B8F26B',
  unwind: '#A78BFA',
};

export const INTENT_LABEL: Record<Intent, string> = { work: 'Work', meet: 'Meet', play: 'Play', unwind: 'Unwind' };

/** CSS var reference for an intent colour */
export const iv = (i: Intent) => `var(--${i})`;

export interface HeroPerson {
  name: string;
  intent: Intent;
  headline: string;
  orbit: 0 | 1 | 2;
  phase: number;
  size: number;
  match?: boolean;
  busy?: boolean;
}

export const HERO_PEOPLE: HeroPerson[] = [
  { name: 'Omar', intent: 'work', headline: 'Founder, payments · hiring', orbit: 0, phase: 0.2, size: 0.19, match: true },
  { name: 'Layla', intent: 'meet', headline: 'Product designer · new in town', orbit: 0, phase: 2.3, size: 0.16, match: true },
  { name: 'Jonas', intent: 'work', headline: 'Backend engineer', orbit: 0, phase: 4.2, size: 0.15, busy: true },
  { name: 'Sana', intent: 'work', headline: 'Seed investor', orbit: 1, phase: 0.9, size: 0.18, match: true },
  { name: 'Mira', intent: 'unwind', headline: 'Architect', orbit: 1, phase: 2.6, size: 0.16 },
  { name: 'Yuki', intent: 'meet', headline: 'Brand strategist', orbit: 1, phase: 4.1, size: 0.15 },
  { name: 'Niko', intent: 'work', headline: 'ML engineer', orbit: 1, phase: 5.5, size: 0.17 },
  { name: 'Rami', intent: 'play', headline: 'Padel · level 3', orbit: 2, phase: 0.3, size: 0.17 },
  { name: 'Bo', intent: 'unwind', headline: 'Chef', orbit: 2, phase: 1.6, size: 0.15 },
  { name: 'Aisha', intent: 'meet', headline: 'Community lead', orbit: 2, phase: 2.9, size: 0.18 },
  { name: 'Dev', intent: 'play', headline: 'Runner', orbit: 2, phase: 4.2, size: 0.14 },
  { name: 'Lena', intent: 'work', headline: 'Copywriter', orbit: 2, phase: 5.4, size: 0.15 },
];

export const NAV_LINKS = [
  ['#how', 'How it works'],
  ['#rooms', 'Rooms'],
  ['#virtual', 'Virtual'],
  ['#network', 'Network'],
  ['#clubs', 'Clubs'],
  ['#safety', 'Safety'],
  ['#venues', 'Venues'],
] as const;

/** Store links. Replace with real App Store / Google Play URLs before launch. */
export const STORE_LINKS = { appStore: '#get', googlePlay: '#get' };

export const MANIFESTO =
  'Your next co-founder is three tables away. Your doubles partner is on court two. You just never knew. CCube turns the places you already go into live rooms, so the right people can find each other. Door to handshake in fifteen minutes.';
/** Words highlighted in accent once lit */
export const MANIFESTO_ACCENTS = new Set(['co-founder', 'doubles', 'live', 'fifteen', 'minutes.']);

export const LOOP_STEPS = [
  { title: 'Enter', body: 'Scan at the door, tap, or just say yes. Tell the room why you are here today.' },
  { title: 'See the room', body: 'Who is inside, and why. Founders, hiring, new in town. Never anyone outside.' },
  { title: 'Wave', body: 'A wave is quiet. Chat opens only if they wave back. Nobody sees who declined.' },
  { title: 'Meet', body: 'Twenty minutes, then a table. Every match ends in a real meet at a staffed venue.' },
];

export const LOOP_CHIPS: { step: number; color: string; text: string; pos: CSSProperties }[] = [
  { step: 0, color: 'var(--play)', text: 'Checked in at Kōhī House', pos: { left: '4%', top: '24%' } },
  { step: 1, color: 'var(--meet)', text: '14 inside · 3 matches', pos: { right: '2%', top: '30%' } },
  { step: 2, color: 'var(--acc)', text: 'Omar waved back', pos: { left: '2%', top: '58%' } },
  { step: 3, color: 'var(--work)', text: 'Meet confirmed · corner table', pos: { right: 0, top: '64%' } },
];

export const LOOP_GLOWS = ['rgba(184,242,107,.13)', 'rgba(255,184,107,.14)', 'rgba(255,91,46,.16)', 'rgba(95,242,230,.14)'];

export interface RoomType {
  name: string;
  intent: Intent;
  format: string;
  body: string;
  /** Formation dots: [left%, top%, delay s, variant] */
  dots: [number, number, number?, ('ghost' | 'square')?][];
  /** Link line: [left%, top%, width%] */
  link?: [number, number, number];
}

export const ROOM_TYPES: RoomType[] = [
  { name: 'Cafe', intent: 'meet', format: '1 : 1', body: 'Coffee at a shared table with someone worth knowing.', dots: [[34, 52], [66, 52, 0.6]], link: [38, 52, 24] },
  { name: 'Court', intent: 'play', format: '3 + 1', body: 'A fourth for doubles at your level, before the slot expires.', dots: [[30, 36], [70, 36, 0.4], [30, 68, 0.8], [70, 68, undefined, 'ghost']] },
  { name: 'Club', intent: 'unwind', format: '3 : 3', body: 'Meet another group without the awkwardness, over a shared booth.', dots: [[24, 38], [18, 58, 0.3], [32, 64, 0.6], [76, 38, 0.9], [82, 58, 1.2], [68, 64, 1.5]] },
  { name: 'Co-work', intent: 'work', format: 'Skill swap', body: 'A twenty-minute desk-side chat with the skill you are missing.', dots: [[36, 50], [66, 50, 0.5, 'square']], link: [40, 50, 22] },
];

export const NETWORK_ROWS: { title: string; count: string; color: string; duration: number; reverse?: boolean; items: [string, string][] }[] = [
  { title: 'Talent', count: '2,140 offers', color: 'var(--work)', duration: 60, items: [['Fractional CPO', 'Dubai'], ['Arabic brand copy', 'Riyadh'], ['Series A pitch review', 'Remote'], ['Padel coaching, level 3', 'DIFC'], ['Motion designer', 'Dubai'], ['Growth advisor', 'Remote']] },
  { title: 'Infrastructure', count: '612 offers', color: 'var(--meet)', duration: 70, reverse: true, items: [['Studio space, 40 m²', 'Al Quoz'], ['Event room, 80 seats', 'DIFC'], ['Cold storage', 'Jebel Ali'], ['Podcast booth', 'D3'], ['Photo studio', 'Alserkal'], ['Demo kitchen', 'JLT']] },
  { title: 'Compute', count: '188 offers', color: 'var(--unwind)', duration: 55, items: [['8× H100, weekends', 'Abu Dhabi'], ['GPU hours for students', 'Remote'], ['Render nodes', 'Dubai'], ['Inference credits', 'Remote'], ['Edge devices lab', 'Dubai South']] },
];

export const REQUEST_STEPS = [
  ['Post', 'Say what you need: talent, infrastructure or compute. One line is enough.'],
  ['Responses', 'Offers arrive with what they bring. Names stay hidden.'],
  ['Choose', 'Pick who to connect with. Identity opens both ways, then chat.'],
  ['Close', 'Mark it solved and thank who helped.'],
] as const;

export const REQUEST_RESPONSES = [
  { initial: 'A', title: '8× H100, weekends', meta: 'Lab in Abu Dhabi · 2h ago', chosen: true },
  { initial: 'B', title: 'Inference credits', meta: 'Startup in Riyadh · 5h ago' },
  { initial: 'C', title: 'University cluster', meta: 'Research group · 1d ago' },
];

export interface Club {
  name: string;
  intent: Intent;
  mode: 'In person' | 'Virtual';
  filled: number;
  capacity: number;
  members: string[];
  host: string;
  next: string;
  place: string;
  cta: 'Join' | 'Request';
}

export const CLUBS: Club[] = [
  { name: 'Padel Thursdays', intent: 'play', mode: 'In person', filled: 6, capacity: 8, members: ['R', 'D', 'O', 'K'], host: 'Rami', next: 'Thu · 20:00', place: 'Court 2, The Padel Lab', cta: 'Join' },
  { name: 'Founder Breakfast', intent: 'meet', mode: 'In person', filled: 7, capacity: 12, members: ['A', 'O', 'S', 'N'], host: 'Aisha', next: 'Tue · 08:30', place: 'Kōhī House, DIFC', cta: 'Request' },
  { name: 'Sunday Sketch Club', intent: 'unwind', mode: 'Virtual', filled: 5, capacity: 10, members: ['L', 'M', 'B'], host: 'Layla', next: 'Sun · 19:00', place: 'Dubai Designers Club, online', cta: 'Join' },
];

export const SAFETY = [
  ['Venue-level presence', 'No map dots, no distance, no location outside a cube.'],
  ['A wave before any word', 'Mutual waves only. No photos in chat before a meet. Nobody sees who declined.'],
  ['Staffed venues', 'Share your meet with a friend in one tap. Staff get a discreet alert.'],
  ['Women-first visibility', 'Be visible only to verified profiles, or only to women.'],
] as const;
