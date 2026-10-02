import * as React from "react";
import { useDebouncer } from "@tanstack/react-pacer/debouncer";
import { Toast as ToastPrimitive } from "@base-ui/react/toast";
import type {
  ToastManager as BaseToastManager,
  ToastManagerAddOptions,
  ToastManagerUpdateOptions,
} from "@base-ui/react/toast";
import { cn } from "../lib/utils";
import { Button } from "./button";
import { useDirection } from "./direction";
import { Spinner } from "./spinner";
import { shake } from "../lib/shake";
import { HugeiconsIcon } from "@hugeicons/react";
import CircleCheckIcon from "@hugeicons/core-free-icons/CircleCheckIcon";
import InfoIcon from "@hugeicons/core-free-icons/InfoIcon";
import OctagonXIcon from "@hugeicons/core-free-icons/OctagonXIcon";
import TriangleAlertIcon from "@hugeicons/core-free-icons/TriangleAlertIcon";
import XIcon from "@hugeicons/core-free-icons/XIcon";

// `loading`, `success`, and `error` match the types Base UI assigns in `toast.promise`.
type ToastType = "default" | "loading" | "success" | "info" | "warning" | "error";

type WithToastType<T> = Omit<T, "type"> & { type?: ToastType | undefined };
type ToastItem = WithToastType<ToastPrimitive.Root.ToastObject<object>>;
type ToastAddOptions = WithToastType<ToastManagerAddOptions<object>>;
type ToastUpdateOptions = WithToastType<ToastManagerUpdateOptions<object>>;

interface ToastManager extends Omit<BaseToastManager, "add" | "update"> {
  add(options: ToastAddOptions): string;
  update(
    id: string,
    updates: ToastUpdateOptions | ((previous: ToastItem) => ToastUpdateOptions),
  ): void;
}

const toastTypes: Record<ToastType, { className: string; icon?: React.ReactNode }> = {
  default: { className: "surface-overlay text-popover-foreground" },
  loading: {
    className: "surface-overlay text-popover-foreground",
    icon: <Spinner aria-hidden="true" />,
  },
  success: {
    className: "surface-tint-success-soft text-success-soft-foreground",
    icon: <HugeiconsIcon icon={CircleCheckIcon} className="text-success" aria-hidden="true" />,
  },
  info: {
    className: "surface-tint-info-soft text-info-soft-foreground",
    icon: <HugeiconsIcon icon={InfoIcon} className="text-info" aria-hidden="true" />,
  },
  warning: {
    className: "surface-tint-warning-soft text-warning-soft-foreground",
    icon: <HugeiconsIcon icon={TriangleAlertIcon} className="text-warning" aria-hidden="true" />,
  },
  error: {
    className: "surface-tint-error-soft text-error-soft-foreground",
    icon: <HugeiconsIcon icon={OctagonXIcon} className="text-error" aria-hidden="true" />,
  },
};

// Older toasts stay mounted so the expanded viewport can show them.
const VISIBLE_STACK_SIZE = 3;

const toastManager = ToastPrimitive.createToastManager();

// Base UI types `type` as `string`; this is the one place it is narrowed to `ToastType`.
const toast = toastManager as ToastManager;

function useToastManager() {
  return ToastPrimitive.useToastManager() as Omit<ToastManager, " subscribe"> & {
    toasts: ToastItem[];
  };
}

function ToastProvider(props: ToastPrimitive.Provider.Props) {
  return <ToastPrimitive.Provider {...props} />;
}

function ToastPortal(props: ToastPrimitive.Portal.Props) {
  return <ToastPrimitive.Portal data-slot="toast-portal" {...props} />;
}

function ToastViewport({ className, ...props }: ToastPrimitive.Viewport.Props) {
  return (
    <ToastPrimitive.Viewport
      data-slot="toast-viewport"
      className={cn(
        "group/toast-viewport pointer-events-none fixed inset-x-4 bottom-4 z-50 mx-auto w-auto max-w-sm outline-none sm:inset-e-4 sm:inset-s-auto sm:mx-0 sm:w-full",
        "data-expanded:inset-x-0 data-expanded:bottom-0 data-expanded:flex data-expanded:max-h-dvh data-expanded:max-w-104 data-expanded:flex-col-reverse data-expanded:scroll-fade-y data-expanded:overflow-y-auto data-expanded:p-4 sm:data-expanded:inset-e-0 sm:data-expanded:inset-s-auto",
        className,
      )}
      {...props}
    />
  );
}

