import { Geometry, Mesh, Program, Renderer, Transform, Triangle } from 'ogl';

import { FOCAL, GAP, LAYERS, LAYER_DEPTHS, STEPS, gridFragment, gridVertex, packetFragment, packetVertex } from './shaders';

export type SceneOptions = {
  canvas: HTMLCanvasElement;
  dark: boolean;
  /** Number of packets travelling along the grid. */
  packetCount?: number;
  /** Trail fragments drawn per packet (two extra fragments are used for the head glow and the pulse ring). */
  trailLength?: number;
  /** Grid cell size in CSS pixels. */
  cellSize?: number;
};

export type Scene = {
  /** Render a single frame. `delta` is in seconds. */
  render: (delta: number) => void;
  /** Resize the drawing buffer to the given CSS size. */
  resize: (width: number, height: number) => void;
  /** Move the pointer, which the spotlight follows and the camera leans towards. Values are normalised to 0..1. */
  setPointer: (x: number, y: number) => void;
  /** Switch between light and dark palettes (animated). */
  setDark: (dark: boolean) => void;
  /**
   * Update the scroll position, expressed in viewport heights.
   * Turns the camera around the grid along random paths and dims the scene behind the content.
   */
  setScroll: (ratio: number) => void;
  /** Hold the camera at its resting angle, without scroll or idle motion. */
  setReducedMotion: (reduced: boolean) => void;
  /** Set how far the scene has shifted from failure (0) to success (1). */
  setProgress: (value: number) => void;
  /** Eased progress (0..1) as currently rendered. */
  getProgress: () => number;
  /** Release all GPU resources. */
  dispose: () => void;
};

type Rgb = [number, number, number];

const hexToRgb = (hex: string): Rgb => {
  const value = Number.parseInt(hex.slice(1), 16);
  return [
    ((value >> 16) & 255) / 255,
    ((value >> 8) & 255) / 255,
    (value & 255) / 255,
  ];
};

const PALETTE = {
  light: {
    ink: hexToRgb('#0f172a'),
    neutral: hexToRgb('#64748b'),
    ok: hexToRgb('#059669'),
    err: hexToRgb('#e11d48'),
  },
  dark: {
    ink: hexToRgb('#e2e8f0'),
    neutral: hexToRgb('#94a3b8'),
    ok: hexToRgb('#34d399'),
    err: hexToRgb('#fb7185'),
  },
} as const;

const lerp = (a: number, b: number, t: number): number => a + (b - a) * t;

const clamp01 = (value: number): number => Math.min(Math.max(value, 0), 1);

const lerpRgb = (target: Rgb, from: Rgb, to: Rgb, t: number): void => {
  target[0] = lerp(from[0], to[0], t);
  target[1] = lerp(from[1], to[1], t);
  target[2] = lerp(from[2], to[2], t);
};

type Oklch = [number, number, number];

const toLinear = (c: number): number => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);

const toGamma = (c: number): number => (c <= 0.0031308 ? c * 12.92 : 1.055 * c ** (1 / 2.4) - 0.055);

const rgbToOklch = ([r, g, b]: Rgb): Oklch => {
  const lr = toLinear(r);
  const lg = toLinear(g);
  const lb = toLinear(b);
  const l = Math.cbrt(0.4122214708 * lr + 0.5363325363 * lg + 0.0514459929 * lb);
  const m = Math.cbrt(0.2119034982 * lr + 0.6806995451 * lg + 0.1073969566 * lb);
  const s = Math.cbrt(0.0883024619 * lr + 0.2817188376 * lg + 0.6299787005 * lb);
  const a = 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s;
  const bb = 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s;
  return [0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s, Math.hypot(a, bb), Math.atan2(bb, a)];
};

const oklchToRgb = (target: Rgb, [lightness, chroma, hue]: Oklch): void => {
  const a = chroma * Math.cos(hue);
  const b = chroma * Math.sin(hue);
  const l = (lightness + 0.3963377774 * a + 0.2158037573 * b) ** 3;
  const m = (lightness - 0.1055613458 * a - 0.0638541728 * b) ** 3;
  const s = (lightness - 0.0894841775 * a - 1.291485548 * b) ** 3;
  target[0] = toGamma(clamp01(4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s));
  target[1] = toGamma(clamp01(-1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s));
  target[2] = toGamma(clamp01(-0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s));
};

