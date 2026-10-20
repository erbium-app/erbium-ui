import { useState } from "react";
import { StepIndicator } from "@erbium/ui/blocks/step-indicator";

const Example = () => {
  const [step, setStep] = useState(0);

  return <StepIndicator orientation="vertical" count={5} value={step} onValueChange={setStep} />;
};

export default Example;