function Toast({
  className,
  toast,
  ...props
}: Omit<ToastPrimitive.Root.Props, "swipeDirection" | "toast"> & { toast: ToastItem }) {
  // Toasts sit at the inline end of the page, so that is the side they swipe away to.
  const swipeDirection = useDirection() === "rtl" ? "left" : "right";

  return (
    <ToastPrimitive.Root
      data-slot="toast"
      toast={toast}
      swipeDirection={swipeDirection}
      className={cn(
        "group/toast pointer-events-auto absolute inset-e-0 bottom-0 z-[calc(1000-var(--toast-index))] w-full origin-bottom rounded-2xl border will-change-transform outline-none select-none focus-visible:border-ring",
        toastTypes[toast.type ?? "default"].className,
        "[--gap:0.75rem] [--height:var(--toast-frontmost-height,var(--toast-height))] [--offset-y:calc(var(--toast-offset-y)*-1+calc(var(--toast-index)*var(--gap)*-1)+var(--toast-swipe-movement-y))] [--peek:0.75rem] [--scale:calc(max(0,1-(var(--toast-index)*0.1)))] [--shrink:calc(1-var(--scale))] [--position-y:calc(var(--toast-swipe-movement-y)-(var(--toast-index)*var(--peek))-(var(--shrink)*var(--height)))]",
        // Layout moves use `--move`, exits are quicker (200ms), and reduced motion keeps only the fades.
        "[--fade:300ms] [--move:500ms] data-ending-style:[--fade:200ms] data-ending-style:[--move:200ms] motion-reduce:[--move:0ms] motion-reduce:data-ending-style:[--move:0ms]",
        "h-(--height) touch-pan-y transform-[translateX(var(--toast-swipe-movement-x))_translateY(var(--position-y))_scale(var(--scale))] [transition:transform_var(--move)_cubic-bezier(0.22,1,0.36,1),opacity_var(--fade)_ease-out,height_var(--move)_cubic-bezier(0.22,1,0.36,1),visibility_var(--move)] data-swiping:transition-none",
        "after:absolute after:top-full after:inset-s-0 after:h-[calc(var(--gap)+1px)] after:w-full after:content-['']",
        "data-expanded:h-(--toast-height) data-expanded:[--position-y:var(--offset-y)] data-expanded:[--scale:1]",
        "data-limited:invisible data-limited:opacity-0 [&[data-stack-hidden]:not([data-expanded])]:pointer-events-none [&[data-stack-hidden]:not([data-expanded])]:invisible [&[data-stack-hidden]:not([data-expanded])]:opacity-0",
        "data-starting-style:transform-[translateY(150%)] data-starting-style:opacity-0",
        // Auto-dismissed toasts sink back down; swiped toasts keep going toward the inline end.
        "data-ending-style:transform-[translateX(var(--toast-swipe-movement-x))_translateY(calc(var(--position-y)+100%))_scale(var(--scale))] data-ending-style:opacity-0",
        "data-ending-style:data-[swipe-direction=left]:transform-[translateX(calc(var(--toast-swipe-movement-x)-150%))_translateY(var(--position-y))_scale(var(--scale))]",
        "data-ending-style:data-[swipe-direction=right]:transform-[translateX(calc(var(--toast-swipe-movement-x)+150%))_translateY(var(--position-y))_scale(var(--scale))]",
        className,
      )}
      {...props}
    />
  );
}

function ToastContent({ className, ...props }: ToastPrimitive.Content.Props) {
  return (
    <ToastPrimitive.Content
      data-slot="toast-content"
      className={cn(
        "flex items-center gap-3 overflow-hidden p-4 transition-opacity duration-250 ease-[cubic-bezier(0.22,1,0.36,1)] data-behind:opacity-0 data-expanded:opacity-100",
        className,
      )}
      {...props}
    />
  );
}

function ToastTitle({ className, ...props }: ToastPrimitive.Title.Props) {
  return (
    <ToastPrimitive.Title
      data-slot="toast-title"
      className={cn("text-sm font-medium", className)}
      {...props}
    />
  );
}

function ToastDescription({ className, ...props }: ToastPrimitive.Description.Props) {
  return (
    <ToastPrimitive.Description
      data-slot="toast-description"
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  );
}

function ToastAction({
  className,
  render = <Button variant="outline" size="sm" />,
  ...props
}: ToastPrimitive.Action.Props) {
  return (
    <ToastPrimitive.Action
      data-slot="toast-action"
      render={render}
      className={cn("shrink-0", className)}
      {...props}
    />
  );
}

function ToastClose({
  className,
  children,
  render = <Button variant="ghost" size="icon-sm" />,
  ...props
}: ToastPrimitive.Close.Props) {
  return (
    <ToastPrimitive.Close
      data-slot="toast-close"
      aria-label="Close toast"
      render={render}
      className={cn(
        "relative shrink-0 text-muted-foreground after:absolute after:-inset-2 after:content-[''] hover:text-foreground",
        className,
      )}
      {...props}
    >
      {children ?? <HugeiconsIcon icon={XIcon} aria-hidden="true" />}
    </ToastPrimitive.Close>
  );
}

