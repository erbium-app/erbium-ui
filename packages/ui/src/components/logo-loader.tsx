import { animate, useMotionValue, useReducedMotion } from "motion/react";
import type {
  AnimationPlaybackControls,
  MotionValue,
  ValueAnimationTransition,
} from "motion/react";
import { useEffect, useId, useImperativeHandle, useRef } from "react";
import type { Ref } from "react";
import { skeletonIgnore } from "../lib/skeleton-hints";
import { cn } from "../lib/utils";

/*
 * The Erbium mark is an isometric slab carved into a staircase. The geometry is
 * modelled in slab coordinates and projected into the logo's 49×49 viewBox:
 *   a — along the steps (down-right on screen)
 *   b — across the steps (down-left on screen)
 *   h — height (up on screen)
 *
 * One number, `progress`, drives the whole animation:
 *   0 → 1  the rise: a flat slab whose three strips lift into the logo's steps.
 *   1 → 2  one escalator cycle, measured from the source video: every step
 *          moves back one strip and up one unit together, so the risers never
 *          change. The top step leaves through the logo's top edge and a new
 *          one rises out of the floor behind the landing. Every whole number
 *          is the logo.
 */

type Point = readonly [number, number];

type SlabPoint = readonly [a: number, b: number, h?: number];

// Projection basis, taken from the published logo outline.
const ORIGIN: Point = [27.9551, 13.2647];
const AXIS_A: Point = [6.528, 2.2588];
const AXIS_B: Point = [-6.528, 4.5516];
const AXIS_H: Point = [0, -6.8104];

const SLAB_LENGTH = 4.32;
const SPINE_WIDTH = 1;
const STEP_START = 2;
const STEP_END = 4;

// The landing (the logo's bottom arm) starts here; steps never pass in front of it.
const LANDING = 3;
const STEPS = [0, 1, 2, 3] as const;

// Floor offset of a shadow per unit of height: one directional light, read
// from the logo's shadow edge, so every step's shadow lines up with the rest.
const LIGHT: Point = [2, 0.8628];

const project = ([a, b, h = 0]: SlabPoint): Point => [
  ORIGIN[0] + a * AXIS_A[0] + b * AXIS_B[0] + h * AXIS_H[0],
  ORIGIN[1] + a * AXIS_A[1] + b * AXIS_B[1] + h * AXIS_H[1],
];

const format = (value: number) => Number(value.toFixed(3)).toString();

const toPath = (points: readonly Point[]) =>
  `M${points.map(([x, y]) => `${format(x)} ${format(y)}`).join("L")}Z`;

const polygon = (points: readonly SlabPoint[]) => toPath(points.map(project));

interface Step {
  back: number;
  front: number;
  height: number;
}

const layout = (progress: number) => {
  if (progress <= 1) {
    // The rise: three strips cut from the slab lift to heights 3, 2 and 1
    // while their ends trim back to the logo's step length.
    return {
      left: SPINE_WIDTH + (STEP_START - SPINE_WIDTH) * progress,
      right: SLAB_LENGTH - (SLAB_LENGTH - STEP_END) * progress,
      steps: STEPS.map((step): Step => ({
        back: Math.min(step, LANDING),
        front: Math.min(step + 1, LANDING),
        height: Math.max(LANDING - step, 0) * progress,
      })),
    };
  }

  // The escalator: every step moves back and up together. The newest one rises
  // through the slot behind the landing, which never moves.
  const phase = (progress - 1) % 1;

  return {
    left: STEP_START,
    right: STEP_END,
    steps: STEPS.map((step): Step => ({
      back: step - phase,
      front: Math.min(step + 1 - phase, LANDING),
      height: LANDING - step + phase,
    })),
  };
};

