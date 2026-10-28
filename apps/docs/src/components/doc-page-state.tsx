import type { ErrorComponentProps } from "@tanstack/react-router";
import { Alert, AlertDescription, AlertTitle } from "@erbium/ui/components/alert";
import { Button } from "@erbium/ui/components/button";
import { Spinner } from "@erbium/ui/components/spinner";

export const DocPagePending = () => (
  <main
    id="main-content"
    aria-busy="true"
    className="docs-page surface-panel border border-transparent rounded-xl"
  >
    <div className="docs-page-body">
      <div className="docs-page-inner grid min-h-[calc(100svh_-_2*var(--site-section-space))] place-items-center">
        <Spinner className="text-muted-foreground" size="xl" />
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
