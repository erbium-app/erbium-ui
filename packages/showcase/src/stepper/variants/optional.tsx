import {
  Stepper,
  StepperActions,
  StepperIndicator,
  StepperItem,
  StepperList,
  StepperNext,
  StepperOptional,
  StepperPanel,
  StepperPrevious,
  StepperSeparator,
  StepperSkip,
  StepperText,
  StepperTitle,
  StepperTrigger,
} from "@erbium/ui/components/stepper";

// Required by default. An optional step shows Skip, and a skipped step reads differently from a
// completed one.
const steps = [
  { id: "profile", title: "Profile" },
  { id: "avatar", optional: true, title: "Avatar" },
  { id: "integrations", optional: true, title: "Integrations" },
  { id: "done", title: "Done" },
];

export default function StepperOptionalExample() {
  return (
    <Stepper steps={steps} className="max-w-xl">
      <StepperList aria-label="Onboarding">
        {steps.map((step) => (
          <StepperItem key={step.id} value={step.id}>
            <StepperTrigger>
              <StepperIndicator />
              <StepperText>
                <StepperTitle>{step.title}</StepperTitle>
                <StepperOptional />
              </StepperText>
            </StepperTrigger>
            <StepperSeparator />
          </StepperItem>
        ))}
      </StepperList>
      {steps.map((step) => (
        <StepperPanel key={step.id} value={step.id} className="text-control text-muted-foreground">
          {step.title} settings go here.
        </StepperPanel>
      ))}
      <StepperActions>
        <StepperPrevious />
        <StepperSkip />
        <StepperNext />
      </StepperActions>
    </Stepper>
  );
}
