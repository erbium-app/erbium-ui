import { useState } from "react";
import { StepIndicator } from "@erbium/ui/blocks/step-indicator";

export default function StepIndicatorVerticalExample() {
  const [step, setStep] = useState(0);

  return <StepIndicator orientation="vertical" count={5} value={step} onValueChange={setStep} />;
}
