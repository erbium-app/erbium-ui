import { useRef } from "react";
import type { ComponentProps } from "react";
import { useLightboxContext } from "@ramka/react";
import * as LightboxPrimitive from "@ramka/react/lightbox";
import {
  ArrowLeft01Icon,
  ArrowRight01Icon,
  Cancel01Icon,
  ZoomInIcon,
  ZoomOutIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import { cn } from "../lib/utils";
import { Button } from "../components/button";
import { Tooltip, TooltipTrigger, TooltipContent } from "../components/tooltip";
import { StepIndicator, StepIndicatorItem } from "./step-indicator";

/*!
 * Adapted from https://chanhdai.com/components/lightbox
 *
 * MIT License
 *
 * Copyright (c) 2026 Chánh Đại
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

type ButtonStyleProps = Pick<ComponentProps<typeof Button>, "variant" | "size">;

type LightboxHandle = LightboxPrimitive.LightboxHandle;

const createLightboxHandle = LightboxPrimitive.createHandle;

const Lightbox = (props: ComponentProps<typeof LightboxPrimitive.Root>) => (
  <LightboxPrimitive.Root {...props} />
);

// A trigger rendered as another control, such as a full-screen button, keeps that control's look.
const LightboxTrigger = ({
  className,
  ...props
}: ComponentProps<typeof LightboxPrimitive.Trigger>) => (
  <LightboxPrimitive.Trigger
    data-slot="lightbox-trigger"
    className={cn(
      props.render === undefined &&
        "cursor-zoom-in outline-none focus-visible:ring-control focus-visible:ring-ring has-[>:is(img,picture):only-child]:image-hairline",
      className,
    )}
    {...props}
  />
);

const LightboxPortal = (props: ComponentProps<typeof LightboxPrimitive.Portal>) => (
  <LightboxPrimitive.Portal data-slot="lightbox-portal" {...props} />
);

const LightboxBackdrop = ({
  className,
  ...props
}: ComponentProps<typeof LightboxPrimitive.Backdrop>) => (
  <LightboxPrimitive.Backdrop
    data-slot="lightbox-backdrop"
    className={cn(
      "fixed inset-0 isolate z-50 bg-overlay-backdrop opacity-0 not-pointer-coarse:supports-backdrop-filter:backdrop-blur-(--overlay-backdrop-blur,2px) pointer-coarse:bg-background",
      // Pull-snap timing exists only while a cancelled pull springs back.
      "transition-opacity duration-(--lightbox-pull-snap-duration,var(--lightbox-vt-duration,360ms)) ease-(--lightbox-pull-snap-easing,cubic-bezier(0.16,1,0.3,1))",
      "[--lightbox-backdrop-opacity:calc(1-var(--lightbox-pull-progress,0)*0.6)] data-open:opacity-(--lightbox-backdrop-opacity) data-open:starting:opacity-0",
      "data-pulling:transition-none motion-reduce:transition-none",
      className,
    )}
    {...props}
  />
);

const LightboxContent = ({
  className,
  onClick,
  onPointerDown,
  ...props
}: ComponentProps<typeof LightboxPrimitive.Content>) => {
  const backdropRef = useRef<HTMLDivElement>(null);
  const backgroundPress = useRef<{ target: Element; x: number; y: number } | null>(null);

  return (
    <LightboxPortal>
      <LightboxBackdrop ref={backdropRef} />
      <LightboxPrimitive.Content
        data-slot="lightbox-content"
        className={cn(
          "group/lightbox fixed inset-0 z-50 flex flex-col overscroll-contain opacity-0 outline-none",
          "transition-opacity duration-(--lightbox-vt-duration,360ms) ease-out",
          "motion-reduce:transition-none data-open:opacity-100 data-open:starting:opacity-0",
          // Shared by the slides, header, and footer so they stay aligned.
          "[--lb-safe-bottom:env(safe-area-inset-bottom,0px)] [--lb-safe-top:env(safe-area-inset-top,0px)]",
          "[--lb-inset-bottom:calc(4rem+var(--lb-safe-bottom))] [--lb-inset-top:calc(4rem+var(--lb-safe-top))] [--lb-inset-x:0px]",
          "md:[--lb-inset-bottom:calc(4.5rem+var(--lb-safe-bottom))] md:[--lb-inset-top:calc(4.5rem+var(--lb-safe-top))] md:[--lb-inset-x:4.5rem]",
          "has-data-[slot=lightbox-thumbnail-strip]:[--lb-inset-bottom:calc(8rem+var(--lb-safe-bottom))]",
          className,
        )}
        onPointerDown={(event) => {
          onPointerDown?.(event);
          const { target, clientX, clientY } = event;

          // The scrollport needs to receive touch input even outside the image.
          const onBackground =
            !event.defaultPrevented &&
            event.button === 0 &&
            target instanceof Element &&
            target.matches("[data-ramka-slides], [data-ramka-slide]");

          backgroundPress.current = onBackground ? { target, x: clientX, y: clientY } : null;
        }}
        onClick={(event) => {
          onClick?.(event);
          const press = backgroundPress.current;
          backgroundPress.current = null;

          if (
            !event.defaultPrevented &&
            press?.target === event.target &&
            Math.hypot(press.x - event.clientX, press.y - event.clientY) < 8
          ) {
            backdropRef.current?.click();
          }
        }}
        {...props}
      />
    </LightboxPortal>
  );
};

// Keep empty layout boxes transparent to the dialog's native scrim handler.
const LightboxStage = ({ className, ...props }: ComponentProps<typeof LightboxPrimitive.Stage>) => (
  <LightboxPrimitive.Stage
    data-slot="lightbox-stage"
    className={cn(
      "pointer-events-none [&>:not([data-ramka-slides],[data-ramka-item],[data-ramka-zoom])]:pointer-events-auto",
      className,
    )}
    {...props}
  />
);

const LightboxSlides = ({
  className,
  ...props
}: ComponentProps<typeof LightboxPrimitive.Slides>) => (
  <LightboxPrimitive.Slides
    data-slot="lightbox-slides"
    className={cn(
      "pointer-events-auto flex-1 scrollbar-none gap-4 md:gap-0 [&::-webkit-scrollbar]:hidden",
      className,
    )}
    {...props}
  />
);

const LightboxSlide = ({ className, ...props }: ComponentProps<typeof LightboxPrimitive.Slide>) => (
  <LightboxPrimitive.Slide
    data-slot="lightbox-slide"
    className={cn(
      "h-full min-w-full flex-[0_0_100%] px-(--lb-inset-x) pt-(--lb-inset-top) pb-(--lb-inset-bottom)",
      className,
    )}
    {...props}
  />
);

const LightboxItem = ({ className, ...props }: ComponentProps<typeof LightboxPrimitive.Item>) => (
  <LightboxPrimitive.Item
    data-slot="lightbox-item"
    className={cn("pointer-events-none [&>:not([data-ramka-zoom])]:pointer-events-auto", className)}
    {...props}
  />
);

const LightboxZoom = ({ className, ...props }: ComponentProps<typeof LightboxPrimitive.Zoom>) => (
  <LightboxPrimitive.Zoom
    data-slot="lightbox-zoom"
    // Ramka wraps the media in a full-size div for pan and zoom transforms.
    className={cn("pointer-events-none cursor-zoom-in [&>div>*]:pointer-events-auto", className)}
    {...props}
  />
);

const LightboxMedia = ({ className, ...props }: ComponentProps<typeof LightboxPrimitive.Media>) => (
  <LightboxPrimitive.Media
    data-slot="lightbox-media"
    className={cn(
      "pointer-events-auto overflow-hidden md:image-hairline md:rounded-lg [&_img]:select-none",
      className,
    )}
    {...props}
  />
);

// Header, footer and controls hide while a pull-to-dismiss gesture runs.
const hideWhilePulling =
  "group-data-pull-dismissing/lightbox:invisible group-data-pull-dismissing/lightbox:opacity-0 group-data-pulling/lightbox:invisible group-data-pulling/lightbox:opacity-0";

const hideWhenTouchZoomed =
  "pointer-coarse:group-data-zoomed/lightbox:invisible pointer-coarse:group-data-zoomed/lightbox:opacity-0";

const LightboxHeader = ({ className, ...props }: ComponentProps<"div">) => (
  <div
    data-slot="lightbox-header"
    className={cn(
      "pointer-events-none absolute inset-x-0 top-0 z-10 flex h-(--lb-inset-top) items-center justify-end gap-2 px-3 pt-(--lb-safe-top) *:pointer-events-auto",
      "transition-opacity duration-200 motion-reduce:transition-none",
      hideWhilePulling,
      hideWhenTouchZoomed,
      className,
    )}
    {...props}
  />
);

const LightboxFooter = ({ className, ...props }: ComponentProps<"div">) => (
  <div
    data-slot="lightbox-footer"
    className={cn(
      "pointer-events-none absolute inset-x-0 bottom-0 z-10 flex h-(--lb-inset-bottom) flex-col items-center justify-center gap-2 px-4 pb-(--lb-safe-bottom) text-center *:pointer-events-auto",
      "transition-opacity duration-200 motion-reduce:transition-none",
      hideWhilePulling,
      "group-data-zoomed/lightbox:invisible group-data-zoomed/lightbox:opacity-0",
      className,
    )}
    {...props}
  />
);

const LightboxClose = ({
  className,
  variant = "secondary",
  size = "icon",
  children,
  ...props
}: ComponentProps<typeof LightboxPrimitive.Close> & ButtonStyleProps) => (
  <LightboxPrimitive.Close
    data-slot="lightbox-close"
    render={<Button variant={variant} size={size} />}
    className={cn(hideWhenTouchZoomed, className)}
    {...props}
  >
    {children ?? (
      <>
        <HugeiconsIcon aria-hidden icon={Cancel01Icon} />
        <span className="sr-only">Close</span>
      </>
    )}
  </LightboxPrimitive.Close>
);

const LightboxZoomIn = ({
  className,
  variant = "secondary",
  size = "icon",
  children,
  ...props
}: ComponentProps<typeof LightboxPrimitive.ZoomIn> & ButtonStyleProps) => (
  <LightboxPrimitive.ZoomIn
    data-slot="lightbox-zoom-in"
    render={<Button variant={variant} size={size} />}
    className={cn("pointer-coarse:hidden", className)}
    {...props}
  >
    {children ?? (
      <>
        <HugeiconsIcon aria-hidden icon={ZoomInIcon} />
        <span className="sr-only">Zoom in</span>
      </>
    )}
  </LightboxPrimitive.ZoomIn>
);

const LightboxZoomOut = ({
  className,
  variant = "secondary",
  size = "icon",
  children,
  ...props
}: ComponentProps<typeof LightboxPrimitive.ZoomOut> & ButtonStyleProps) => (
  <LightboxPrimitive.ZoomOut
    data-slot="lightbox-zoom-out"
    render={<Button variant={variant} size={size} />}
    className={cn("pointer-coarse:hidden", className)}
    {...props}
  >
    {children ?? (
      <>
        <HugeiconsIcon aria-hidden icon={ZoomOutIcon} />
        <span className="sr-only">Zoom out</span>
      </>
    )}
  </LightboxPrimitive.ZoomOut>
);

const LightboxPrevious = ({
  className,
  variant = "secondary",
  size = "icon",
  children,
  ...props
}: ComponentProps<typeof LightboxPrimitive.Previous> & ButtonStyleProps) => (
  <LightboxPrimitive.Previous
    data-slot="lightbox-previous"
    render={<Button variant={variant} size={size} />}
    className={cn(
      "absolute inset-s-4 top-1/2 z-10 -translate-y-1/2 max-md:hidden rtl:[&_svg]:rotate-180",
      hideWhilePulling,
      hideWhenTouchZoomed,
      className,
    )}
    {...props}
  >
    {children ?? (
      <>
        <HugeiconsIcon aria-hidden icon={ArrowLeft01Icon} />
        <span className="sr-only">Previous</span>
      </>
    )}
  </LightboxPrimitive.Previous>
);

const LightboxNext = ({
  className,
  variant = "secondary",
  size = "icon",
  children,
  ...props
}: ComponentProps<typeof LightboxPrimitive.Next> & ButtonStyleProps) => (
  <LightboxPrimitive.Next
    data-slot="lightbox-next"
    render={<Button variant={variant} size={size} />}
    className={cn(
      "absolute inset-e-4 top-1/2 z-10 -translate-y-1/2 max-md:hidden rtl:[&_svg]:rotate-180",
      hideWhilePulling,
      hideWhenTouchZoomed,
      className,
    )}
    {...props}
  >
    {children ?? (
      <>
        <HugeiconsIcon aria-hidden icon={ArrowRight01Icon} />
        <span className="sr-only">Next</span>
      </>
    )}
  </LightboxPrimitive.Next>
);

type LightboxStepIndicatorProps = Omit<
  ComponentProps<typeof StepIndicator>,
  | "value"
  | "defaultValue"
  | "onValueChange"
  | "count"
  | "children"
  | "reach"
  | "autoplay"
  | "variant"
> & {
  /** Slide titles in gallery order, used for accessible names and tooltips. Defaults to "Slide N". */
  labels?: string[];
};

