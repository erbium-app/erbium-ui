import * as React from "react";
import { Toast as ToastPrimitive } from "@base-ui/react/toast";
import type {
  ToastManager as BaseToastManager,
  ToastManagerAddOptions,
  ToastManagerUpdateOptions,
  ToastObject as BaseToastObject,
} from "@base-ui/react/toast";
import { cn } from "../lib/utils";
import { Button } from "./button";
import { Spinner } from "./spinner";
import { shake } from "../lib/shake";
import { HugeiconsIcon } from "@hugeicons/react";
import CircleCheckIcon from "@hugeicons/core-free-icons/CircleCheckIcon";
import InfoIcon from "@hugeicons/core-free-icons/InfoIcon";
import OctagonXIcon from "@hugeicons/core-free-icons/OctagonXIcon";
import TriangleAlertIcon from "@hugeicons/core-free-icons/TriangleAlertIcon";
import XIcon from "@hugeicons/core-free-icons/XIcon";
import { cva } from "class-variance-authority";

const toastIconByType = {
  success: { icon: CircleCheckIcon, className: "text-success" },
  info: { icon: InfoIcon, className: "text-info" },
  warning: { icon: TriangleAlertIcon, className: "text-warning" },
  error: { icon: OctagonXIcon, className: "text-error" },
} as const;

const toastVariants = cva(
  "group/toast pointer-events-auto absolute inset-e-0 bottom-0 z-[calc(1000-var(--toast-index))] w-full origin-bottom rounded-2xl border will-change-transform outline-none select-none focus-visible:border-ring",
  {
    variants: {
      type: {
        default: "surface-overlay text-popover-foreground",
        loading: "surface-overlay text-popover-foreground",
        error: "surface-tint-error-soft text-error-soft-foreground",
        info: "surface-tint-info-soft text-info-soft-foreground",
        success: "surface-tint-success-soft text-success-soft-foreground",
        warning: "surface-tint-warning-soft text-warning-soft-foreground",
      },
    },
    defaultVariants: {
      type: "default",
    },
  },
);

type ToastType = keyof typeof toastIconByType | "loading";
type ToastItem = Omit<BaseToastObject<object>, "type"> & { type?: ToastType };
type ToastAddOptions = Omit<ToastManagerAddOptions<object>, "type"> & { type?: ToastType };
type ToastUpdateOptions = Omit<ToastManagerUpdateOptions<object>, "type"> & { type?: ToastType };
type ToastManagerApi = Omit<BaseToastManager, "add" | "update"> & {
  add: (options: ToastAddOptions) => string;
  update: (
    id: string,
    updates: ToastUpdateOptions | ((previous: ToastItem) => ToastUpdateOptions),
  ) => void;
};

function createToastManager(): ToastManagerApi {
  return ToastPrimitive.createToastManager() as unknown as ToastManagerApi;
}

const toast = createToastManager();

function ToastProvider({
  toastManager,
  ...props
}: Omit<ToastPrimitive.Provider.Props, "toastManager"> & { toastManager?: ToastManagerApi }) {
  return (
    <ToastPrimitive.Provider
      {...props}
      toastManager={toastManager as BaseToastManager | undefined}
    />
  );
}

