import { useState } from "react";
import { StepIndicator, StepIndicatorItem } from "@erbium/ui/blocks/step-indicator";

const steps = [
  { label: "Account", invalid: false, disabled: false },
  { label: "Profile", invalid: true, disabled: false },
  { label: "Billing", invalid: false, disabled: false },
  { label: "Review", invalid: false, disabled: true },
];

export default function Example() {
  const [step, setStep] = useState(2);
  return (
    <StepIndicator value={step} onValueChange={setStep}>
      {steps.map((item, index) => (
        <StepIndicatorItem
          key={item.label}
          index={index}
          label={item.label}
          invalid={item.invalid}
          disabled={item.disabled}
        />
      ))}
    </StepIndicator>
  );
}
