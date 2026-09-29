/**
 * Constants shared between the shaders and the TypeScript side.
 */

/** Grid segments a packet travels during one life. */
export const STEPS = 8;
/** Idle time between two lives, in segments. */
export const GAP = 1.5;
/** Success probability when the page has not been scrolled yet. */
export const MIN_SUCCESS = 0.12;
/**
 * Focal length of the camera. World units are half the viewport height at this distance,
 * so larger values narrow the field of view and flatten the perspective.
 */
export const FOCAL = 2.5;
/** World z of each grid layer, near to far. At rest the camera sits at z = 0 looking down +z. */
export const LAYER_DEPTHS = [0.85 * FOCAL, 1.45 * FOCAL, 2.4 * FOCAL] as const;
/** Number of grid layers stacked in depth. */
export const LAYERS = LAYER_DEPTHS.length;

/**
 * Shared GLSL: camera, grid mapping and packet path generation.
 *
 * The layers are parallel planes; grid coordinates on them are measured in cells.
 * The camera orbits the stack (`uRot`, `uEye`), so layers at different depths shift
 * against each other in perspective.
 *
 * A packet's life is a pure function of (spawn, seed, lifeId, time), so it can be
 * evaluated independently for every trail fragment. Only the spawn cell comes from
 * the CPU, which picks it inside the current view when a life begins.
 */
const common = /* glsl */ `
const int STEPS = ${STEPS};
const float GAP = ${GAP.toFixed(2)};
const float MIN_SUCCESS = ${MIN_SUCCESS.toFixed(2)};

const int LAYERS = ${LAYERS};
const float FOCAL = ${FOCAL.toFixed(4)};

uniform float uAspect; // viewport width / height
uniform float uCell;   // cell size in world units
uniform mat3 uRot;     // world-to-view rotation
uniform vec3 uEye;     // camera position in world space

float layerZ(int k) {
  if (k == 0) return ${LAYER_DEPTHS[0].toFixed(4)};
  if (k == 1) return ${LAYER_DEPTHS[1].toFixed(4)};
  return ${LAYER_DEPTHS[2].toFixed(4)};
}

// Brightness attenuation with depth (fog).
float layerAttenuation(int k) {
  if (k == 0) return 1.0;
  if (k == 1) return 0.42;
  return 0.22;
}

// Further fog along a tilted layer, relative to the layer's resting depth. It reaches zero
// well before the horizon, where the cells would shrink to nothing.
float depthFade(float depth, int k) {
  float ratio = depth / layerZ(k);
  return min(pow(ratio, -1.5), 1.0) * (1.0 - smoothstep(1.4, 2.6, ratio));
}

vec3 gridToView(vec2 g, int k) {
  return uRot * (vec3(g * uCell, layerZ(k)) - uEye);
}

vec2 viewToNdc(vec3 view) {
  return vec2(view.x / uAspect, view.y) * FOCAL / view.z;
}

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
}

float successProbability(float progress) {
  return MIN_SUCCESS + (1.0 - MIN_SUCCESS) * smoothstep(0.0, 1.0, progress);
}

vec2 dirVec(int d) {
  if (d == 0) return vec2(1.0, 0.0);
  if (d == 1) return vec2(0.0, 1.0);
  if (d == 2) return vec2(-1.0, 0.0);
  return vec2(0.0, -1.0);
}

int turnLeft(int d) {
  d += 1;
  if (d > 3) d -= 4;
  return d;
}

int turnRight(int d) {
  d -= 1;
  if (d < 0) d += 4;
  return d;
}

// Position (in grid cells) of a packet at life position u (in segments).
// resolveAt: segment index of the branching intersection.
// ok: 1 when the packet resolves to success, 0 to failure.
vec2 packetPath(vec2 spawn, float seed, float lifeId, float u, float progress, out float resolveAt, out float ok) {
  vec2 p = spawn;

  int dir = int(floor(hash(vec2(seed * 3.3, lifeId + 3.0)) * 4.0));
  resolveAt = 2.0 + floor(hash(vec2(seed * 4.7, lifeId + 4.0)) * 3.0);
  ok = step(hash(vec2(seed * 5.9, lifeId + 5.0)), successProbability(progress));

  int segments = int(floor(u));
  for (int i = 0; i < STEPS; i++) {
    if (i >= segments) break;
    p += dirVec(dir);

    // Branch at the resolving intersection. The turn does not depend on the outcome, so a
    // change in the success rate only recolours packets instead of teleporting them.
    if (float(i + 1) == resolveAt) {
      dir = hash(vec2(seed * 8.3, lifeId + 7.0)) < 0.5 ? turnLeft(dir) : turnRight(dir);
    } else {
      float r = hash(vec2(seed * 7.1 + float(i) * 0.37, lifeId + 6.0));
      if (r < 0.18) dir = turnLeft(dir);
      else if (r < 0.36) dir = turnRight(dir);
    }
  }

  return p + dirVec(dir) * fract(max(u, 0.0));
}
`;

