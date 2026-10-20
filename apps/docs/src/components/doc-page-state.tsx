import type { ErrorComponentProps } from "@tanstack/react-router";
import { Alert, AlertDescription, AlertTitle } from "@erbium/ui/components/alert";
import { Button } from "@erbium/ui/components/button";
import { Skeleton } from "@erbium/ui/components/skeleton";

export const DocPagePending = () => (
  <main
    id="main-content"
    aria-busy="true"
    aria-live="polite"
    className="docs-page surface-panel border border-transparent rounded-xl"
  >
    <div className="docs-page-body">
      <div className="docs-page-inner">
        <span className="sr-only">Loading documentation page</span>
        <Skeleton className="h-10 w-1/2" />
        <Skeleton className="mt-3 h-5 w-3/4" />
        <Skeleton className="mt-6 h-64 w-full" />
      </div>
    </div>
  </main>
);

export const DocPageError = ({ error, reset }: ErrorComponentProps) => (
  <main id="main-content" className="docs-page surface-panel border border-transparent rounded-xl">
    <div className="docs-page-body">
      <div className="docs-page-inner flex flex-col items-start gap-4">
        <Alert variant="error">
          <AlertTitle>This page could not load.</AlertTitle>
          <AlertDescription>
            {error instanceof Error && error.message
              ? error.message
              : "An unexpected error stopped the page."}
          </AlertDescription>
        </Alert>
        <Button variant="outline" size="sm" onClick={reset}>
          Try again
        </Button>
      </div>
    </div>
  </main>
);