const LightboxStepIndicator = ({ labels, className, ...props }: LightboxStepIndicatorProps) => {
  const { activeIndex, itemCount, setActiveIndex } = useLightboxContext();

  return (
    <div
      data-slot="lightbox-step-indicator"
      className={cn("max-w-full scrollbar-none overflow-x-auto", className)}
    >
      <StepIndicator
        aria-label="Choose a slide"
        {...props}
        variant="dots"
        value={activeIndex}
        count={itemCount}
        onValueChange={(index) => {
          setActiveIndex(index, "button");
        }}
      >
        {Array.from({ length: itemCount }, (_, index) => (
          <Tooltip key={index}>
            <StepIndicatorItem
              index={index}
              label={labels?.[index] ?? `Slide ${index + 1}`}
              render={<TooltipTrigger />}
            />
            <TooltipContent>{labels?.[index] ?? `Slide ${index + 1}`}</TooltipContent>
          </Tooltip>
        ))}
      </StepIndicator>
      <LightboxPrimitive.Counter className="sr-only" />
    </div>
  );
};

const LightboxCaption = ({
  className,
  ...props
}: ComponentProps<typeof LightboxPrimitive.Caption>) => (
  <LightboxPrimitive.Caption
    data-slot="lightbox-caption"
    className={cn("max-w-full truncate text-control-sm text-foreground select-text", className)}
    {...props}
  />
);