/**
 * Fullscreen grid. Only the nearest layer draws lines; the far layers are dot
 * lattices, which keeps the depth cue without the layers turning into plaid.
 * A soft spotlight follows the pointer.
 *
 * The grid and the spotlight are tinted with the state colour, so the shift
 * from failure to success reads across the whole view rather than only on the
 * small packets.
 */
export const gridVertex = /* glsl */ `
attribute vec2 position;
attribute vec2 uv;
varying vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

export const gridFragment = /* glsl */ `
precision highp float;

uniform float uDpr;
uniform float uPixel;  // size of a device pixel in world units at depth FOCAL
uniform float uDark;
uniform float uFade;
uniform vec2 uPointer;
uniform vec3 uInk;
uniform vec3 uState;

varying vec2 vUv;

${common}

void main() {
  vec2 ndc = vUv * 2.0 - 1.0;
  float px = uDpr;

  vec3 colour = vec3(0.0);
  float alpha = 0.0;

  // Pointer spotlight, corrected for the viewport aspect ratio.
  float spot = 1.0 - smoothstep(0.0, 0.75, length((ndc - uPointer) * vec2(uAspect, 1.0)));
  spot *= spot;

  // World-space direction of the ray through this pixel (v * M multiplies by the transpose),
  // and how it changes from one device pixel to the next.
  vec3 ray = vec3(ndc.x * uAspect, ndc.y, FOCAL) * uRot;
  vec3 rayDx = vec3(uPixel, 0.0, 0.0) * uRot;
  vec3 rayDy = vec3(0.0, uPixel, 0.0) * uRot;
  float rayZ = max(ray.z, 1e-4);

  // Far layers first, near layers composited on top.
  for (int i = LAYERS - 1; i >= 0; i--) {
    float t = (layerZ(i) - uEye.z) / rayZ;
    float hit = step(1e-4, ray.z) * step(0.0, t);
    float depth = max(t * FOCAL, 1e-3);
    float scale = FOCAL / depth;
    vec2 g = (uEye.xy + ray.xy * t) / uCell;
    vec2 gf = fract(g);
    vec2 toCell = min(gf, 1.0 - gf);

    // Distance to the nearest line in device pixels, from the screen-space gradient of g
    // (the derivative of the ray-plane hit point; GLSL ES 1.0 has no dFdx on WebGL 2).
    vec2 gx = t * (rayDx.xy - ray.xy * rayDx.z / rayZ) / uCell;
    vec2 gy = t * (rayDy.xy - ray.xy * rayDy.z / rayZ) / uCell;
    vec2 cellsPerPx = max(sqrt(gx * gx + gy * gy), vec2(1e-5));
    vec2 toLine = toCell / cellsPerPx;

    // Cells squeezed to a few pixels (far along a tilted layer) would alias; fade them out.
    float cellPx = 1.0 / (max(cellsPerPx.x, cellsPerPx.y) * uDpr);
    float att = layerAttenuation(i) * depthFade(depth, i) * smoothstep(8.0, 20.0, cellPx) * hit;
    float a;
    vec3 ink = mix(uInk, uState, 0.5);
    if (i == 0) {
      // Lines fade out towards the middle of each segment, so intersections read as nodes.
      float edge = min(toLine.x, toLine.y);
      float line = 1.0 - smoothstep(0.4 * px, 1.3 * px, edge);
      float along = 2.0 * max(toCell.x, toCell.y);
      line *= mix(1.0, 0.45, smoothstep(0.1, 0.9, along));
      float node = 1.0 - smoothstep(1.2 * px, 2.2 * px, length(toLine));
      a = (line * mix(0.11, 0.07, uDark) * (1.0 + spot * 1.6) + node * mix(0.32, 0.24, uDark) * (1.0 + spot)) * att;
      ink = mix(ink, uState, spot * 0.55);
    } else {
      // Far layers: dots only, softer to read as out of focus.
      float blur = (1.0 - min(scale, 1.0)) * 1.2;
      float node = 1.0 - smoothstep((1.0 + blur) * px, (2.2 + blur * 2.0) * px, length(toLine));
      a = node * mix(0.36, 0.26, uDark) * att;
    }

    colour = colour * (1.0 - a) + ink * a;
    alpha = alpha * (1.0 - a) + a;
  }

  float vignette = smoothstep(1.5, 0.2, length(ndc * vec2(0.8, 1.0)));
  float fade = vignette * uFade;
  alpha *= fade;
  colour *= fade;

  gl_FragColor = vec4(colour, alpha);
}
`;

/**
 * Packets travelling along the grid. Each packet is a cluster of fragments:
 * the head, a short trail behind it and a marker that pulses at the branching
 * intersection when the packet resolves.
 *
 * Outcomes differ in shape and brightness as well as hue: successes resolve
 * with a ring and travel on as a solid, glowing streak; failures resolve with
 * a cross and break into a dim, dashed streak.
 */
export const packetVertex = /* glsl */ `
attribute vec2 aFragment;  // x: trail position (0 = head .. 1 = tail), y: kind (0 trail, 1 ring, 2 glow)
attribute vec4 aPacket;    // per packet: x seed, y time offset, z layer index, w speed (cells per second)
attribute vec2 aSpawn;     // per packet: cell where the current life starts

