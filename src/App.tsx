import { useRef } from 'react';
import { useRevealAll } from './lib/reveal';
import { Nav } from './components/Nav';
import { Hero } from './components/Hero';
import { Manifesto } from './components/Manifesto';
import { HowItWorks } from './components/HowItWorks';
import { Stats } from './components/Stats';
import { Rooms } from './components/Rooms';
import { Virtual } from './components/Virtual';
import { Network, Requests } from './components/Network';
import { Clubs } from './components/Clubs';
import { Keep } from './components/Keep';
import { Safety } from './components/Safety';
import { Venues } from './components/Venues';
import { GetIn } from './components/GetIn';

export default function App() {
  const root = useRef<HTMLElement>(null);
  useRevealAll(root);
  return (
    <>
      <Nav />
      <main ref={root}>
        <Hero />
        <Manifesto />
        <HowItWorks />
        <Stats />
        <Rooms />
        <Virtual />
        <Network />
        <Requests />
        <Clubs />
        <Keep />
        <Safety />
        <Venues />
        <GetIn />
      </main>
    </>
  );
}
