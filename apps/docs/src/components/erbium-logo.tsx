import { useId, useImperativeHandle, useRef } from "react";
import type { Ref } from "react";

/*
 * The Erbium mark is an isometric slab carved into a staircase. The geometry is
 * modelled in slab coordinates and projected into the logo's 49×49 viewBox:
 *   a — along the steps (down-right on screen)
 *   b — across the steps (down-left on screen)
 *   h — height (up on screen)
 * At `rise = 0` the slab is flat. At `rise = 1` it is the logo: three strips
 * cut from the slab have risen to heights 3, 2 and 1. The back strip passes
 * above the logo's top edge and is clipped away, leaving two steps over the
 * floor. Every vertex is affine in `rise`, so SMIL interpolating between the
 * two end states reproduces every intermediate frame exactly.
 */

type Point = readonly [number, number];

type SlabPoint = readonly [a: number, b: number, h?: number];

// Projection basis, taken from the published logo outline.
const ORIGIN: Point = [27.9551, 13.2647];
const AXIS_A: Point = [6.528, 2.2588];
const AXIS_B: Point = [-6.528, 4.5516];
const AXIS_H: Point = [0, -6.8104];

const SLAB_LENGTH = 4.32;
const STEP_LENGTH = 4;
const SPINE_WIDTH = 1;
const STRIPS = [0, 1, 2] as const;

// Floor offset of a shadow per unit of height. One directional light, read
// from the logo's shadow edge, so every strip's shadow lines up with the rest.
const LIGHT: Point = [2, 0.8628];

const project = ([a, b, h = 0]: SlabPoint): Point => [
  ORIGIN[0] + a * AXIS_A[0] + b * AXIS_B[0] + h * AXIS_H[0],
  ORIGIN[1] + a * AXIS_A[1] + b * AXIS_B[1] + h * AXIS_H[1],
];

const format = (value: number) => Number(value.toFixed(3)).toString();

const toPath = (points: readonly Point[]) =>
  `M${points.map(([x, y]) => `${format(x)} ${format(y)}`).join("L")}Z`;

const polygon = (points: readonly SlabPoint[]) => toPath(points.map(project));

const scene = (rise: number) => {
  const left = SPINE_WIDTH + rise;
  const right = SLAB_LENGTH - (SLAB_LENGTH - STEP_LENGTH) * rise;
  const height = (strip: number) => (STRIPS.length - strip) * rise;

  const tip = (strip: number, b: number): SlabPoint => [
    left - LIGHT[0] * height(strip),
    b - LIGHT[1] * height(strip),
  ];

  return {
    // The floor is the spine plus the front arm; the strips leave a void.
    floor: polygon([
      [0, 0],
      [left, 0],
      [left, 3],
      [SLAB_LENGTH, 3],
      [SLAB_LENGTH, 4],
      [0, 4],
    ]),
    // Union of the strips' shadows on the floor: a staircase cast to the left.
    shadow: polygon([
      [left, 0],
      [left, 3],
      tip(2, 3),
      tip(2, 2),
      tip(1, 2),
      tip(1, 1),
      tip(0, 1),
      tip(0, 0),
    ]),
    strips: STRIPS.map((strip) => {
      const h = height(strip);
      const back = strip;
      const front = strip + 1;

      return {
        // Faces turned toward the viewer that show the background.
        end: polygon([
          [right, back, 0],
          [right, front, 0],
          [right, front, h],
          [right, back, h],
        ]),
        front: polygon([
          [left, front, 0],
          [right, front, 0],
          [right, front, h],
          [left, front, h],
        ]),
        top: polygon([
          [left, back, h],
          [right, back, h],
          [right, front, h],
          [left, front, h],
        ]),
      };
    }),
  };
};

const FLAT = scene(0);
const LOGO = scene(1);

const SLAB = polygon([
  [0, 0],
  [SLAB_LENGTH, 0],
  [SLAB_LENGTH, 4],
  [0, 4],
]);

// Covers the mark and the flat slab's overhang.
const CANVAS = { height: 64, width: 72, x: -8, y: -8 };

