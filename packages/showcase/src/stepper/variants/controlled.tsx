import { useState } from "react";
import { Button } from "@erbium/ui/components/button";
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

const steps = [
  { id: "cart", title: "Cart" },
  { id: "shipping", title: "Shipping" },
  { id: "payment", title: "Payment" },
];

// The value can live anywhere, such as a `?step=` search param. A value the flow cannot reach
// yet, like a deep link to payment, is refused: `onValueChange` answers with the step it is on.
export default function StepperControlledExample() {
  const [step, setStep] = useState("payment");
  const [log, setLog] = useState<string[]>([]);

  return (
    <div className="flex max-w-lg flex-col gap-section">
      <Stepper
        steps={steps}
        value={step}
        onValueChange={(next, details) => {
          setStep(next);
          setLog((entries) =>
            [`${details.from} → ${next} (${details.reason})`, ...entries].slice(0, 4),
          );
        }}
      >
        <StepperList aria-label="Checkout">
          {steps.map((item) => (
            <StepperItem key={item.id} value={item.id}>
              <StepperTrigger>
                <StepperIndicator />
                <StepperText>
                  <StepperTitle>{item.title}</StepperTitle>
                </StepperText>
              </StepperTrigger>
              <StepperSeparator />
            </StepperItem>
          ))}
        </StepperList>
        {steps.map((item) => (
          <StepperPanel
            key={item.id}
            value={item.id}
            className="text-control text-muted-foreground"
          >
            {item.title}
          </StepperPanel>
        ))}
        <StepperActions>
          <StepperPrevious />
          <StepperNext />
        </StepperActions>
      </Stepper>
      <div className="flex flex-col gap-related">
        <Button
          variant="outline"
          size="sm"
          className="self-start"
          onClick={() => {
            setStep("payment");
          }}
        >
          Deep link to payment
        </Button>
        <ul className="text-control-sm text-muted-foreground tabular-nums">
          {log.map((entry, index) => (
            // Entries repeat, and the newest is always first.
            // oxlint-disable-next-line react-doctor/no-array-index-as-key -- a short rolling log; position is its identity.
            <li key={index}>{entry}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