function ToastPortal({ ...props }: ToastPrimitive.Portal.Props) {
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
  const swipeDirection =
    typeof document !== "undefined" && document.documentElement.dir === "rtl" ? "left" : "right";

  return (
    <ToastPrimitive.Root
      data-slot="toast"
      toast={toast}
      swipeDirection={swipeDirection}
      className={cn(
        toastVariants({ type: toast.type ?? "default" }),
        "[--gap:0.75rem] [--height:var(--toast-frontmost-height,var(--toast-height))] [--offset-y:calc(var(--toast-offset-y)*-1+calc(var(--toast-index)*var(--gap)*-1)+var(--toast-swipe-movement-y))] [--peek:0.75rem] [--scale:calc(max(0,1-(var(--toast-index)*0.1)))] [--shrink:calc(1-var(--scale))] [--position-y:calc(var(--toast-swipe-movement-y)-(var(--toast-index)*var(--peek))-(var(--shrink)*var(--height)))]",
        "h-(--height) transform-[translateX(var(--toast-swipe-movement-x))_translateY(var(--position-y))_scale(var(--scale))] [transition:transform_500ms_cubic-bezier(0.22,1,0.36,1),opacity_500ms,height_150ms]",
        "after:absolute after:top-full after:inset-s-0 after:h-[calc(var(--gap)+1px)] after:w-full after:content-['']",
        "data-expanded:h-(--toast-height) data-expanded:[--position-y:var(--offset-y)] data-expanded:[--scale:1]",
        "data-limited:invisible [&[data-stack-hidden]:not([data-expanded])]:invisible data-starting-style:transform-[translateY(150%)]",
        "data-ending-style:opacity-0",
        "[&[data-ending-style]:not([data-swipe-direction])]:transform-[translateX(calc(var(--toast-swipe-movement-x)+150%))_translateY(var(--position-y))_scale(var(--scale))]",
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
        "flex h-full items-center gap-3 overflow-hidden p-4 transition-opacity duration-250 ease-[cubic-bezier(0.22,1,0.36,1)] data-behind:opacity-0 data-expanded:opacity-100",
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

function ToastIcon({ type }: { type: ToastType | undefined }) {
  const statusIcon = isToastIconType(type) ? toastIconByType[type] : undefined;
  const icon =
    type === "loading" ? (
      <Spinner aria-hidden="true" />
    ) : statusIcon ? (
      <HugeiconsIcon icon={statusIcon.icon} className={statusIcon.className} aria-hidden="true" />
    ) : null;

  if (!icon) {
    return null;
  }

  return (
    <span
      data-slot="toast-icon"
      className="shrink-0 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4"
    >
      {icon}
    </span>
  );
}

function isToastIconType(type: string | undefined): type is keyof typeof toastIconByType {
  return type !== undefined && Object.hasOwn(toastIconByType, type);
}

function ToastListItem({ toastItem, index }: { toastItem: ToastItem; index: number }) {
  const rootRef = React.useRef<HTMLDivElement>(null);
  const previous = React.useRef<{
    updateKey: number | undefined;
    title: React.ReactNode;
    description: React.ReactNode;
    type: string | undefined;
  } | null>(null);

  React.useEffect(() => {
    const last = previous.current;

    if (
      last &&
      last.updateKey !== toastItem.updateKey &&
      last.title === toastItem.title &&
      last.description === toastItem.description &&
      last.type === toastItem.type
    ) {
      shake(rootRef.current);
    }

    previous.current = {
      updateKey: toastItem.updateKey,
      title: toastItem.title,
      description: toastItem.description,
      type: toastItem.type,
    };
  }, [toastItem.updateKey, toastItem.title, toastItem.description, toastItem.type]);

  return (
    <Toast ref={rootRef} toast={toastItem} data-stack-hidden={index >= 3 ? "" : undefined}>
      <ToastContent>
        <ToastIcon type={toastItem.type} />
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

function ToastList() {
  const { toasts } = useToastManager();

  const stackHeight = toasts.reduce((height, toastItem) => height + (toastItem.height ?? 0), 0);

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
      {toasts.map((toastItem, index) => (
        <ToastListItem key={toastItem.id} toastItem={toastItem} index={index} />
      ))}
    </div>
  );
}

function Toaster() {
  return (
    // Keep older entries available to Base UI when its viewport expands.
    <ToastProvider toastManager={toast} limit={Number.POSITIVE_INFINITY}>
      <ToastPortal>
        <ToastViewport>
          <ToastList />
        </ToastViewport>
      </ToastPortal>
    </ToastProvider>
  );
}

function useToastManager() {
  return ToastPrimitive.useToastManager() as Omit<
    ReturnType<typeof ToastPrimitive.useToastManager>,
    "add" | "update" | "toasts"
  > & {
    add: ToastManagerApi["add"];
    update: ToastManagerApi["update"];
    toasts: ToastItem[];
  };
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
  createToastManager,
  toast,
  useToastManager,
};
export type { ToastItem, ToastType };
