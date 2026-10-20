import * as React from "react";
import { cn } from "../lib/utils";
import { cva } from "class-variance-authority";
import useEmblaCarousel from "embla-carousel-react";
import type { UseEmblaCarouselType } from "embla-carousel-react";
import { Button } from "./button";
import { Icon } from "./icon";
import { StepIndicator, StepIndicatorItem } from "../blocks/step-indicator";

type CarouselApi = UseEmblaCarouselType[1];

type UseCarouselParameters = Parameters<typeof useEmblaCarousel>;

type CarouselOptions = UseCarouselParameters[0];

type CarouselPlugin = UseCarouselParameters[1];

interface CarouselProps {
  opts?: CarouselOptions;
  plugins?: CarouselPlugin;
  orientation?: "horizontal" | "vertical";
  setApi?: (api: CarouselApi) => void;
}

type CarouselContextProps = {
  carouselRef: ReturnType<typeof useEmblaCarousel>[0];
  api: ReturnType<typeof useEmblaCarousel>[1];
  scrollPrev: () => void;
  scrollNext: () => void;
  canScrollPrev: boolean;
  canScrollNext: boolean;
} & CarouselProps;

const CarouselContext = React.createContext<CarouselContextProps | null>(null);

const carouselContentVariants = cva("flex", {
  variants: {
    orientation: {
      horizontal: "-ms-4",
      vertical: "-mt-4 flex-col",
    },
  },
});

const carouselItemVariants = cva("min-w-0 shrink-0 grow-0 basis-full", {
  variants: {
    orientation: {
      horizontal: "ps-4",
      vertical: "pt-4",
    },
  },
});

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
      vertical: "inset-s-1/2 -translate-x-1/2 rotate-90 rtl:translate-x-1/2",
    },
  },
});

const useCarousel = () => {
  const context = React.useContext(CarouselContext);

  if (!context) {
    throw new Error("useCarousel must be used within a <Carousel />");
  }

  return context;
};

const Carousel = ({
  orientation = "horizontal",
  opts,
  setApi,
  plugins,
  className,
  children,
  ...props
}: React.ComponentProps<"div"> & CarouselProps) => {
  const [carouselRef, api] = useEmblaCarousel(
    {
      ...opts,
      axis: orientation === "horizontal" ? "x" : "y",
    },
    plugins,
  );

  const subscribe = React.useCallback(
    (notify: () => void) => {
      if (!api) {
        return () => {};
      }

      api.on("reInit", notify);
      api.on("select", notify);

      return () => {
        api.off("reInit", notify);
        api.off("select", notify);
      };
    },
    [api],
  );

  const canScrollPrev = React.useSyncExternalStore(
    subscribe,
    () => api?.canScrollPrev() ?? false,
    () => false,
  );

  const canScrollNext = React.useSyncExternalStore(
    subscribe,
    () => api?.canScrollNext() ?? false,
    () => false,
  );

  const scrollPrev = React.useCallback(() => {
    api?.scrollPrev();
  }, [api]);

  const scrollNext = React.useCallback(() => {
    api?.scrollNext();
  }, [api]);

  const handleKeyDown = React.useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        scrollPrev();
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        scrollNext();
      }
    },
    [scrollPrev, scrollNext],
  );

  React.useEffect(() => {
    if (!api || !setApi) {
      return;
    }

    setApi(api);
  }, [api, setApi]);

  return (
    <CarouselContext.Provider
      value={{
        api,
        canScrollNext,
        canScrollPrev,
        carouselRef,
        opts,
        orientation: orientation || (opts?.axis === "y" ? "vertical" : "horizontal"),
        scrollNext,
        scrollPrev,
      }}
    >
      <div
        onKeyDownCapture={handleKeyDown}
        className={cn("relative", className)}
        role="region"
        aria-roledescription="carousel"
        data-slot="carousel"
        {...props}
      >
        {children}
      </div>
    </CarouselContext.Provider>
  );
};

const CarouselContent = ({ className, ...props }: React.ComponentProps<"div">) => {
  const { carouselRef, orientation } = useCarousel();

  return (
    <div ref={carouselRef} className="overflow-hidden" data-slot="carousel-content">
      <div className={cn(carouselContentVariants({ className, orientation }))} {...props} />
    </div>
  );
};

const CarouselItem = ({ className, ...props }: React.ComponentProps<"div">) => {
  const { orientation } = useCarousel();

  return (
    <div
      role="group"
      aria-roledescription="slide"
      data-slot="carousel-item"
      className={cn(carouselItemVariants({ className, orientation }))}
      {...props}
    />
  );
};

const CarouselPrevious = ({
  className,
  variant = "outline",
  size = "icon-sm",
  ...props
}: React.ComponentProps<typeof Button>) => {
  const { orientation, scrollPrev, canScrollPrev } = useCarousel();

  return (
    <Button
      data-slot="carousel-previous"
      variant={variant}
      size={size}
      className={cn(carouselControlVariants({ className, direction: "previous", orientation }))}
      disabled={!canScrollPrev}
      onClick={scrollPrev}
      {...props}
    >
      <Icon name="chevron-left" className="rtl:rotate-180" />
      <span className="sr-only">Previous slide</span>
    </Button>
  );
};

const CarouselNext = ({
  className,
  variant = "outline",
  size = "icon-sm",
  ...props
}: React.ComponentProps<typeof Button>) => {
  const { orientation, scrollNext, canScrollNext } = useCarousel();

  return (
    <Button
      data-slot="carousel-next"
      variant={variant}
      size={size}
      className={cn(carouselControlVariants({ className, direction: "next", orientation }))}
      disabled={!canScrollNext}
      onClick={scrollNext}
      {...props}
    >
      <Icon name="chevron-right" className="rtl:rotate-180" />
      <span className="sr-only">Next slide</span>
    </Button>
  );
};

/** One dot per slide, kept in sync with the carousel. Click a dot to scroll to it. */
const CarouselIndicator = ({
  className,
  ...props
}: Omit<
  React.ComponentProps<typeof StepIndicator>,
  "count" | "value" | "defaultValue" | "onValueChange" | "variant" | "orientation" | "children"
>) => {
  const { api, orientation } = useCarousel();

  const subscribe = React.useCallback(
    (notify: () => void) => {
      if (!api) {
        return () => {};
      }

      api.on("reInit", notify);
      api.on("select", notify);

      return () => {
        api.off("reInit", notify);
        api.off("select", notify);
      };
    },
    [api],
  );

  const selected = React.useSyncExternalStore(
    subscribe,
    () => api?.selectedScrollSnap() ?? 0,
    () => 0,
  );

  const count = React.useSyncExternalStore(
    subscribe,
    () => api?.scrollSnapList().length ?? 0,
    () => 0,
  );

  if (count < 2) {
    return null;
  }

  return (
    <StepIndicator
      data-slot="carousel-indicator"
      aria-label="Slides"
      variant="dots"
      orientation={orientation}
      value={selected}
      onValueChange={(index) => api?.scrollTo(index)}
      className={cn(
        orientation === "horizontal" ? "mx-auto mt-4" : "absolute -end-8 top-1/2 -translate-y-1/2",
        className,
      )}
      {...props}
    >
      {Array.from({ length: count }, (_, index) => (
        <StepIndicatorItem key={index} index={index} label={`Go to slide ${index + 1}`} />
      ))}
    </StepIndicator>
  );
};

export {
  type CarouselApi,
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselIndicator,
  CarouselNext,
  useCarousel,
};
