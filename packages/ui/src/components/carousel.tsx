import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";
import { cva } from "class-variance-authority";
import useEmblaCarousel from "embla-carousel-react";
import * as React from "react";
import { StepIndicator, StepIndicatorItem } from "../blocks/step-indicator";
import { cn } from "../lib/utils";
import { Button } from "./button";
import { Icon } from "./icon";

type CarouselOrientation = "horizontal" | "vertical";

type CarouselAlign = "start" | "center" | "end";

type CarouselDirection = "ltr" | "rtl";

/** What moved the carousel to its current position. */
type CarouselNavigationSource =
  | "autoplay"
  | "button"
  | "drag"
  | "focus"
  | "imperative"
  | "indicator"
  | "keyboard";

interface CarouselValueChangeDetails {
  source: CarouselNavigationSource;
}

// An interface has no implicit index signature, so this alias must stay a
// `type` to remain assignable to Base UI's `Record<string, unknown>` bounds.
// oxlint-disable-next-line typescript/consistent-type-definitions
type CarouselState = {
  /** Zero-based index of the selected position. */
  value: number;
  /** Number of positions. Lower than the slide count when several slides share a view. */
  count: number;
  canPrevious: boolean;
  canNext: boolean;
  orientation: CarouselOrientation;
  /** True while a `CarouselAutoplay` is advancing the slides. */
  playing: boolean;
};

interface CarouselActions {
  /** Moves to a position. Reports `imperative` as the source unless told otherwise. */
  goTo: (index: number, source?: CarouselNavigationSource) => void;
  previous: (source?: CarouselNavigationSource) => void;
  next: (source?: CarouselNavigationSource) => void;
}

interface CarouselContextValue {
  state: CarouselState;
  actions: CarouselActions;
}

type CarouselEngineApi = ReturnType<typeof useEmblaCarousel>[1];

interface CarouselInternalContextValue extends CarouselContextValue {
  api: CarouselEngineApi;
  direction: CarouselDirection;
  rootRef: React.RefObject<HTMLElement | null>;
  setPlaying: (playing: boolean) => void;
  slidesId: string;
  viewportRef: ReturnType<typeof useEmblaCarousel>[0];
}

const CarouselContext = React.createContext<CarouselInternalContextValue | null>(null);

const useCarouselInternal = () => {
  const context = React.use(CarouselContext);

  if (!context) {
    throw new Error("Carousel parts must be inside a <Carousel />.");
  }

  return context;
};

/** Reads the carousel's state and navigation actions, for building custom controls. */
const useCarousel = (): CarouselContextValue => {
  const { state, actions } = useCarouselInternal();

  return { actions, state };
};

/** Base UI's prop types do not admit data-* keys in object literals. */
const dataAttributes = (attributes: Record<string, string | undefined>) => attributes;

/** Cleanup for effects that had nothing to set up. */
const noCleanup = () => {
  // Nothing was set up.
};

const prefersReducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * Whether anyone can see the carousel move: its centre is on screen and not
 * covered by another layer, such as a lightbox or dialog over the page.
 */
const isCarouselVisible = (root: HTMLElement) => {
  const rect = root.getBoundingClientRect();
  const x = rect.left + rect.width / 2;
  const y = rect.top + rect.height / 2;

  if (x < 0 || y < 0 || x > window.innerWidth || y > window.innerHeight) {
    return false;
  }

  const hit = document.elementFromPoint(x, y);

  return hit !== null && root.contains(hit);
};

/** Sources that come from the person rather than from code or autoplay. */
const userSources = new Set<CarouselNavigationSource>([
  "button",
  "drag",
  "focus",
  "indicator",
  "keyboard",
]);

const isEditableTarget = (target: EventTarget) =>
  target instanceof HTMLElement &&
  (target.isContentEditable || /^(?:INPUT|SELECT|TEXTAREA)$/u.test(target.tagName));

