import { LogoLoader } from "@erbium/ui/components/logo-loader";
import { useState } from "react";
import { useSimulatedFetch } from "../../loading";

const report = { pages: 12, title: "Quarterly usage report" };

type Report = typeof report;

/** A generated file has no layout to preview, so the mark carries the wait. */
export const defaultProps = {} satisfies { latency?: number };

export default function LogoLoaderRequestExample({ latency }: { latency?: number } = defaultProps) {
  const request = useSimulatedFetch(report, { latency });
  // The result appears once the mark has come to rest, not mid-step.
  const [revealed, setRevealed] = useState<Report>();
  const result = request.loading ? undefined : revealed;

  return (
    <div className="flex w-full max-w-xs flex-col items-center gap-group text-center">
      <LogoLoader
        className="size-16"
        label="Generating report"
        loading={request.loading}
        onResolved={() => {
          setRevealed(request.data);
        }}
      />
      <p className="text-body text-muted-foreground" aria-live="polite">
        {result ? `${result.title} is ready: ${result.pages} pages.` : "Generating report…"}
      </p>
    </div>
  );
}