/**
 * Interpolates in OKLCH along the shorter hue arc. Mixing rose and emerald in RGB
 * passes through a muddy grey; OKLCH keeps the midpoint saturated (amber).
 */
const mixOklch = (target: Rgb, from: Rgb, to: Rgb, t: number): void => {
  const [l1, c1, h1] = rgbToOklch(from);
  const [l2, c2, h2] = rgbToOklch(to);
  let hueDelta = h2 - h1;
  if (hueDelta > Math.PI) hueDelta -= Math.PI * 2;
  if (hueDelta < -Math.PI) hueDelta += Math.PI * 2;
  oklchToRgb(target, [lerp(l1, l2, t), lerp(c1, c2, t), h1 + hueDelta * t]);
};

/** Share of packets placed on each depth layer, near to far. */
const LAYER_WEIGHTS = [0.4, 0.35, 0.25];

/** Scroll distance (in viewport heights) over which the whole scene dims behind the content. */
const DIM_START = 0.6;
const DIM_END = 1.6;
/** Opacity kept once the scene has fully dimmed. */
const DIM_FLOOR = 0.5;

const smoothstep = (edge0: number, edge1: number, value: number): number => {
  const t = clamp01((value - edge0) / (edge1 - edge0));
  return t * t * (3 - 2 * t);
};

const AXIS_NAMES = ['pitch', 'yaw', 'spin'] as const;
type AxisName = (typeof AXIS_NAMES)[number];

/**
 * Camera orientation, in radians. At rest the stack is tilted back and turned, so the grid
 * is seen at an angle. Scrolling moves each axis along its own random path (see
 * `createTurns`), scaled by `range`; one turn takes `span` viewport heights of scroll, so
 * longer spans change direction less often.
 * Each axis follows its path through a spring of its own `stiffness`, and idles with a slow
 * `wobble` at `rate` (rad/s). The spans and stiffnesses differ, so the axes never move in
 * step and the stack tumbles instead of swinging back and forth.
 *
 * The pointer also leans the camera: `pointer` weighs its offset from the centre of the view
 * (x, y in -0.5..0.5). The camera swings towards it, bringing that side of the stack closer.
 */
const AXES: Record<AxisName, {
  rest: number;
  range: number;
  span: number;
  stiffness: number;
  wobble: number;
  rate: number;
  pointer: [number, number];
}> = {
  pitch: { rest: 0.42, range: 0.2, span: 1.8, stiffness: 12, wobble: 0.025, rate: 0.23, pointer: [0, -0.22] },
  yaw: { rest: -0.14, range: 0.32, span: 2.3, stiffness: 16, wobble: 0.035, rate: 0.19, pointer: [0.28, 0] },
  spin: { rest: 0.32, range: 0.42, span: 2.9, stiffness: 20, wobble: 0.03, rate: 0.13, pointer: [0, 0] },
};
/** Damping ratio of the axis springs. Critically damped: an overshoot would read as a bounce when the scroll stops. */
const DAMPING = 1;
/** The camera orbits a point on the middle layer, so the near and far layers shift in opposite directions. */
const PIVOT = LAYER_DEPTHS[1];
/** Packets spawn only where a layer is at most this much further away than at rest (see `depthFade`). */
const SPAWN_DEPTH = 1.6;
/** Share of the view, past its edges, where packets may spawn, so some enter from outside. */
const SPAWN_OVERSCAN = 1.15;

/**
 * Maps a scroll position (in turns) to a value within about -0.8..0.8, starting at 0.
 * Each turn heads a random amount in a random direction, reversing at the limits.
 * Turns are generated as they are reached and then kept, so scrolling back retraces
 * the same path.
 */
const createTurns = () => {
  const knots = [0];

  const knotAt = (index: number): number => {
    // Mirrored before the start, so the path begins at exactly 0.
    if (index < 0) return -knotAt(-index);
    while (knots.length <= index) {
      const previous = knots.at(-1)!;
      const step = (0.5 + Math.random() * 0.5) * (Math.random() < 0.5 ? -1 : 1);
      knots.push(Math.abs(previous + step) > 1 ? previous - step : previous + step);
    }
    return knots[index]!;
  };

  // Uniform cubic B-spline over the knots. It passes near rather than through them, but its
  // acceleration is continuous, so the rotation eases into each change of direction.
  return (position: number): number => {
    const index = Math.floor(position);
    const t = position - index;
    const p0 = knotAt(index - 1);
    const p1 = knotAt(index);
    const p2 = knotAt(index + 1);
    const p3 = knotAt(index + 2);
    return (
      (1 - t) ** 3 * p0
      + (3 * t ** 3 - 6 * t ** 2 + 4) * p1
      + (-3 * t ** 3 + 3 * t ** 2 + 3 * t + 1) * p2
      + t ** 3 * p3
    ) / 6;
  };
};