uniform float uTime;
uniform float uDpr;
uniform float uProgress;
uniform vec3 uNeutral;
uniform vec3 uOk;
uniform vec3 uErr;

varying vec3 vColour;
varying float vAlpha;
varying float vRing;
varying float vSoft;
varying float vGlow;
varying float vFailed;

${common}

void main() {
  float seed = aPacket.x;
  int layer = int(aPacket.z + 0.5);
  // Keep in sync with the life tracking in scene.ts, which picks the spawn cell.
  float cycle = (float(STEPS) + GAP) / aPacket.w;
  float t = uTime / cycle + aPacket.y;
  float lifeId = floor(t);
  float u = fract(t) * (float(STEPS) + GAP);

  float resolveAt;
  float ok;
  float isRing = step(0.5, aFragment.y) * step(aFragment.y, 1.5);
  float isGlow = step(1.5, aFragment.y);

  // Trail fragments lag behind the head, closely spaced so they merge into a streak.
  float lag = aFragment.x * 1.1;
  float uj = isRing > 0.5 ? 0.0 : u - lag;

  vec2 gridPos = packetPath(aSpawn, seed, lifeId, uj, uProgress, resolveAt, ok);
  float since = u - resolveAt;   // segments since the branching intersection
  // The pulse marker sits at the intersection where the packet resolved.
  if (isRing > 0.5) gridPos = packetPath(aSpawn, seed, lifeId, resolveAt, uProgress, resolveAt, ok);

  vec3 view = gridToView(gridPos, layer);
  float inFront = step(0.05, view.z);
  float depth = max(view.z, 0.05);
  // Apparent size relative to a cell at depth FOCAL, capped so points stay within size limits.
  float scale = min(FOCAL / depth, 1.6);
  float att = layerAttenuation(layer) * depthFade(depth, layer) * inFront;

  vec3 colour;
  float alpha;
  float size;

  if (isRing > 0.5) {
    // Pulse marker: an expanding ring for success, a cross that grows only slightly for failure.
    float k = clamp(since / 0.9, 0.0, 1.0);
    float visible = step(0.0, since) * step(since, 0.9) * step(u, float(STEPS));
    colour = mix(uErr, uOk, ok);
    alpha = (1.0 - k) * (1.0 - k) * visible * 0.9 * att;
    size = mix(14.0 + k * 12.0, 8.0 + k * 40.0, ok) * uDpr * scale;
    vRing = 1.0;
    vFailed = 1.0 - ok;
  } else {
    float head = 1.0 - aFragment.x;
    float alive = step(0.0, uj) * step(u, float(STEPS));
    float fadeIn = smoothstep(0.0, 0.6, uj);
    float fadeOut = 1.0 - smoothstep(float(STEPS) - 0.8, float(STEPS), u);

    float resolved = step(0.0, since);
    float failed = resolved * (1.0 - ok);
    vec3 resultColour = mix(uErr, uOk, ok);
    colour = mix(uNeutral, resultColour, resolved);

    // Failures dissolve shortly after the branch; successes travel on, brighter.
    float failFade = 1.0 - smoothstep(0.2, 1.1, since) * (1.0 - ok);
    float boost = resolved * ok * 0.35;

    // Failed streaks break into dashes; the head (aFragment.x = 0) always stays visible.
    float dash = 1.0 - failed * step(0.5, fract(aFragment.x * 7.0));

    // Tapered streak: alpha falls off quickly towards the tail.
    float taper = pow(head, 1.6);
    alpha = (0.035 + 0.42 * taper) * alive * fadeIn * fadeOut * failFade * dash * (0.6 + 0.4 * resolved + boost) * att;
    size = (3.2 + 2.4 * taper) * uDpr * scale * (1.0 + boost * 0.6 + failed * smoothstep(0.0, 0.6, since) * 0.8);

    if (isGlow > 0.5) {
      // Soft halo around the head; failures lose it once resolved.
      alpha *= 0.7 * mix(0.6, 1.4 * ok, resolved);
      size = (22.0 + boost * 22.0) * uDpr * scale;
    }
    vRing = 0.0;
    vFailed = failed;
  }

  vColour = colour;
  vAlpha = alpha;
  vSoft = isGlow > 0.5 ? -0.6 : mix(-0.2, 0.2, min(scale, 1.2));   // far layers look out of focus
  vGlow = isGlow;
  gl_Position = vec4(viewToNdc(vec3(view.xy, depth)), 0.0, 1.0);
  gl_PointSize = size * inFront;
}
`;

export const packetFragment = /* glsl */ `
precision highp float;

