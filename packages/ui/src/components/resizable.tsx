import { cn } from "../lib/utils";
import * as ResizablePrimitive from "react-resizable-panels";

const ResizablePanelGroup = ({ className, ...props }: ResizablePrimitive.GroupProps) => (
  <ResizablePrimitive.Group
    data-slot="resizable-panel-group"
    className={cn("flex h-full w-full aria-[orientation=vertical]:flex-col", className)}
    {...props}
  />
);

const ResizablePanel = ({ ...props }: ResizablePrimitive.PanelProps) => (
  <ResizablePrimitive.Panel data-slot="resizable-panel" {...props} />
);

const ResizableHandle = ({
  withHandle,
  className,
  ...props
}: ResizablePrimitive.SeparatorProps & {
  withHandle?: boolean;
}) => (
  <ResizablePrimitive.Separator
    data-slot="resizable-handle"
    data-separator=""
    className={cn(
      "relative flex w-0.5 items-center justify-center after:absolute after:inset-y-0 after:inset-s-1/2 after:w-1 after:-translate-x-1/2 focus-visible:outline-hidden focus-visible:[--surface-shadow-divider:var(--ring)] aria-[orientation=horizontal]:h-0.5 aria-[orientation=horizontal]:w-full aria-[orientation=horizontal]:after:inset-s-0 aria-[orientation=horizontal]:after:h-1 aria-[orientation=horizontal]:after:w-full aria-[orientation=horizontal]:after:translate-x-0 aria-[orientation=horizontal]:after:-translate-y-1/2 rtl:after:translate-x-1/2 rtl:aria-[orientation=horizontal]:after:translate-x-0 [&[aria-orientation=horizontal]>div]:rotate-90",
      className,
    )}
    {...props}
  >
    {withHandle === true && <div className="z-10 flex h-6 w-1 shrink-0 rounded-lg bg-border" />}
  </ResizablePrimitive.Separator>
);

export { ResizableHandle, ResizablePanel, ResizablePanelGroup };