const layerFor = (ratio: number): number => {
  let cumulative = 0;
  for (let index = 0; index < LAYERS; index++) {
    cumulative += LAYER_WEIGHTS[index] ?? 0;
    if (ratio < cumulative) return index;
  }
  return LAYERS - 1;
};

/**
 * Packets are instanced: every packet draws the same cluster of fragments, and carries
 * its own seed, time offset, layer, speed and spawn cell.
 */
const createPackets = (packetCount: number, trailLength: number) => {
  const perPacket = trailLength + 2;
  const fragment = new Float32Array(perPacket * 2);
  for (let f = 0; f < perPacket; f++) {
    // Fragment kinds: 0 = trail, 1 = pulse ring, 2 = head glow.
    const kind = f === trailLength ? 1 : (f === trailLength + 1 ? 2 : 0);
    fragment[f * 2] = kind === 0 ? f / trailLength : 0;
    fragment[f * 2 + 1] = kind;
  }

  const packet = new Float32Array(packetCount * 4);
  for (let p = 0; p < packetCount; p++) {
    packet[p * 4] = Math.random();
    packet[p * 4 + 1] = Math.random();
    packet[p * 4 + 2] = layerFor(p / packetCount);
    packet[p * 4 + 3] = 1.1 + Math.random() * 1.1;
  }

  return { fragment, packet, spawn: new Float32Array(packetCount * 2) };
};

/** Row-major 3x3 matrix. */
type Mat3 = [number, number, number, number, number, number, number, number, number];

/** Rx(pitch) · Ry(yaw) · Rz(spin): spins the grid within its layers, then tilts the stack. */
const orientation = (pitch: number, yaw: number, spin: number): Mat3 => {
  const cx = Math.cos(pitch);
  const sx = Math.sin(pitch);
  const cy = Math.cos(yaw);
  const sy = Math.sin(yaw);
  const cz = Math.cos(spin);
  const sz = Math.sin(spin);
  return [
    cy * cz, -cy * sz, sy,
    cx * sz + sx * sy * cz, cx * cz - sx * sy * sz, -sx * cy,
    sx * sz - cx * sy * cz, sx * cz + cx * sy * sz, cx * cy,
  ];
};

/**
 * Builds the WebGL scene rendered behind the home page.
 * Returns `null` when WebGL is unavailable so callers can fall back to CSS.
 */
