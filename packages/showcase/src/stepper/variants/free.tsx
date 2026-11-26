import { useState } from "react";
import { Checkbox } from "@erbium/ui/components/checkbox";
import { Field, FieldLabel } from "@erbium/ui/components/field";
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
  { id: "general", title: "General" },
  { id: "privacy", title: "Privacy" },
  { id: "billing", title: "Billing" },
];

// Free navigation: any step can be opened. Leaving a step forward still checks it, and with
// leaveInvalid="allow" an unchecked step is marked but does not hold the user back. Finishing
// still needs every step valid.
export default function StepperFreeExample() {
  const [accepted, setAccepted] = useState<Record<string, boolean>>({});
  const guard: StepperGuard = ({ step }) => accepted[step];

  return (
    <Stepper
      steps={steps}
      navigation="free"
      leaveInvalid="allow"
      guard={guard}
      className="max-w-lg"
    >
      <StepperList aria-label="Settings">
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
      {steps.map((step) => (
        <StepperPanel key={step.id} value={step.id}>
          <Field orientation="horizontal">
            <Checkbox
              checked={accepted[step.id]}
              onCheckedChange={(checked) => {
                setAccepted((current) => ({ ...current, [step.id]: checked }));
              }}
            />
            <FieldLabel>{step.title} settings reviewed</FieldLabel>
          </Field>
        </StepperPanel>
      ))}
      <StepperActions>
        <StepperPrevious />
        <StepperNext />
      </StepperActions>
    </Stepper>
  );
}