uniform float uDark;
uniform float uFade;

varying vec3 vColour;
varying float vAlpha;
varying float vRing;
varying float vSoft;
varying float vGlow;
varying float vFailed;

void main() {
  vec2 c = gl_PointCoord - 0.5;
  float d = length(c) * 2.0;

  float disc = smoothstep(1.0, vSoft, d);
  float halo = (1.0 - d) * (1.0 - d) * step(d, 1.0);
  float core = smoothstep(0.5, 0.0, d);
  float ring = smoothstep(0.12, 0.0, abs(d - 0.82));
  float diagonal = min(abs(c.x - c.y), abs(c.x + c.y)) * 1.41421;   // distance to the diagonals, in d units
  float crossMark = smoothstep(0.16, 0.04, diagonal) * smoothstep(0.75, 0.6, d);

  float marker = mix(ring, crossMark, vFailed);
  float shape = mix(mix(disc, halo, vGlow), marker, vRing);
  float alpha = shape * vAlpha * mix(0.85, 1.0, uDark) * uFade;
  // Only neutral and successful heads get a bright core, so failures also read darker.
  vec3 colour = mix(vColour, vec3(1.0), core * (1.0 - vRing) * (1.0 - vGlow) * (1.0 - vFailed) * mix(0.1, 0.35, uDark));

  gl_FragColor = vec4(colour * alpha, alpha);
}
`;
