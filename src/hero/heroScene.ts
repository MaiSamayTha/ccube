/**
 * CCube hero: district lattice → the cube → inside, driven by scroll.
 * Ported from the prototype's ccube/hero3d.js; visuals and timings unchanged.
 */
import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { INTENT, HERO_PEOPLE } from '../data/content';
import { pointer, prefersReducedMotion } from '../lib/frame';

export interface HeroSceneOptions {
  host: HTMLElement;
  labels: HTMLElement;
  section: HTMLElement;
  /** Scroll progress through the hero, 0..1; read every frame. */
  progress: { current: number };
}

export function hasWebGL() {
  try {
    const c = document.createElement('canvas');
    return !!(c.getContext('webgl2') || c.getContext('webgl'));
  } catch {
    return false;
  }
}

export function createHeroScene({ host, labels, section, progress }: HeroSceneOptions) {
  const disposables: { dispose(): void }[] = [];
  const track = <T extends { dispose(): void }>(x: T) => (disposables.push(x), x);

  const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 1.75));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1;
  host.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  scene.background = new THREE.Color('#050607');
  scene.fog = new THREE.FogExp2(0x050607, 0.03);
  const pmrem = track(new THREE.PMREMGenerator(renderer));
  const roomEnv = new RoomEnvironment();
  scene.environment = track(pmrem.fromScene(roomEnv, 0.04).texture);
  const camera = new THREE.PerspectiveCamera(40, 1, 0.03, 200);

  // soft radial glow sprite
  const gc = document.createElement('canvas');
  gc.width = gc.height = 128;
  const g2 = gc.getContext('2d')!;
  const gr = g2.createRadialGradient(64, 64, 0, 64, 64, 64);
  gr.addColorStop(0, 'rgba(255,255,255,1)');
  gr.addColorStop(0.22, 'rgba(255,255,255,.42)');
  gr.addColorStop(0.55, 'rgba(255,255,255,.08)');
  gr.addColorStop(1, 'rgba(255,255,255,0)');
  g2.fillStyle = gr;
  g2.fillRect(0, 0, 128, 128);
  const glowTex = track(new THREE.CanvasTexture(gc));
  glowTex.colorSpace = THREE.SRGBColorSpace;
  const glow = (color: THREE.ColorRepresentation, sc: number, op: number) => {
    const sp = new THREE.Sprite(
      track(
        new THREE.SpriteMaterial({
          map: glowTex,
          color,
          transparent: true,
          opacity: op,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
        }),
      ),
    );
    sp.scale.set(sc, sc, 1);
    return sp;
  };
  const deep = glow(0x1d3f8a, 26, 0.16);
  deep.material.fog = false;
  scene.add(deep);

  // ── the cube ─────────────────────────────────────────────
  const H = 2;
  const room = new THREE.Group();
  scene.add(room);
  const barMat = track(new THREE.MeshBasicMaterial({ color: new THREE.Color(1.2, 1.34, 1.6) }));
  const haloMat = track(
    new THREE.MeshBasicMaterial({
      color: new THREE.Color(0.35, 0.45, 0.6),
      transparent: true,
      opacity: 0.05,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    }),
  );
  const frameMat = track(new THREE.MeshStandardMaterial({ color: 0x0a0c0f, metalness: 0.85, roughness: 0.32 }));
  const unit = track(new THREE.BoxGeometry(1, 1, 1));
  type V3 = [number, number, number];
  const place = (mat: THREE.Material, pos: V3, scl: V3) => {
    const m = new THREE.Mesh(unit, mat);
    m.position.set(...pos);
    m.scale.set(...scl);
    room.add(m);
  };
  for (let ax = 0; ax < 3; ax++)
    for (const u of [-1, 1])
      for (const w of [-1, 1]) {
        const o1 = (ax + 1) % 3, o2 = (ax + 2) % 3;
        const fp: V3 = [0, 0, 0];
        fp[o1] = u * H;
        fp[o2] = w * H;
        const fs: V3 = [0.07, 0.07, 0.07];
        fs[ax] = 2 * H + 0.07;
        place(frameMat, fp, fs);
        for (const k of [0, 1]) {
          const p: V3 = [0, 0, 0];
          p[o1] = u * (H - (k ? 0.1 : 0.03));
          p[o2] = w * (H - (k ? 0.03 : 0.1));
          const sc: V3 = [0.024, 0.024, 0.024];
          sc[ax] = 2 * H * 0.74;
          place(barMat, p, sc);
          const sh: V3 = [0.11, 0.11, 0.11];
          sh[ax] = 2 * H * 0.76;
          place(haloMat, p, sh);
        }
      }
  const glass = track(
    new THREE.MeshPhysicalMaterial({
      color: 0x05070a,
      metalness: 0.6,
      roughness: 0.08,
      transparent: true,
      opacity: 0.16,
      side: THREE.DoubleSide,
      depthWrite: false,
      envMapIntensity: 0.22,
    }),
  );
  const wallGeo = track(new THREE.PlaneGeometry(2 * H, 2 * H));
  (
    [
      [0, 0, H, 0, 0],
      [0, 0, -H, 0, Math.PI],
      [H, 0, 0, 0, Math.PI / 2],
      [-H, 0, 0, 0, -Math.PI / 2],
      [0, H, 0, -Math.PI / 2, 0],
      [0, -H, 0, Math.PI / 2, 0],
    ] as const
  ).forEach((f) => {
    const m = new THREE.Mesh(wallGeo, glass);
    m.position.set(f[0], f[1], f[2]);
    m.rotation.set(f[3], f[4], 0);
    m.renderOrder = 2;
    room.add(m);
  });
  const grid = new THREE.GridHelper(2 * H, 10, 0x9fb4c8, 0x9fb4c8);
  grid.position.y = -H + 0.01;
  const gridMat = grid.material as THREE.Material;
  gridMat.transparent = true;
  gridMat.opacity = 0.1;
  room.add(grid);
  disposables.push(grid.geometry, gridMat);

  // ── district lattice ─────────────────────────────────────
  const lattice = new THREE.Group();
  scene.add(lattice);
  const D = 9;
  const seg: number[] = [], frameSeg: number[] = [], dots: number[] = [], dcol: number[] = [];
  let seed = 7;
  const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  const ints = Object.values(INTENT).map((x) => new THREE.Color(x));
  for (let i = -3; i <= 3; i++)
    for (let j = -1; j <= 1; j++)
      for (let k = -3; k <= 3; k++) {
        if (!i && !j && !k) continue;
        const c = [i * D, j * D, k * D];
        for (let ax = 0; ax < 3; ax++)
          for (const u of [-1, 1])
            for (const w of [-1, 1]) {
              const o1 = (ax + 1) % 3, o2 = (ax + 2) % 3;
              const A = c.slice(), B = c.slice();
              A[o1] += u * H; A[o2] += w * H;
              B[o1] += u * H; B[o2] += w * H;
              A[ax] -= H * 0.74; B[ax] += H * 0.74;
              seg.push(...A, ...B);
            }
        const n = Math.floor(rnd() * 8);
        for (let q = 0; q < n; q++) {
          dots.push(c[0] + (rnd() - 0.5) * 2.6, c[1] + (rnd() - 0.5) * 2.6, c[2] + (rnd() - 0.5) * 2.6);
          const cc = ints[Math.floor(rnd() * 4)];
          dcol.push(cc.r, cc.g, cc.b);
        }
      }
  for (let j = -1; j <= 1; j++)
    for (let k = -3; k <= 3; k++)
      for (const u of [-1, 1])
        for (const w of [-1, 1]) {
          frameSeg.push(-34, j * D + u * H, k * D + w * H, 34, j * D + u * H, k * D + w * H);
          frameSeg.push(k * D + w * H, j * D + u * H, -34, k * D + w * H, j * D + u * H, 34);
        }
  for (let i = -3; i <= 3; i++)
    for (let k = -3; k <= 3; k++)
      for (const u of [-1, 1])
        for (const w of [-1, 1]) frameSeg.push(i * D + u * H, -16, k * D + w * H, i * D + u * H, 16, k * D + w * H);
  const lg = track(new THREE.BufferGeometry());
  lg.setAttribute('position', new THREE.Float32BufferAttribute(seg, 3));
  lattice.add(
    new THREE.LineSegments(
      lg,
      track(new THREE.LineBasicMaterial({ color: new THREE.Color(0.7, 0.8, 0.95), transparent: true, opacity: 0.4 })),
    ),
  );
  const fg = track(new THREE.BufferGeometry());
  fg.setAttribute('position', new THREE.Float32BufferAttribute(frameSeg, 3));
  lattice.add(
    new THREE.LineSegments(fg, track(new THREE.LineBasicMaterial({ color: 0x8fa3b8, transparent: true, opacity: 0.09 }))),
  );
  const pg = track(new THREE.BufferGeometry());
  pg.setAttribute('position', new THREE.Float32BufferAttribute(dots, 3));
  pg.setAttribute('color', new THREE.Float32BufferAttribute(dcol, 3));
  lattice.add(
    new THREE.Points(
      pg,
      track(
        new THREE.PointsMaterial({
          size: 0.38,
          map: glowTex,
          vertexColors: true,
          transparent: true,
          depthWrite: false,
          blending: THREE.AdditiveBlending,
        }),
      ),
    ),
  );

  // ── you ──────────────────────────────────────────────────
  const you = new THREE.Group();
  scene.add(you);
  you.add(
    new THREE.Mesh(
      track(new THREE.SphereGeometry(0.17, 64, 48)),
      track(
        new THREE.MeshPhysicalMaterial({
          color: 0xffffff,
          emissive: 0xffffff,
          emissiveIntensity: 0.12,
          roughness: 0.38,
          envMapIntensity: 0.9,
          clearcoat: 1,
        }),
      ),
    ),
  );
  you.add(glow(0xffffff, 1.1, 0.08));
  const ring = new THREE.Mesh(
    track(new THREE.TorusGeometry(0.32, 0.006, 8, 160)),
    track(new THREE.MeshBasicMaterial({ color: 0xdfe6ee, transparent: true, opacity: 0.55 })),
  );
  ring.rotation.set(1.25, 0.2, 0.35);
  you.add(ring);
  const ring2 = new THREE.Mesh(
    track(new THREE.TorusGeometry(0.42, 0.004, 8, 160)),
    track(new THREE.MeshBasicMaterial({ color: 0xdfe6ee, transparent: true, opacity: 0.18 })),
  );
  ring2.rotation.set(1.6, -0.3, -0.5);
  you.add(ring2);
  scene.add(new THREE.PointLight(0xffffff, 3, 6, 1.6));
  scene.add(new THREE.AmbientLight(0xffffff, 0.35));
  const key = new THREE.DirectionalLight(0xffffff, 1.6);
  key.position.set(-4, 6, 5);
  scene.add(key);

  // ── orbits + people ──────────────────────────────────────
  const ORB = (
    [
      [0.85, new THREE.Euler(0.42, 0, 0.22)],
      [1.3, new THREE.Euler(-0.55, 0.3, 0.62)],
      [1.68, new THREE.Euler(0.16, -0.2, -0.36)],
    ] as const
  ).map(([r, e]) => {
    const q = new THREE.Quaternion().setFromEuler(e);
    const pts: THREE.Vector3[] = [];
    for (let i = 0; i <= 160; i++) {
      const t = (i / 160) * Math.PI * 2;
      pts.push(new THREE.Vector3(Math.cos(t) * r, 0, Math.sin(t) * r).applyQuaternion(q));
    }
    const m = track(new THREE.LineBasicMaterial({ color: 0x9fb6cc, transparent: true, opacity: 0.2 }));
    scene.add(new THREE.Line(track(new THREE.BufferGeometry().setFromPoints(pts)), m));
    return { r, q };
  });

  const sphere = track(new THREE.SphereGeometry(1, 48, 32));
  const sparkGeo = track(new THREE.SphereGeometry(0.018, 12, 8));
  const people = HERO_PEOPLE.map((p) => {
    const col = new THREE.Color(INTENT[p.intent]);
    const mat = track(
      new THREE.MeshPhysicalMaterial({
        color: col,
        roughness: p.busy ? 0.6 : 0.32,
        metalness: 0,
        clearcoat: 0.6,
        clearcoatRoughness: 0.2,
        emissive: col,
        emissiveIntensity: p.busy ? 0 : 0.04,
        transparent: true,
        envMapIntensity: 0.9,
      }),
    );
    const mesh = new THREE.Mesh(sphere, mat);
    mesh.scale.setScalar(p.size);
    scene.add(mesh);
    const halo = glow(col, p.size * 2.6, p.busy ? 0 : 0.06);
    scene.add(halo);
    let thread: { line: THREE.Line; lineMat: THREE.LineBasicMaterial; spark: THREE.Mesh; sparkMat: THREE.MeshBasicMaterial } | null = null;
    if (p.match) {
      const geo = track(new THREE.BufferGeometry());
      geo.setAttribute('position', new THREE.Float32BufferAttribute(new Float32Array(96), 3));
      const lineMat = track(new THREE.LineBasicMaterial({ color: 0xff5b2e, transparent: true, opacity: 0.5 }));
      const sparkMat = track(new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true }));
      thread = { line: new THREE.Line(geo, lineMat), lineMat, spark: new THREE.Mesh(sparkGeo, sparkMat), sparkMat };
      scene.add(thread.line, thread.spark);
    }
    const el = document.createElement('div');
    el.className = 'pl' + (p.match ? ' mt' : '');
    const dot = document.createElement('i');
    dot.style.background = INTENT[p.intent];
    const name = document.createElement('b');
    name.textContent = p.name;
    const head = document.createElement('span');
    head.textContent = p.headline;
    el.append(dot, name, head);
    labels.appendChild(el);
    return { p, mesh, mat, halo, thread, el, base: p.busy ? 0 : 0.06, lastOpacity: -1 };
  });
  const youEl = document.createElement('div');
  youEl.className = 'pl you';
  youEl.innerHTML = '<b>You</b>';
  labels.appendChild(youEl);

  // ── post-processing ──────────────────────────────────────
  const composer = new EffectComposer(renderer);
  composer.addPass(new RenderPass(scene, camera));
  const bloom = new UnrealBloomPass(new THREE.Vector2(800, 600), 0.55, 0.4, 0.9);
  composer.addPass(bloom);
  composer.addPass(new OutputPass());

  let W = 1, Hh = 1;
  const resize = () => {
    W = host.clientWidth || innerWidth;
    Hh = host.clientHeight || innerHeight;
    renderer.setSize(W, Hh, false);
    composer.setSize(W, Hh);
    camera.aspect = W / Hh;
    camera.fov = W < 700 ? 54 : 40;
    camera.updateProjectionMatrix();
  };
  const ro = new ResizeObserver(resize);
  ro.observe(host);
  resize();
  let visible = true;
  const io = new IntersectionObserver((e) => (visible = e[0].isIntersecting), { rootMargin: '100px' });
  io.observe(section);
  const reduce = prefersReducedMotion();

  // scroll path keyframes: [progress, camera distance, polar angle]
  const K = [[0, 26, 1.14], [0.42, 9.5, 1.12], [0.72, 4.2, 1.18], [0.86, 2.7, 1.24], [1, 2.5, 1.26]];
  const ss = (t: number) => t * t * (3 - 2 * t);
  const path = (p: number) => {
    let i = 0;
    while (i < K.length - 2 && p > K[i + 1][0]) i++;
    const a = K[i], b = K[i + 1];
    const t = ss(Math.min(1, Math.max(0, (p - a[0]) / (b[0] - a[0]))));
    return {
      d: Math.exp(Math.log(a[1]) + (Math.log(b[1]) - Math.log(a[1])) * t),
      ph: a[2] + (b[2] - a[2]) * t,
    };
  };

  let pr = 0, lt = performance.now(), T = 0, th = 0.75, smx = 0, smy = 0;
  const v = new THREE.Vector3(), tmp = new THREE.Vector3();
  const cv = new THREE.QuadraticBezierCurve3(new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3());

  const project = (pos: THREE.Vector3, lift: number, el: HTMLElement & { _o?: number }, alpha: number) => {
    v.copy(pos);
    v.y += lift;
    v.project(camera);
    const ok = v.z < 1 && Math.abs(v.x) < 1.1 && Math.abs(v.y) < 1.1 && camera.position.distanceTo(pos) > 0.35;
    const op = ok ? alpha : 0;
    if (op < 0.01) {
      if (el._o !== 0) {
        el.style.opacity = '0';
        el._o = 0;
      }
      return;
    }
    el._o = op;
    el.style.opacity = op.toFixed(3);
    el.style.transform = `translate3d(${((v.x * 0.5 + 0.5) * W).toFixed(1)}px,${((-v.y * 0.5 + 0.5) * Hh).toFixed(1)}px,0) translate(-50%,-130%)`;
  };

  let raf = 0;
  const tick = (now: number) => {
    raf = requestAnimationFrame(tick);
    const dt = Math.min((now - lt) / 1000, 0.05);
    lt = now;
    if (!visible) return;
    T += reduce ? 0 : dt;
    pr += (progress.current - pr) * (1 - Math.exp(-dt * 4));
    const c = path(pr);
    if (!reduce) th += dt * 0.06;
    smx += (pointer.x - smx) * 0.04;
    smy += (pointer.y - smy) * 0.04;
    const TH = th + smx * 0.5, PH = Math.max(0.3, Math.min(1.5, c.ph + smy * 0.18)), d = c.d;
    camera.position.set(d * Math.sin(PH) * Math.sin(TH), d * Math.cos(PH), d * Math.sin(PH) * Math.cos(TH));
    camera.lookAt(0, 0, 0);
    const inside = Math.max(0, Math.min(1, (3.2 - d) / 1.2));
    glass.opacity = 0.16 - inside * 0.13;
    haloMat.opacity = 0.05 * (1 - inside);
    bloom.strength = 0.55 - inside * 0.4;
    ring.rotation.z += dt * 0.25;
    ring2.rotation.z -= dt * 0.12;
    const nameA = Math.max(0, Math.min(1, (6.5 - d) / 2.5));
    people.forEach((o, i) => {
      const orb = ORB[o.p.orbit], t = o.p.phase + (T * 0.09) / orb.r;
      o.mesh.position.set(Math.cos(t) * orb.r, Math.sin(T * 0.7 + i) * 0.05, Math.sin(t) * orb.r).applyQuaternion(orb.q);
      o.halo.position.copy(o.mesh.position);
      const near = Math.max(0, Math.min(1, (camera.position.distanceTo(o.mesh.position) - 0.35) / 0.6));
      o.mat.opacity = 0.08 + 0.92 * near;
      o.halo.material.opacity = o.base * o.mat.opacity;
      if (o.thread) {
        tmp.copy(o.mesh.position).multiplyScalar(0.5);
        tmp.y += 0.25 + o.mesh.position.length() * 0.15;
        cv.v0.set(0, 0, 0);
        cv.v1.copy(tmp);
        cv.v2.copy(o.mesh.position);
        const attr = o.thread.line.geometry.attributes.position as THREE.BufferAttribute;
        const arr = attr.array as Float32Array;
        for (let q = 0; q < 32; q++) {
          cv.getPoint(q / 31, v);
          arr[q * 3] = v.x; arr[q * 3 + 1] = v.y; arr[q * 3 + 2] = v.z;
        }
        attr.needsUpdate = true;
        o.thread.lineMat.opacity = (0.25 + 0.65 * nameA) * o.mat.opacity;
        cv.getPoint((T * 0.35 + i * 0.37) % 1, o.thread.spark.position);
        o.thread.sparkMat.opacity = 0.8 * o.mat.opacity;
      }
    });
    composer.render();
    people.forEach((o) =>
      project(o.mesh.position, o.p.size, o.el, nameA * (o.p.match ? 1 : 0.85) * (o.mat.opacity > 0.5 ? 1 : 0.15)),
    );
    project(you.position, 0.2, youEl, nameA);
  };
  raf = requestAnimationFrame(tick);

  return () => {
    cancelAnimationFrame(raf);
    ro.disconnect();
    io.disconnect();
    people.forEach((o) => o.el.remove());
    youEl.remove();
    disposables.forEach((d) => d.dispose());
    roomEnv.dispose?.();
    bloom.dispose();
    composer.dispose();
    renderer.dispose();
    renderer.domElement.remove();
  };
}
