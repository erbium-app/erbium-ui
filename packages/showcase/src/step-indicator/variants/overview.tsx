import { useState } from "react";
import { StepIndicator } from "@erbium/ui/blocks/step-indicator";
import { Button } from "@erbium/ui/components/button";

export default function Example() {
  const [step, setStep] = useState(1);
  return (
    <div className="flex flex-col items-center gap-4">
      <StepIndicator count={4} value={step} onValueChange={setStep} aria-label="Setup progress" />
      <div className="flex gap-2">
        <Button variant="outline" disabled={step === 0} onClick={() => setStep(step - 1)}>
          Back
        </Button>
        <Button disabled={step === 3} onClick={() => setStep(step + 1)}>
          Next
        </Button>
      </div>
    </div>
  );
}