// Everything above the top step's back edge is outside the mark.
const CEILING = (() => {
  const [x, y] = project([2, 1, 2]);
  const reach = 8;
  const above = -40;

  return toPath([
    [x - reach * AXIS_A[0], y - reach * AXIS_A[1]],
    [x + reach * AXIS_A[0], y + reach * AXIS_A[1]],
    [x + reach * AXIS_A[0], above],
    [x - reach * AXIS_A[0], above],
  ]);
})();

// The rise is timed from the source animation: 0.9s (27 frames at 30fps).
// Hover first collapses the steps into the flat slab quickly, holds it briefly,
// then plays the rise at its original pace.
const LOWER = 0.3;
const HOLD = 0.08;
const RISE = 0.9;
const DURATION = LOWER + HOLD + RISE;

const KEY_TIMES = ["0", LOWER / DURATION, (LOWER + HOLD) / DURATION, "1"]
  .map((time) => format(Number(time)))
  .join(";");

const RISE_SPLINE = "0.65 0 0.9 1";
const LOWER_SPLINE = "0.1 0 0.35 1";
const KEY_SPLINES = `${LOWER_SPLINE};0 0 1 1;${RISE_SPLINE}`;

type Scene = ReturnType<typeof scene>;

// Each face is its own path: SMIL updates to a `<use>` source do not reach its
// instances in every browser, so faces shared by the mask and the paint are repeated.
const Morph = ({ className, face }: { className: string; face: (state: Scene) => string }) => {
  const to = face(LOGO);
  const from = face(FLAT);

  return (
    <path className={className} d={to}>
      <animate
        attributeName="d"
        begin="indefinite"
        calcMode="spline"
        dur={`${format(DURATION)}s`}
        keySplines={KEY_SPLINES}
        keyTimes={KEY_TIMES}
        values={`${to};${from};${from};${to}`}
      />
    </path>
  );
};

const prefersReducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export interface ErbiumLogoHandle {
  /** Lowers the steps into a flat slab and raises them again. */
  play: () => void;
}

interface ErbiumLogoProps {
  className?: string;
  ref?: Ref<ErbiumLogoHandle>;
  size?: number;
}

export const ErbiumLogo = ({ className, ref, size = 32 }: ErbiumLogoProps) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const playingUntil = useRef(0);
  const id = useId().replaceAll(/[^\w-]/gu, "");
  const part = (name: string) => `erbium-logo-${id}-${name}`;

  useImperativeHandle(ref, () => ({
    play: () => {
      const svg = svgRef.current;
      const now = performance.now();

      if (!svg || now < playingUntil.current || prefersReducedMotion()) {
        return;
      }

      playingUntil.current = now + DURATION * 1000;

      for (const animation of svg.querySelectorAll("animate")) {
        animation.beginElement();
      }
    },
  }));

  return (
    <svg
      ref={svgRef}
      aria-hidden="true"
      className={className}
      fill="none"
      height={size}
      // The flat slab is wider than the mark and overhangs its box while it animates.
      overflow="visible"
      viewBox="0 0 49 49"
      width={size}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <clipPath id={part("slab")}>
          <path d={SLAB} />
        </clipPath>
        {/* Painted back to front: white is surface, black is a face that shows the background. */}
        <mask id={part("visible")} maskUnits="userSpaceOnUse" {...CANVAS}>
          <Morph className="fill-white" face={(state) => state.floor} />
          {STRIPS.map((strip) => (
            <g key={strip}>
              <Morph className="fill-black" face={(state) => state.strips[strip].front} />
              <Morph className="fill-black" face={(state) => state.strips[strip].end} />
              <Morph className="fill-white" face={(state) => state.strips[strip].top} />
            </g>
          ))}
          <path className="fill-black" d={CEILING} />
        </mask>
      </defs>
      <g mask={`url(#${part("visible")})`}>
        <rect className="fill-logo-body" {...CANVAS} />
        <g clipPath={`url(#${part("slab")})`}>
          <Morph className="fill-logo-shadow" face={(state) => state.shadow} />
        </g>
        {STRIPS.map((strip) => (
          <Morph key={strip} className="fill-logo-body" face={(state) => state.strips[strip].top} />
        ))}
      </g>
    </svg>
  );
};
