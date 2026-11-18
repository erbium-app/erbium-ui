import { CSPProvider } from "@erbium/ui/components/csp-provider";
import { SkeletonProvider } from "@erbium/ui/components/skeleton";
import { Toaster } from "@erbium/ui/components/toast";
import { cn } from "@erbium/ui/lib/utils";
import type { ReactNode } from "react";

export const ShowcaseProviders = ({
  children,
  toast = false,
}: {
  children?: ReactNode;
  toast?: boolean;
}) => (
  <CSPProvider disableStyleElements>
    <SkeletonProvider>
      {children}
      {toast && <Toaster />}
    </SkeletonProvider>
  </CSPProvider>
);

/**
 * The box an example renders in. Inline it is capped to the reading width; with `fill` (a
 * full-screen slide) it takes the whole panel, so an example sized from its container (`w-full`,
 * `h-full` with a minimum) grows with it, while one with a natural size stays centred.
 */
export const ShowcaseSurface = ({
  children,
  fill = false,
}: {
  children?: ReactNode;
  fill?: boolean;
}) => (
  <div
    data-slot="component-preview"
    className={cn(
      "relative isolate mx-auto flex w-full min-w-0 items-center justify-center gap-section p-5 font-sans text-foreground contain-layout sm:p-8 [&>.min-w-72.max-w-2xl]:flex [&>.min-w-72.max-w-2xl]:flex-col [&>.min-w-72.max-w-2xl]:items-center [&>.min-w-72.max-w-2xl]:justify-center",
      fill ? "flex-1" : "min-h-64 max-w-3xl",
    )}
  >
    {children}
  </div>
);
