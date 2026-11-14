import { CSPProvider } from "@erbium/ui/components/csp-provider";
import { OverlayProvider } from "@erbium/ui/components/overlay-provider";
import { SkeletonProvider } from "@erbium/ui/components/skeleton";
import { Toaster } from "@erbium/ui/components/toast";
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
      <OverlayProvider>
        {children}
        {toast && <Toaster />}
      </OverlayProvider>
    </SkeletonProvider>
  </CSPProvider>
);

export const ShowcaseSurface = ({ children }: { children?: ReactNode }) => (
  <div
    data-slot="component-preview"
    className="relative isolate mx-auto flex min-h-64 w-full min-w-0 max-w-3xl items-center justify-center gap-section p-5 font-sans text-foreground contain-layout sm:p-8 [&>.min-w-72.max-w-2xl]:flex [&>.min-w-72.max-w-2xl]:flex-col [&>.min-w-72.max-w-2xl]:items-center [&>.min-w-72.max-w-2xl]:justify-center"
  >
    {children}
  </div>
);
