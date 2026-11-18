import type { ErrorComponentProps } from "@tanstack/react-router";
import { Alert, AlertDescription, AlertTitle } from "@erbium/ui/components/alert";
import { Button } from "@erbium/ui/components/button";

export const DocPageError = ({ error, reset }: ErrorComponentProps) => (
  <article id="main-content" tabIndex={-1} className="docs-page outline-none">
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
  </article>
);
