import { useState } from "react";
import { StepIndicator, StepIndicatorItem } from "@erbium/ui/blocks/step-indicator";

const steps = [
  { disabled: false, invalid: false, label: "Account" },
  { disabled: false, invalid: true, label: "Profile" },
  { disabled: false, invalid: false, label: "Billing" },
  { disabled: true, invalid: false, label: "Review" },
];

export default function StepIndicatorStatusExample() {
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