const scene = (progress: number) => {
  const { left, right, steps } = layout(progress);

  // Keyed by the `data-face` name of each path in the SVG.
  const faces = new Map<string, string>();

  // The floor is the spine plus the landing; the steps leave a void.
  faces.set(
    "floor",
    polygon([
      [0, 0],
      [left, 0],
      [left, LANDING],
      [SLAB_LENGTH, LANDING],
      [SLAB_LENGTH, 4],
      [0, 4],
    ]),
  );

  for (const [index, { back, front, height }] of steps.entries()) {
    const [dropA, dropB] = [LIGHT[0] * height, LIGHT[1] * height];

    // The shadow of the step's left face, cast across the spine.
    faces.set(
      `shadow-${index}`,
      polygon([
        [left, back],
        [left, front],
        [left - dropA, front - dropB],
        [left - dropA, back - dropB],
      ]),
    );
    // Faces turned toward the viewer that show the background.
    faces.set(
      `end-${index}`,
      polygon([
        [right, back, 0],
        [right, front, 0],
        [right, front, height],
        [right, back, height],
      ]),
    );
    faces.set(
      `front-${index}`,
      polygon([
        [left, front, 0],
        [right, front, 0],
        [right, front, height],
        [left, front, height],
      ]),
    );
    faces.set(
      `top-${index}`,
      polygon([
        [left, back, height],
        [right, back, height],
        [right, front, height],
        [left, front, height],
      ]),
    );
  }

  return faces;
};

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
  const [x, y] = project([STEP_START, 1, 2]);
  const reach = 8;
  const above = -40;

  return toPath([
    [x - reach * AXIS_A[0], y - reach * AXIS_A[1]],
    [x + reach * AXIS_A[0], y + reach * AXIS_A[1]],
    [x + reach * AXIS_A[0], above],
    [x - reach * AXIS_A[0], above],
  ]);
})();

/*
 * Timing. The rise and loop are measured from the source animation: a 0.9s
 * rise and a linear 1s escalator cycle (30 frames at 30fps).
 */
const LOWER_SECONDS = 0.3;
const HOLD_SECONDS = 0.08;
const RISE_SECONDS = 0.9;
const LOOP_SECONDS = 1;
const LOWER_EASE = [0.1, 0, 0.35, 1] as const;
const RISE_EASE = [0.65, 0, 0.9, 1] as const;

// Ends at slope 0.9, which is the loop's speed (1 cycle/s) over a 0.9s rise,
// so the rise flows into the escalator without a jolt.
const RISE_INTO_LOOP_EASE = [0.65, 0, 0.9, 0.91] as const;
const SETTLE_EASE = [0.4, 0, 0.2, 1] as const;

// Resolving never stops on a sliver of a step: it finishes the next one instead.
const MIN_SETTLE_DISTANCE = 0.15;
const LOOP_SPEED = 1 / LOOP_SECONDS;

/**
 * A cubic that starts at the given relative slope and lands at rest, so a
 * moving escalator decelerates into the logo without a jump in speed.
 */
const settleFrom = (slope: number) => (time: number) =>
  slope * (time ** 3 - 2 * time ** 2 + time) + 3 * time ** 2 - 2 * time ** 3;

type Phase = "rest" | "replay" | "start" | "loop" | "resolve";

interface LogoLoaderHandle {
  /** Lowers the steps into the flat slab and raises them again. Ignored while loading. */
  replay: () => void;
}

interface LogoLoaderProps {
  /** Accessible name. Without it the mark is decorative and hidden from assistive technology. */
  label?: string;
  className?: string;
  /**
   * Runs the loader: the start sequence, then the escalator loop until it turns
   * false, when the mark finishes its step and resolves into the logo.
   */
  loading?: boolean;
  /** Milliseconds `loading` must stay true before the animation starts, so quick work never flashes. */
  delay?: number;
  /** Called once the mark has come to rest after loading. */
  onResolved?: () => void;
  ref?: Ref<LogoLoaderHandle>;
}

interface ControllerHooks {
  isLoading: () => boolean;
  onResolved: () => void;
}

/**
 * Drives `progress` through the start, loop, resolve and replay sequences.
 * Each sequence chains its animations through `onComplete`; starting another
 * animation stops the current one, which also cancels the rest of its chain.
 */