const LightboxThumbnailGroup = (props: ComponentProps<typeof LightboxPrimitive.ThumbnailGroup>) => (
  <LightboxPrimitive.ThumbnailGroup data-slot="lightbox-thumbnail-group" {...props} />
);

const LightboxThumbnailStrip = ({
  className,
  ...props
}: ComponentProps<typeof LightboxPrimitive.ThumbnailStrip>) => (
  <LightboxPrimitive.ThumbnailStrip
    data-slot="lightbox-thumbnail-strip"
    className={cn(
      "w-full py-1",
      "[mask-image:linear-gradient(to_right,transparent,#0003_0.625rem,#000c_1.875rem,black_2.5rem,black_calc(100%-2.5rem),#000c_calc(100%-1.875rem),#0003_calc(100%-0.625rem),transparent)]",
      className,
    )}
    {...props}
  />
);

const LightboxThumbnailStripTrack = ({
  className,
  ...props
}: ComponentProps<typeof LightboxPrimitive.ThumbnailStripTrack>) => (
  <LightboxPrimitive.ThumbnailStripTrack
    data-slot="lightbox-thumbnail-strip-track"
    className={cn("flex w-max items-center gap-2", className)}
    {...props}
  />
);

const LightboxThumbnail = ({
  className,
  ...props
}: ComponentProps<typeof LightboxPrimitive.Thumbnail>) => (
  <LightboxPrimitive.Thumbnail
    data-slot="lightbox-thumbnail"
    className={cn(
      "inline-flex size-14 shrink-0 cursor-pointer items-center justify-center rounded-lg border surface-flat border-transparent p-0.5 outline-none",
      "transition-button duration-150 focus-visible:border-ring motion-reduce:transition-none data-active:border-primary",
      "[--image-hairline-inset:calc(1px+--spacing(0.5))] [--image-hairline-radius:var(--radius-sm)] has-[>:is(img,picture):only-child]:image-hairline",
      "[&_img]:size-full [&_img]:rounded-sm [&_img]:object-cover",
      className,
    )}
    {...props}
  />
);

export {
  createLightboxHandle,
  Lightbox,
  LightboxBackdrop,
  LightboxCaption,
  LightboxClose,
  LightboxContent,
  LightboxStepIndicator,
  LightboxFooter,
  LightboxHeader,
  LightboxItem,
  LightboxMedia,
  LightboxNext,
  LightboxPortal,
  LightboxPrevious,
  LightboxSlide,
  LightboxSlides,
  LightboxStage,
  LightboxThumbnail,
  LightboxThumbnailGroup,
  LightboxThumbnailStrip,
  LightboxThumbnailStripTrack,
  LightboxTrigger,
  LightboxZoom,
  LightboxZoomIn,
  LightboxZoomOut,
};

export type { LightboxHandle, LightboxStepIndicatorProps };
