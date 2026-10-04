import { CSPProvider } from "@erbium/ui/components/csp-provider";
import { OverlayProvider } from "@erbium/ui/components/overlay-provider";
import { Toaster } from "@erbium/ui/components/toast";
import type { ReactNode } from "react";

export function ShowcaseProviders({
  children,
  toast = false,
}: {
  children?: ReactNode;
  toast?: boolean;
}) {
  return (
    <CSPProvider disableStyleElements>
      <OverlayProvider>
        {children}
        {toast && <Toaster />}
      </OverlayProvider>
    </CSPProvider>
  );
}

export function ShowcaseSurface({ children }: { children?: ReactNode }) {
  return (
    <div
      data-slot="component-preview"
      className="relative isolate mx-auto flex min-h-64 w-full min-w-0 max-w-3xl items-center justify-center gap-6 p-5 font-sans text-foreground contain-layout sm:p-8 [&>.min-w-72.max-w-2xl]:flex [&>.min-w-72.max-w-2xl]:flex-col [&>.min-w-72.max-w-2xl]:items-center [&>.min-w-72.max-w-2xl]:justify-center"
    >
      {children}
    </div>
  );
}
