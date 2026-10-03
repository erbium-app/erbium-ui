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
      className="relative isolate flex w-full min-w-0 items-center justify-center font-sans text-foreground contain-layout"
    >
      {children}
    </div>
  );
}