type CarouselProps = Omit<React.ComponentProps<"section">, "defaultValue" | "dir"> & {
  /** Zero-based index of the selected position. Controlled. */
  value?: number;
  /** Zero-based index of the selected position when uncontrolled. Defaults to 0. */
  defaultValue?: number;
  /** Called when the selected position changes, with what caused the change. */
  onValueChange?: (value: number, details: CarouselValueChangeDetails) => void;
  /** Defaults to `horizontal`. */
  orientation?: CarouselOrientation;
  /** Where slides rest inside the viewport. Defaults to `start`. */
  align?: CarouselAlign;
  /** Wraps from the last slide to the first and back. */
  loop?: boolean;
  /** Lets a swipe glide freely instead of settling on a slide. */
  dragFree?: boolean;
  /** Slides moved per step. `auto` moves by however many fit in the view. Defaults to 1. */
  slidesToScroll?: number | "auto";
  /** Reading direction. Defaults to the direction inherited from the page. */
  dir?: CarouselDirection;
};

interface CarouselSnapshot {
  value: number;
  count: number;
  canPrevious: boolean;
  canNext: boolean;
}

const Carousel = ({
  value: valueProp,
  defaultValue = 0,
  onValueChange,
  orientation = "horizontal",
  align = "start",
  loop = false,
  dragFree = false,
  slidesToScroll = 1,
  dir,
  className,
  children,
  ...props
}: CarouselProps) => {
  const rootRef = React.useRef<HTMLElement>(null);
  const slidesId = React.useId();
  const [inheritedDirection, setInheritedDirection] = React.useState<CarouselDirection>("ltr");
  const direction = dir ?? inheritedDirection;

  const [playing, setPlaying] = React.useState(false);

  const [snapshot, setSnapshot] = React.useState<CarouselSnapshot>({
    canNext: false,
    canPrevious: false,
    count: 0,
    value: valueProp ?? defaultValue,
  });

  const options = React.useMemo(
    () => ({
      align,
      axis: orientation === "horizontal" ? ("x" as const) : ("y" as const),
      direction,
      dragFree,
      loop,
      slidesToScroll,
    }),
    [align, orientation, direction, dragFree, loop, slidesToScroll],
  );

  const [viewportRef, api] = useEmblaCarousel(options);

  // Who asked for the move that the next `select` event reports.
  const sourceRef = React.useRef<CarouselNavigationSource>("imperative");
  // Set while following a controlled `value`, so the change is not reported back.
  const syncingRef = React.useRef(false);

  const emitValueChange = React.useEffectEvent(
    (value: number, source: CarouselNavigationSource) => {
      onValueChange?.(value, { source });
    },
  );

  // The engine starts at slide 0; jump to the initial value without animating.
  const jumpToInitialValue = React.useEffectEvent((engine: NonNullable<CarouselEngineApi>) => {
    engine.scrollTo(valueProp ?? defaultValue, true);
  });

  React.useLayoutEffect(() => {
    if (!dir && rootRef.current) {
      setInheritedDirection(getComputedStyle(rootRef.current).direction === "rtl" ? "rtl" : "ltr");
    }
  }, [dir]);

  React.useEffect(() => {
    if (!api) {
      return noCleanup;
    }

    // Option changes rebuild the engine at slide 0; this remembers where to return.
    let lastValue = api.selectedScrollSnap();

    const readSnapshot = () => {
      lastValue = api.selectedScrollSnap();
      setSnapshot({
        canNext: api.canScrollNext(),
        canPrevious: api.canScrollPrev(),
        count: api.scrollSnapList().length,
        value: api.selectedScrollSnap(),
      });
    };

    const labelSlides = () => {
      const slides = api.slideNodes();

      for (const [index, slide] of slides.entries()) {
        // Keep a label the consumer wrote; replace only the ones written here.
        if (!slide.hasAttribute("aria-label") || slide.dataset.carouselLabel !== undefined) {
          slide.setAttribute("aria-label", `${index + 1} of ${slides.length}`);
          slide.dataset.carouselLabel = "";
        }
      }
    };

    const markSlidesInView = () => {
      const inView = new Set(api.slidesInView());

      for (const [index, slide] of api.slideNodes().entries()) {
        slide.toggleAttribute("data-in-view", inView.has(index));
      }
    };

    const handleSelect = () => {
      readSnapshot();

      if (syncingRef.current) {
        return;
      }

      const source = sourceRef.current;

      if (userSources.has(source)) {
        setPlaying(false);
      }

      emitValueChange(api.selectedScrollSnap(), source);
    };

    const handleReInit = () => {
      const restore = Math.min(lastValue, api.scrollSnapList().length - 1);

      if (restore > 0 && api.selectedScrollSnap() !== restore) {
        syncingRef.current = true;
        api.scrollTo(restore, true);
        syncingRef.current = false;
      }

      readSnapshot();
      labelSlides();
      markSlidesInView();
    };

    const handlePointerDown = () => {
      sourceRef.current = "drag";
    };

    const handleSlideFocus = () => {
      sourceRef.current = "focus";
    };

    const handleSettle = () => {
      sourceRef.current = "imperative";
    };

    syncingRef.current = true;
    jumpToInitialValue(api);
    syncingRef.current = false;
    handleReInit();
    api.on("select", handleSelect);
    api.on("reInit", handleReInit);
    api.on("slidesChanged", handleReInit);
    api.on("slidesInView", markSlidesInView);
    api.on("pointerDown", handlePointerDown);
    api.on("slideFocus", handleSlideFocus);
    api.on("settle", handleSettle);

    return () => {
      api.off("select", handleSelect);
      api.off("reInit", handleReInit);
      api.off("slidesChanged", handleReInit);
      api.off("slidesInView", markSlidesInView);
      api.off("pointerDown", handlePointerDown);
      api.off("slideFocus", handleSlideFocus);
      api.off("settle", handleSettle);
    };
  }, [api]);

  // Follow a controlled value. Animate only when someone can watch the move.
  // A carousel covered by another layer (a lightbox sharing its value) jumps
  // instead, so it is already at rest when that layer closes and measures it.
  React.useEffect(() => {
    if (api && valueProp !== undefined && api.selectedScrollSnap() !== valueProp) {
      const root = rootRef.current;
      const jump = prefersReducedMotion() || !root || !isCarouselVisible(root);

      syncingRef.current = true;
      api.scrollTo(valueProp, jump);
      syncingRef.current = false;
    }
  }, [api, valueProp]);

  const actions = React.useMemo<CarouselActions>(() => {
    const move = (source: CarouselNavigationSource, scroll: (jump: boolean) => void) => {
      if (!api) {
        return;
      }

      sourceRef.current = source;
      scroll(prefersReducedMotion());
      sourceRef.current = "imperative";
    };

    return {
      goTo: (index, source = "imperative") => {
        move(source, (jump) => api?.scrollTo(index, jump));
      },
      next: (source = "imperative") => {
        move(source, (jump) => api?.scrollNext(jump));
      },
      previous: (source = "imperative") => {
        move(source, (jump) => api?.scrollPrev(jump));
      },
    };
  }, [api]);

  // A native listener keeps the section free of interaction handlers; it runs
  // after the consumer's `onKeyDown`, which can opt out with preventDefault().
  const handleKeyDown = React.useEffectEvent((event: KeyboardEvent) => {
    if (event.defaultPrevented || (event.target && isEditableTarget(event.target))) {
      return;
    }

    const forward = direction === "rtl" ? "ArrowLeft" : "ArrowRight";
    const backward = direction === "rtl" ? "ArrowRight" : "ArrowLeft";
    const nextKey = orientation === "horizontal" ? forward : "ArrowDown";
    const previousKey = orientation === "horizontal" ? backward : "ArrowUp";

    if (event.key === nextKey) {
      actions.next("keyboard");
    } else if (event.key === previousKey) {
      actions.previous("keyboard");
    } else if (event.key === "Home") {
      actions.goTo(0, "keyboard");
    } else if (event.key === "End") {
      actions.goTo(snapshot.count - 1, "keyboard");
    } else {
      return;
    }

    event.preventDefault();
  });

  React.useEffect(() => {
    const root = rootRef.current;

    root?.addEventListener("keydown", handleKeyDown);

    return () => {
      root?.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const state = React.useMemo<CarouselState>(
    () => ({ ...snapshot, orientation, playing }),
    [snapshot, orientation, playing],
  );

  const context = React.useMemo<CarouselInternalContextValue>(
    () => ({ actions, api, direction, rootRef, setPlaying, slidesId, state, viewportRef }),
    [actions, api, direction, slidesId, state, viewportRef],
  );

  return (
    <CarouselContext value={context}>
      <section
        ref={rootRef}
        aria-roledescription="carousel"
        data-slot="carousel"
        data-orientation={orientation}
        data-playing={playing ? "" : undefined}
        dir={dir}
        className={cn(
          "relative [--carousel-gap:--spacing(4)]",
          // Room outside the slides for surface rims and shadows. Along the scroll
          // axis it stays under half the gap, so a neighbour never shows its edge.
          "[--carousel-bleed:min(var(--spacing),_calc(var(--carousel-gap)_/_2))] [--carousel-cross-bleed:--spacing(2)]",
          className,
        )}
        {...props}
      >
        {children}
      </section>
    </CarouselContext>
  );
};

/*
 * The viewport extends past the carousel by the bleed so slide surfaces keep their
 * rims and shadows; the track's margins and padding cancel it out. Embla measures
 * the track, so each slide still rests exactly on the carousel's edge.
 */
const carouselViewportVariants = cva("overflow-hidden", {
  variants: {
    orientation: {
      horizontal: "-mx-(--carousel-bleed) -my-(--carousel-cross-bleed)",
      vertical: "-mx-(--carousel-cross-bleed) -my-(--carousel-bleed)",
    },
  },
});

const carouselSlidesVariants = cva("flex", {
  variants: {
    orientation: {
      horizontal:
        "ms-[calc(var(--carousel-bleed)_-_var(--carousel-gap))] me-(--carousel-bleed) py-(--carousel-cross-bleed)",
      vertical:
        "mt-[calc(var(--carousel-bleed)_-_var(--carousel-gap))] mb-(--carousel-bleed) flex-col px-(--carousel-cross-bleed)",
    },
  },
});

/** The viewport and track that hold the slides. `className` styles the track. */
const CarouselSlides = ({ className, ...props }: React.ComponentProps<"div">) => {
  const { viewportRef, slidesId, state } = useCarouselInternal();

  return (
    <div
      ref={viewportRef}
      data-slot="carousel-viewport"
      className={carouselViewportVariants({ orientation: state.orientation })}
    >
      <div
        id={slidesId}
        aria-live={state.playing ? "off" : "polite"}
        data-slot="carousel-slides"
        data-orientation={state.orientation}
        className={cn(carouselSlidesVariants({ className, orientation: state.orientation }))}
        {...props}
      />
    </div>
  );
};

type CarouselSlideProps = React.ComponentProps<"div"> & {
  render?: useRender.RenderProp<{ orientation: CarouselOrientation }>;
};

/** One slide. Size it with `basis-*`; the default fills the viewport. */
const CarouselSlide = ({ className, render, ...props }: CarouselSlideProps) => {
  const { state } = useCarouselInternal();

  return useRender({
    defaultTagName: "div",
    props: mergeProps<"div">(
      {
        "aria-roledescription": "slide",
        className: cn(
          "min-w-0 shrink-0 grow-0 basis-full",
          state.orientation === "horizontal" ? "ps-(--carousel-gap)" : "pt-(--carousel-gap)",
          className,
        ),
        role: "group",
        ...dataAttributes({ "data-orientation": state.orientation, "data-slot": "carousel-slide" }),
      },
      props,
    ),
    render,
    state: { orientation: state.orientation },
  });
};

const carouselControlVariants = cva("absolute touch-manipulation rounded-full", {
  compoundVariants: [
    { className: "-inset-s-12", direction: "previous", orientation: "horizontal" },
    { className: "-inset-e-12", direction: "next", orientation: "horizontal" },
    { className: "-top-12", direction: "previous", orientation: "vertical" },
    { className: "-bottom-12", direction: "next", orientation: "vertical" },
  ],
  variants: {
    direction: {
      next: "",
      previous: "",
    },
    orientation: {
      horizontal: "inset-y-0 my-auto",
      vertical: "inset-x-0 mx-auto",
    },
  },
});

type CarouselControlProps = React.ComponentProps<typeof Button>;

const CarouselPrevious = ({
  className,
  variant = "outline",
  size = "icon-sm",
  children,
  onClick,
  ...props
}: CarouselControlProps) => {
  const { state, actions, slidesId } = useCarouselInternal();

  return (
    <Button
      data-slot="carousel-previous"
      variant={variant}
      size={size}
      aria-controls={slidesId}
      className={cn(
        carouselControlVariants({
          className,
          direction: "previous",
          orientation: state.orientation,
        }),
      )}
      disabled={!state.canPrevious}
      onClick={(event) => {
        onClick?.(event);

        if (!event.defaultPrevented) {
          actions.previous("button");
        }
      }}
      {...props}
    >
      {children ?? (
        <>
          {state.orientation === "horizontal" ? (
            <Icon name="chevron-left" className="rtl:rotate-180" />
          ) : (
            <Icon name="chevron-up" />
          )}
          <span className="sr-only">Previous slide</span>
        </>
      )}
    </Button>
  );
};

const CarouselNext = ({
  className,
  variant = "outline",
  size = "icon-sm",
  children,
  onClick,
  ...props
}: CarouselControlProps) => {
  const { state, actions, slidesId } = useCarouselInternal();

  return (
    <Button
      data-slot="carousel-next"
      variant={variant}
      size={size}
      aria-controls={slidesId}
      className={cn(
        carouselControlVariants({ className, direction: "next", orientation: state.orientation }),
      )}
      disabled={!state.canNext}
      onClick={(event) => {
        onClick?.(event);

        if (!event.defaultPrevented) {
          actions.next("button");
        }
      }}
      {...props}
    >
      {children ?? (
        <>
          {state.orientation === "horizontal" ? (
            <Icon name="chevron-right" className="rtl:rotate-180" />
          ) : (
            <Icon name="chevron-down" />
          )}
          <span className="sr-only">Next slide</span>
        </>
      )}
    </Button>
  );
};

/** One dot per position, kept in sync with the carousel. Select a dot to move to it. */
const CarouselIndicator = ({
  className,
  ...props
}: Omit<
  React.ComponentProps<typeof StepIndicator>,
  "count" | "value" | "defaultValue" | "onValueChange" | "variant" | "orientation" | "children"
>) => {
  const { state, actions } = useCarouselInternal();

  if (state.count < 2) {
    return null;
  }

  return (
    <StepIndicator
      data-slot="carousel-indicator"
      aria-label="Slides"
      variant="dots"
      orientation={state.orientation}
      value={state.value}
      onValueChange={(index) => {
        actions.goTo(index, "indicator");
      }}
      className={cn(
        state.orientation === "horizontal"
          ? "mx-auto mt-4"
          : "absolute -end-8 top-1/2 -translate-y-1/2",
        className,
      )}
      {...props}
    >
      {Array.from({ length: state.count }, (_, index) => (
        <StepIndicatorItem key={index} index={index} label={`Go to slide ${index + 1}`} />
      ))}
    </StepIndicator>
  );
};

type CarouselCounterProps = Omit<React.ComponentProps<"span">, "children"> & {
  /** Customize the text, e.g. `render={(props, { value, count }) => <span {...props}>…</span>}`. */
  render?: useRender.RenderProp<CarouselState>;
};

/** The selected position as text, e.g. "2 / 5". */
const CarouselCounter = ({ className, render, ...props }: CarouselCounterProps) => {
  const { state } = useCarouselInternal();

  return useRender({
    defaultTagName: "span",
    props: mergeProps<"span">(
      {
        children: state.count > 0 ? `${state.value + 1} / ${state.count}` : null,
        className: cn("text-control-sm text-muted-foreground tabular-nums", className),
        ...dataAttributes({ "data-slot": "carousel-counter" }),
      },
      props,
    ),
    render,
    state,
  });
};

type CarouselAutoplayProps = CarouselControlProps & {
  /** Time on each slide, in milliseconds. Defaults to 4000. */
  delay?: number;
};

/**
 * Advances the slides on a timer and renders the button that pauses it.
 * It waits while the carousel is hovered or focused, stops when someone navigates,
 * and starts paused when the system asks for reduced motion.
 */
const CarouselAutoplay = ({
  delay = 4000,
  className,
  variant = "outline",
  size = "icon-sm",
  children,
  onClick,
  ...props
}: CarouselAutoplayProps) => {
  const { state, actions, rootRef, setPlaying } = useCarouselInternal();
  const [held, setHeld] = React.useState(false);

  React.useEffect(() => {
    setPlaying(!prefersReducedMotion());

    return () => {
      setPlaying(false);
    };
  }, [setPlaying]);

  // Hold while the pointer or focus is inside, or the page is hidden.
  React.useEffect(() => {
    const root = rootRef.current;

    if (!root) {
      return noCleanup;
    }

    let hovered = false;
    let focused = false;

    const update = () => {
      setHeld(hovered || focused || document.hidden);
    };

    const handlePointerEnter = () => {
      hovered = true;
      update();
    };

    const handlePointerLeave = () => {
      hovered = false;
      update();
    };

    const handleFocusIn = (event: FocusEvent) => {
      // Focus on the play button itself must not hold the timer it just started.
      focused = !(
        event.target instanceof Element && event.target.closest("[data-slot=carousel-autoplay]")
      );
      update();
    };

    const handleFocusOut = (event: FocusEvent) => {
      if (!(event.relatedTarget instanceof Node && root.contains(event.relatedTarget))) {
        focused = false;
        update();
      }
    };

    root.addEventListener("pointerenter", handlePointerEnter);
    root.addEventListener("pointerleave", handlePointerLeave);
    root.addEventListener("focusin", handleFocusIn);
    root.addEventListener("focusout", handleFocusOut);
    document.addEventListener("visibilitychange", update);

    return () => {
      root.removeEventListener("pointerenter", handlePointerEnter);
      root.removeEventListener("pointerleave", handlePointerLeave);
      root.removeEventListener("focusin", handleFocusIn);
      root.removeEventListener("focusout", handleFocusOut);
      document.removeEventListener("visibilitychange", update);
    };
  }, [rootRef]);

  React.useEffect(() => {
    if (!state.playing || held || state.count < 2) {
      return noCleanup;
    }

    // Restarts on every move, so each slide gets the full delay.
    const following = state.value + 1 < state.count ? state.value + 1 : 0;

    const timer = window.setTimeout(() => {
      actions.goTo(following, "autoplay");
    }, delay);

    return () => {
      window.clearTimeout(timer);
    };
  }, [actions, delay, held, state.count, state.playing, state.value]);

  return (
    <Button
      data-slot="carousel-autoplay"
      variant={variant}
      size={size}
      className={cn("rounded-full", className)}
      onClick={(event) => {
        onClick?.(event);

        if (!event.defaultPrevented) {
          setPlaying(!state.playing);
        }
      }}
      {...props}
    >
      {children ?? (
        <>
          <Icon name={state.playing ? "pause" : "play"} />
          <span className="sr-only">{state.playing ? "Pause slides" : "Play slides"}</span>
        </>
      )}
    </Button>
  );
};

export {
  Carousel,
  CarouselAutoplay,
  CarouselCounter,
  CarouselIndicator,
  CarouselNext,
  CarouselPrevious,
  CarouselSlide,
  CarouselSlides,
  useCarousel,
};

export type {
  CarouselActions,
  CarouselAlign,
  CarouselAutoplayProps,
  CarouselContextValue,
  CarouselCounterProps,
  CarouselDirection,
  CarouselNavigationSource,
  CarouselOrientation,
  CarouselProps,
  CarouselSlideProps,
  CarouselState,
  CarouselValueChangeDetails,
};
