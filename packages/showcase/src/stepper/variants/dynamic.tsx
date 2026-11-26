import { useState } from "react";
import { Field, FieldLabel } from "@erbium/ui/components/field";
import { Switch } from "@erbium/ui/components/switch";
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

export default function StepperDynamicExample() {
  const [business, setBusiness] = useState(false);

  // A step that only applies to some answers is disabled, not removed, so its status survives
  // when it comes back. The last step reviews the others and opens only once they are done.
  const steps = [
    { id: "account", title: "Account" },
    { disabled: !business, id: "company", title: "Company" },
    { id: "review", review: true, title: "Review" },
  ];

  return (
    <Stepper steps={steps} className="max-w-lg">
      <StepperList aria-label="Sign up">
        {steps.flatMap((step) =>
          step.disabled === true
            ? []
            : [
                <StepperItem key={step.id} value={step.id}>
                  <StepperTrigger>
                    <StepperIndicator />
                    <StepperText>
                      <StepperTitle>{step.title}</StepperTitle>
                    </StepperText>
                  </StepperTrigger>
                  <StepperSeparator />
                </StepperItem>,
              ],
        )}
      </StepperList>
      <StepperPanel value="account">
        <Field orientation="horizontal">
          <Switch checked={business} onCheckedChange={setBusiness} />
          <FieldLabel>This is a business account</FieldLabel>
        </Field>
      </StepperPanel>
      <StepperPanel value="company" className="text-control text-muted-foreground">
        Company details go here.
      </StepperPanel>
      <StepperPanel value="review" className="text-control text-muted-foreground">
        Everything looks good.
      </StepperPanel>
      <StepperActions>
        <StepperPrevious />
        <StepperNext finishLabel="Create account" />
      </StepperActions>
    </Stepper>
  );
}
