import { useState } from "react";
import { StepIndicator } from "@erbium/ui/blocks/step-indicator";
import { Button } from "@erbium/ui/components/button";

const COUNT = 5;

export default function StepIndicatorBlockedExample() {
  const [step, setStep] = useState(0);
  const [reach, setReach] = useState(0);

  const goTo = (next: number) => {
    setStep(next);
    setReach((current) => Math.max(current, next));
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <StepIndicator
        count={COUNT}
        value={step}
        reach={reach}
        onValueChange={setStep}
        aria-label="Onboarding"
      />
      <div className="flex gap-2">
        <Button
          variant="outline"
          disabled={step === 0}
          onClick={() => {
            setStep(step - 1);
          }}
        >
          Back
        </Button>
        <Button
          disabled={step === COUNT - 1}
          onClick={() => {
            goTo(step + 1);
          }}
        >
          Continue
        </Button>
      </div>
      <p className="text-caption text-muted-foreground">
        Dots ahead of the furthest step you reached are blocked.
      </p>
    </div>
  );
}