const createController = (progress: MotionValue<number>, hooks: ControllerHooks) => {
  let phase: Phase = "rest";
  let playback: AnimationPlaybackControls | undefined;

  const run = (
    target: number | number[],
    transition: ValueAnimationTransition<number>,
    then?: () => void,
  ) => {
    playback?.stop();
    playback = animate(progress, target, { ...transition, onComplete: then });
  };

  const loop = () => {
    const from = progress.get();

    phase = "loop";
    run([from, from + 1], {
      duration: LOOP_SECONDS,
      ease: "linear",
      repeat: Number.POSITIVE_INFINITY,
    });
  };

  const rise = (into: "loop" | "rest", delay = 0) => {
    const remaining = 1 - progress.get();

    if (into === "loop") {
      run(
        1,
        {
          delay,
          duration: RISE_SECONDS * Math.max(remaining, 0.25),
          ease: RISE_INTO_LOOP_EASE,
        },
        loop,
      );

      return;
    }

    run(1, { delay, duration: RISE_SECONDS, ease: RISE_EASE }, () => {
      phase = "rest";

      // Loading that began during a replay takes over from the logo.
      if (hooks.isLoading()) {
        start();
      }
    });
  };

  const start = () => {
    if (phase === "start" || phase === "loop") {
      return;
    }

    const from = progress.get();
    const resumed = phase === "resolve" && from >= 1;
    const lowering = progress.getVelocity() < 0;

    phase = "start";

    if (resumed) {
      // Loading came back while resolving: keep riding the escalator.
      loop();
    } else if (from >= 1) {
      progress.set(1);
      run(0, { duration: LOWER_SECONDS, ease: LOWER_EASE }, () => {
        rise("loop", HOLD_SECONDS);
      });
    } else if (lowering) {
      run(0, { duration: LOWER_SECONDS * from, ease: "easeOut" }, () => {
        rise("loop", HOLD_SECONDS);
      });
    } else {
      rise("loop");
    }
  };

  // Returns whether the mark is settling and will call `onResolved` when it stops.
  const resolve = () => {
    const from = progress.get();

    if (phase === "resolve") {
      return true;
    }

    if (phase === "replay" || (phase === "rest" && from === 1)) {
      return false;
    }

    const speed = phase === "loop" ? LOOP_SPEED : progress.getVelocity();
    let target = from < 1 ? 1 : Math.ceil(from);

    if (from >= 1 && target - from < MIN_SETTLE_DISTANCE) {
      target += 1;
    }

    const distance = target - from;

    const settled = () => {
      progress.set(1);
      phase = "rest";
      hooks.onResolved();
    };

    phase = "resolve";

    if (speed > 0.05) {
      // Leave at the current speed and slow to a stop on the logo.
      const duration = Math.min(Math.max((1.5 * distance) / speed, 0.25), 2);
      const slope = Math.min((speed * duration) / distance, 3);

      run(target, { duration, ease: settleFrom(slope) }, settled);
    } else {
      run(target, { duration: 0.3 + 0.6 * distance, ease: SETTLE_EASE }, settled);
    }

    return true;
  };

  const replay = () => {
    if (phase !== "rest") {
      return;
    }

    phase = "replay";
    progress.set(1);
    run(0, { duration: LOWER_SECONDS, ease: LOWER_EASE }, () => {
      rise("rest", HOLD_SECONDS);
    });
  };

  // Abandons any sequence and leaves the value where it is, ready to resume.
  const stop = () => {
    playback?.stop();
    phase = "rest";
  };

  return { replay, resolve, start, stop };
};

type Controller = ReturnType<typeof createController>;

/**
 * The Erbium mark with a start, loop and resolve animation. Drive `loading`
 * with any pending flag: router navigation, query fetching or a mutation.
 */