// Base UI only exposes the expanded state through hover and focus on the viewport, so the stack
// is revealed by replaying the pointer events it already listens for. Timers pause while it is open.
const REVEAL_SETTLE = 320;
const REVEAL_HOLD = 1400;

// Closes a stack that was fanned out for a repeat, unless a real pointer is over it.
// Base UI collapses it itself when that pointer leaves.
function collapseStack(viewport: HTMLElement) {
  if (!viewport.matches(":hover")) {
    viewport.dispatchEvent(new MouseEvent("mouseout", { bubbles: true }));
  }
}

function revealStack(viewport: HTMLElement) {
  const opened = !viewport.hasAttribute("data-expanded");
  if (opened) {
    viewport.dispatchEvent(new MouseEvent("mousemove", { bubbles: true }));
  }

  return opened;
}

interface StackCollapse {
  maybeExecute: (viewport: HTMLElement) => void;
  cancel: () => void;
}

function ToasterItem({
  item,
  index,
  buried,
  collapse,
}: {
  item: ToastItem;
  index: number;
  buried: boolean;
  collapse: StackCollapse;
}) {
  const rootRef = React.useRef<HTMLDivElement>(null);
  const previous = React.useRef(item);
  const shakeTimer = React.useRef<number | undefined>(undefined);
  const { icon } = toastTypes[item.type ?? "default"];

  React.useEffect(() => () => window.clearTimeout(shakeTimer.current), []);

  // Base UI bumps `updateKey` on every upsert; shake only when nothing visible changed.
  React.useEffect(() => {
    const last = previous.current;
    previous.current = item;

    if (
      last.updateKey === item.updateKey ||
      last.title !== item.title ||
      last.description !== item.description ||
      last.type !== item.type
    ) {
      return;
    }

    const root = rootRef.current;
    const viewport = root?.closest<HTMLElement>('[data-slot="toast-viewport"]');
    window.clearTimeout(shakeTimer.current);

    // A toast tucked behind a newer one would shake out of sight, so fan the stack out first.
    if (!root || !viewport || !buried) {
      shake(root ?? null);
      return;
    }

    collapse.cancel();
    const opened = revealStack(viewport);
    shakeTimer.current = window.setTimeout(
      () => {
        root.scrollIntoView?.({ block: "nearest", behavior: "smooth" });
        shake(root);
        collapse.maybeExecute(viewport);
      },
      opened ? REVEAL_SETTLE : 0,
    );
  }, [item, buried, collapse]);

  return (
    <Toast
      ref={rootRef}
      toast={item}
      data-stack-hidden={index >= VISIBLE_STACK_SIZE ? "" : undefined}
    >
      <ToastContent>
        {icon ? (
          <span
            data-slot="toast-icon"
            className="shrink-0 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4"
          >
            {icon}
          </span>
        ) : null}
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <ToastTitle />
          <ToastDescription />
        </div>
        <ToastAction />
        <ToastClose />
      </ToastContent>
    </Toast>
  );
}

function ToasterStack() {
  const { toasts } = useToastManager();
  // Each repeat restarts the hold, so the stack closes once the last shake has had its moment.
  const collapse = useDebouncer(collapseStack, { wait: REVEAL_HOLD });
  const stackHeight = toasts.reduce((height, item) => height + (item.height ?? 0), 0);
  // Toasts are newest first; anything after the first one that is not leaving sits behind it.
  const frontIndex = toasts.findIndex((item) => item.transitionStatus !== "ending");

  return (
    <div
      data-slot="toast-stack"
      className="relative h-0 w-full shrink-0 [--gap:0.75rem] group-data-expanded/toast-viewport:h-(--toast-stack-height)"
      style={
        {
          "--toast-stack-height": `calc(${stackHeight}px + ${Math.max(0, toasts.length - 1)} * var(--gap))`,
        } as React.CSSProperties
      }
    >
      {toasts.map((item, index) => (
        <ToasterItem
          key={item.id}
          item={item}
          index={index}
          buried={index > frontIndex}
          collapse={collapse}
        />
      ))}
    </div>
  );
}

function Toaster() {
  return (
    <ToastProvider toastManager={toastManager} limit={Number.POSITIVE_INFINITY}>
      <ToastPortal>
        <ToastViewport>
          <ToasterStack />
        </ToastViewport>
      </ToastPortal>
    </ToastProvider>
  );
}

export {
  Toaster,
  Toast,
  ToastAction,
  ToastClose,
  ToastContent,
  ToastDescription,
  ToastPortal,
  ToastProvider,
  ToastTitle,
  ToastViewport,
  toast,
  useToastManager,
};
export type { ToastItem, ToastManager, ToastType };
