import { useState } from "react";
import { Input } from "@erbium/ui/components/input";
import {
  Stepper,
  StepperActions,
  StepperIndicator,
  StepperItem,
  StepperList,
  StepperNext,
  StepperPanel,
  StepperPrevious,
  StepperSeparator,
  StepperText,
  StepperTitle,
  StepperTrigger,
} from "@erbium/ui/components/stepper";
import type { StepperGuard } from "@erbium/ui/components/stepper";

const steps = [
  { id: "handle", title: "Handle" },
  { id: "confirm", title: "Confirm" },
];

const taken = new Set(["admin", "erbium", "root"]);

/** Waits `ms`, or less if `signal` aborts first. */
const wait = async (ms: number, signal: AbortSignal) => {
  // oxlint-disable-next-line promise/avoid-new -- browsers have no promise-based timer, so the delay wraps `setTimeout`.
  await new Promise<void>((resolve) => {
    const timer = setTimeout(resolve, ms);

    signal.addEventListener("abort", () => {
      clearTimeout(timer);
      resolve();
    });
  });
};

/** Stands in for a server check. Aborting it stops the wait. */
const isAvailable = async (handle: string, signal: AbortSignal) => {
  await wait(900, signal);
  signal.throwIfAborted();

  return !taken.has(handle.trim().toLowerCase());
};

export default function StepperAsyncGuardExample() {
  const [handle, setHandle] = useState("admin");

  // Next waits for the check. Clicking again while it runs is ignored, and the buttons stay
  // focusable with aria-busy.
  const guard: StepperGuard = async ({ signal, step }) =>
    step === "handle" ? await isAvailable(handle, signal) : true;

  return (
    <Stepper steps={steps} guard={guard} className="max-w-sm">
      <StepperList aria-label="Claim a handle">
        {steps.map((step) => (
          <StepperItem key={step.id} value={step.id}>
            <StepperTrigger>
              <StepperIndicator />
              <StepperText>
                <StepperTitle>{step.title}</StepperTitle>
              </StepperText>
            </StepperTrigger>
            <StepperSeparator />
          </StepperItem>
        ))}
      </StepperList>
      <StepperPanel value="handle" className="flex flex-col gap-related">
        <Input
          aria-label="Handle"
          value={handle}
          onChange={(event) => {
            setHandle(event.target.value);
          }}
        />
        <p className="text-control-sm text-muted-foreground">admin, erbium and root are taken.</p>
      </StepperPanel>
      <StepperPanel value="confirm" className="text-control">
        @{handle} is yours.
      </StepperPanel>
      <StepperActions>
        <StepperPrevious />
        <StepperNext />
      </StepperActions>
    </Stepper>
  );
}