const LogoLoader = ({
  className,
  delay = 0,
  label,
  loading = false,
  onResolved,
  ref,
}: LogoLoaderProps) => {
  const reducedMotion = useReducedMotion() === true;
  // Mounted while loading, the mark starts from the flat slab and rises.
  const initial = loading && delay <= 0 && !reducedMotion ? 0 : 1;
  const progress = useMotionValue(initial);
  const svgRef = useRef<SVGSVGElement>(null);
  const controllerRef = useRef<Controller | null>(null);
  const loadingRef = useRef(loading);
  // Whether `loading` has been true since the last resolve, so `onResolved` fires once per load.
  const pendingRef = useRef(loading);
  const onResolvedRef = useRef(onResolved);
  const id = useId().replaceAll(/[^\w-]/gu, "");
  const part = (name: string) => `logo-loader-${id}-${name}`;
  const faces = scene(initial);
  const labelled = label !== undefined;

  useEffect(() => {
    loadingRef.current = loading;
    onResolvedRef.current = onResolved;
  });

  useEffect(() => {
    const controller = createController(progress, {
      isLoading: () => loadingRef.current,
      onResolved: () => onResolvedRef.current?.(),
    });

    controllerRef.current = controller;

    return controller.stop;
  }, [progress]);

  // Draw straight to the DOM: animation frames never re-render React.
  useEffect(() => {
    const paths = svgRef.current?.querySelectorAll<SVGPathElement>("[data-face]") ?? [];

    const draw = (value: number) => {
      const next = scene(value);

      for (const path of paths) {
        path.setAttribute("d", next.get(path.dataset.face ?? "") ?? "");
      }
    };

    draw(progress.get());

    return progress.on("change", draw);
  }, [progress]);

  useImperativeHandle(ref, () => ({
    replay: () => {
      if (!reducedMotion) {
        controllerRef.current?.replay();
      }
    },
  }));

  useEffect(() => {
    const controller = controllerRef.current;
    let timer: ReturnType<typeof setTimeout> | undefined;

    if (loading) {
      pendingRef.current = true;

      if (controller && !reducedMotion) {
        timer = setTimeout(controller.start, delay);
      }
    } else if (pendingRef.current) {
      pendingRef.current = false;

      // A load that ended before the animation started, or under reduced motion, resolves at once.
      const settling = controller !== null && !reducedMotion && controller.resolve();

      if (!settling) {
        onResolvedRef.current?.();
      }
    }

    return () => {
      clearTimeout(timer);
    };
  }, [delay, loading, reducedMotion]);

  return (
    <svg
      ref={svgRef}
      data-slot="logo-loader"
      {...skeletonIgnore}
      aria-busy={labelled ? loading : undefined}
      aria-hidden={labelled ? undefined : true}
      aria-label={label}
      className={cn("size-8 shrink-0", className)}
      fill="none"
      // The flat slab is wider than the mark and overhangs its box while it animates.
      overflow="visible"
      role={labelled ? "img" : undefined}
      viewBox="0 0 49 49"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <clipPath id={part("slab")}>
          <path d={SLAB} />
        </clipPath>
        {/* Painted back to front: white is surface, black is a face that shows the background. */}
        <mask id={part("visible")} maskUnits="userSpaceOnUse" {...CANVAS}>
          <path className="fill-white" d={faces.get("floor")} data-face="floor" />
          {STEPS.map((step) => (
            <g key={step}>
              <path
                className="fill-black"
                d={faces.get(`front-${step}`)}
                data-face={`front-${step}`}
              />
              <path className="fill-black" d={faces.get(`end-${step}`)} data-face={`end-${step}`} />
              <path className="fill-white" d={faces.get(`top-${step}`)} data-face={`top-${step}`} />
            </g>
          ))}
          <path className="fill-black" d={CEILING} />
        </mask>
      </defs>
      <g mask={`url(#${part("visible")})`}>
        <rect className="fill-(--logo-body)" {...CANVAS} />
        <g className="fill-(--logo-shadow)" clipPath={`url(#${part("slab")})`}>
          {STEPS.map((step) => (
            <path key={step} d={faces.get(`shadow-${step}`)} data-face={`shadow-${step}`} />
          ))}
        </g>
        {STEPS.map((step) => (
          <path
            key={step}
            className="fill-(--logo-body)"
            d={faces.get(`top-${step}`)}
            data-face={`top-${step}`}
          />
        ))}
      </g>
    </svg>
  );
};

export { LogoLoader };

export type { LogoLoaderHandle, LogoLoaderProps };