export const createScene = ({
  canvas,
  dark,
  packetCount = 120,
  trailLength = 48,
  cellSize = 88,
}: SceneOptions): Scene | null => {
  const dpr = Math.min(globalThis.devicePixelRatio || 1, 1.5);

  let renderer: Renderer;
  try {
    renderer = new Renderer({
      canvas,
      dpr,
      alpha: true,
      depth: false,
      stencil: false,
      antialias: false,
      premultipliedAlpha: true,
      powerPreference: 'low-power',
    });
  } catch {
    return null;
  }

  const { gl } = renderer;
  gl.clearColor(0, 0, 0, 0);

  const from = dark ? PALETTE.dark : PALETTE.light;
  const inkColour: Rgb = [...from.ink];
  const neutralColour: Rgb = [...from.neutral];
  const okColour: Rgb = [...from.ok];
  const errorColour: Rgb = [...from.err];
  // Overall state of the scene, from failure (top of the page) to success (scrolled).
  const stateColour: Rgb = [...from.err];

  const uniforms = {
    uTime: { value: Math.random() * 100 },
    uDpr: { value: dpr },
    uAspect: { value: 1 },
    uCell: { value: 0.1 },
    uPixel: { value: 0.001 },
    uRot: { value: new Float32Array([1, 0, 0, 0, 1, 0, 0, 0, 1]) },
    uEye: { value: new Float32Array([0, 0, 0]) },
    uPointer: { value: new Float32Array([0, 0]) },
    uFade: { value: 1 },
    uDark: { value: dark ? 1 : 0 },
    uProgress: { value: 0 },
    uInk: { value: inkColour },
    uNeutral: { value: neutralColour },
    uOk: { value: okColour },
    uErr: { value: errorColour },
    uState: { value: stateColour },
  };

  const programOptions = {
    uniforms,
    transparent: true,
    depthTest: false,
    depthWrite: false,
  };

  const scene = new Transform();

  const grid = new Mesh(gl, {
    geometry: new Triangle(gl),
    program: new Program(gl, { ...programOptions, vertex: gridVertex, fragment: gridFragment }),
  });
  grid.setParent(scene);

  const { fragment, packet, spawn } = createPackets(packetCount, trailLength);
  const packetGeometry = new Geometry(gl, {
    aFragment: { size: 2, data: fragment },
    aPacket: { size: 4, instanced: 1, data: packet },
    aSpawn: { size: 2, instanced: 1, data: spawn, usage: gl.DYNAMIC_DRAW },
  });
  const packets = new Mesh(gl, {
    mode: gl.POINTS,
    geometry: packetGeometry,
    program: new Program(gl, { ...programOptions, vertex: packetVertex, fragment: packetFragment }),
  });
  packets.renderOrder = 1;
  packets.setParent(scene);

  const pointerTarget = { x: 0, y: 0 };
  let darkTarget = dark ? 1 : 0;
  let progressTarget = 0;
  let fadeTarget = 1;
  let scrollRatio = 0;
  let reducedMotion = false;

  // Offsets from the resting orientation, driven by the scroll and the pointer through a spring per axis.
  const axes = Object.fromEntries(AXIS_NAMES.map((name) => [
    name,
    { turns: createTurns(), target: 0, value: 0, velocity: 0 },
  ])) as Record<AxisName, { turns: (position: number) => number; target: number; value: number; velocity: number }>;

  const updateAxisTargets = () => {
    for (const name of AXIS_NAMES) {
      const axis = axes[name];
      axis.target = reducedMotion ? 0 : axis.turns(Math.max(scrollRatio, 0) / AXES[name].span) * AXES[name].range;
    }
  };

  let rotation = orientation(AXES.pitch.rest, AXES.yaw.rest, AXES.spin.rest);
  const eye = uniforms.uEye.value;

  const updateCamera = (step: number) => {
    const time = uniforms.uTime.value;
    const angles = { pitch: 0, yaw: 0, spin: 0 };
    for (const name of AXIS_NAMES) {
      const axis = axes[name];
      const { rest, stiffness, wobble, rate, pointer } = AXES[name];
      const lean = reducedMotion ? 0 : pointerTarget.x * pointer[0] + pointerTarget.y * pointer[1];
      const target = axis.target + lean;
      axis.velocity += ((target - axis.value) * stiffness - axis.velocity * 2 * DAMPING * Math.sqrt(stiffness)) * step;
      axis.value += axis.velocity * step;
      angles[name] = rest + axis.value + (reducedMotion ? 0 : Math.sin(time * rate) * wobble);
    }

    // The shaders take the world-to-view rotation column-major; the camera orbits PIVOT.
    rotation = orientation(angles.pitch, angles.yaw, angles.spin);
    const [r00, r01, r02, r10, r11, r12, r20, r21, r22] = rotation;
    uniforms.uRot.value.set([r00, r10, r20, r01, r11, r21, r02, r12, r22]);
    eye[0] = -PIVOT * r20;
    eye[1] = -PIVOT * r21;
    eye[2] = PIVOT - PIVOT * r22;
  };

  // A packet's spawn cell is picked inside the current view whenever it starts a new life,
  // while it is invisible, so the view stays populated however the camera turns.
  const lives = new Float64Array(packetCount).fill(Number.NaN);

  const pickSpawn = (index: number) => {
    const depth = LAYER_DEPTHS[packet[index * 4 + 2] ?? 0] ?? PIVOT;
    const [r00, r01, r02, r10, r11, r12, r20, r21, r22] = rotation;
    for (let attempt = 0; attempt < 6; attempt++) {
      const x = (Math.random() * 2 - 1) * SPAWN_OVERSCAN * uniforms.uAspect.value;
      const y = (Math.random() * 2 - 1) * SPAWN_OVERSCAN;
      // World-space ray through (x, y): the transposed rotation applied to (x, y, FOCAL).
      const rayX = x * r00 + y * r10 + FOCAL * r20;
      const rayY = x * r01 + y * r11 + FOCAL * r21;
      const rayZ = x * r02 + y * r12 + FOCAL * r22;
      if (rayZ <= 1e-3) continue;
      const t = (depth - eye[2]!) / rayZ;
      if (t <= 0 || t * FOCAL > depth * SPAWN_DEPTH) continue;
      spawn[index * 2] = Math.floor((eye[0]! + rayX * t) / uniforms.uCell.value);
      spawn[index * 2 + 1] = Math.floor((eye[1]! + rayY * t) / uniforms.uCell.value);
      return;
    }
  };

  const updateSpawns = () => {
    let changed = false;
    for (let index = 0; index < packetCount; index++) {
      // Keep in sync with the life computation in packetVertex.
      const cycle = (STEPS + GAP) / (packet[index * 4 + 3] ?? 1);
      const life = Math.floor(uniforms.uTime.value / cycle + (packet[index * 4 + 1] ?? 0));
      if (life === lives[index]) continue;
      lives[index] = life;
      pickSpawn(index);
      changed = true;
    }
    if (changed) packetGeometry.attributes['aSpawn']!.needsUpdate = true;
  };

  const meshes = [grid, packets];

  return {
    render: (delta) => {
      const step = Math.min(delta, 1 / 20);
      uniforms.uTime.value += step;

      updateCamera(step);
      updateSpawns();

      const spotEase = 1 - Math.exp(-step * 8);
      uniforms.uPointer.value[0] = lerp(uniforms.uPointer.value[0]!, pointerTarget.x * 2, spotEase);
      uniforms.uPointer.value[1] = lerp(uniforms.uPointer.value[1]!, pointerTarget.y * 2, spotEase);

      const scrollEase = 1 - Math.exp(-step * 5);
      uniforms.uProgress.value = lerp(uniforms.uProgress.value, progressTarget, scrollEase);
      uniforms.uFade.value = lerp(uniforms.uFade.value, fadeTarget, scrollEase);

      const themeEase = 1 - Math.exp(-step * 4);
      uniforms.uDark.value = lerp(uniforms.uDark.value, darkTarget, themeEase);
      const t = uniforms.uDark.value;
      lerpRgb(inkColour, PALETTE.light.ink, PALETTE.dark.ink, t);
      lerpRgb(neutralColour, PALETTE.light.neutral, PALETTE.dark.neutral, t);
      lerpRgb(okColour, PALETTE.light.ok, PALETTE.dark.ok, t);
      lerpRgb(errorColour, PALETTE.light.err, PALETTE.dark.err, t);
      mixOklch(stateColour, errorColour, okColour, smoothstep(0, 1, uniforms.uProgress.value));

      renderer.render({ scene });
    },
    resize: (width, height) => {
      renderer.setSize(width, height);

      // World units are half the viewport height at depth FOCAL, where a cell spans cellSize pixels.
      const safeWidth = Math.max(width, 1);
      const safeHeight = Math.max(height, 1);
      uniforms.uAspect.value = safeWidth / safeHeight;
      uniforms.uCell.value = (cellSize * 2) / safeHeight;
      uniforms.uPixel.value = 2 / (safeHeight * dpr);
    },
    setPointer: (x, y) => {
      pointerTarget.x = x - 0.5;
      pointerTarget.y = y - 0.5;
    },
    setDark: (value) => {
      darkTarget = value ? 1 : 0;
    },
    setScroll: (ratio) => {
      scrollRatio = ratio;
      fadeTarget = 1 - (1 - DIM_FLOOR) * smoothstep(DIM_START, DIM_END, ratio);
      updateAxisTargets();
    },
    setReducedMotion: (reduced) => {
      reducedMotion = reduced;
      updateAxisTargets();
      if (!reduced) return;
      // Settle at rest straight away rather than turning back while motion is reduced.
      for (const name of AXIS_NAMES) {
        axes[name].value = 0;
        axes[name].velocity = 0;
      }
    },
    setProgress: (value) => {
      progressTarget = clamp01(value);
    },
    getProgress: () => uniforms.uProgress.value,
    dispose: () => {
      for (const mesh of meshes) {
        mesh.geometry.remove();
        mesh.program.remove();
      }
      gl.getExtension('WEBGL_lose_context')?.loseContext();
    },
  };
};
