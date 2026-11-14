import { useRef, useState } from "react";
import { Button } from "@erbium/ui/components/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogPanel,
  DialogTitle,
  DialogTrigger,
} from "@erbium/ui/components/dialog";
import { Spinner } from "@erbium/ui/components/spinner";
import { usePredictedIntent } from "@erbium/ui/hooks/use-predicted-intent";

// The report takes this long to load, as a slow API would.
const loadTime = 900;

type Status = "idle" | "loading" | "ready";

const labels: Record<Status, string> = {
  idle: "not requested",
  loading: "loading",
  ready: "ready",
};

const wait = async (ms: number) => {
  // Browsers have no promise-based timer, so the delay wraps `setTimeout`.
  // oxlint-disable-next-line promise/avoid-new
  await new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
};

const UsePredictedIntentDemo = () => {
  const [status, setStatus] = useState<Status>("idle");
  const [source, setSource] = useState<"click" | "prediction">();
  // The current request; a reset clears it so a late response is ignored.
  const request = useRef<symbol>(undefined);

  // Starts the request once; prediction and opening the dialog share it.
  const load = (trigger: "click" | "prediction") => {
    if (request.current !== undefined) {
      return;
    }

    const current = Symbol(trigger);
    request.current = current;
    setSource(trigger);
    setStatus("loading");
    void (async () => {
      await wait(loadTime);

      if (request.current === current) {
        setStatus("ready");
      }
    })();
  };

  // `load` ignores repeat calls, so prediction can fire again at once after a reset.
  const intentRef = usePredictedIntent(
    () => {
      load("prediction");
    },
    { reactivateAfter: 0 },
  );

  return (
    <div className="flex flex-col items-center gap-group">
      <Dialog
        onOpenChange={(open) => {
          if (open) {
            load("click");
          }
        }}
      >
        <DialogTrigger ref={intentRef} render={<Button variant="outline">Open report</Button>} />
        <DialogPanel className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Quarterly report</DialogTitle>
            <DialogDescription>Revenue and churn for the last quarter.</DialogDescription>
          </DialogHeader>
          <DialogContent>
            {status === "ready" ? (
              <p>Revenue grew 12% while churn held at 2.1%.</p>
            ) : (
              <p className="flex items-center gap-related text-muted-foreground">
                <Spinner /> Loading the report…
              </p>
            )}
          </DialogContent>
        </DialogPanel>
      </Dialog>
      <p className="text-caption text-muted-foreground" aria-live="polite">
        Report data: {labels[status]}
        {source === undefined ? "" : `, requested by ${source}`}.
      </p>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => {
          request.current = undefined;
          setSource(undefined);
          setStatus("idle");
        }}
      >
        Reset
      </Button>
    </div>
  );
};

export default UsePredictedIntentDemo;
