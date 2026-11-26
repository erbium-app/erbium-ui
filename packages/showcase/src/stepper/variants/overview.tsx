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
  { id: "plan", title: "Plan", body: "Pick the plan that fits your team." },
  { id: "workspace", title: "Workspace", body: "Name the workspace and choose its region." },
  { id: "invite", title: "Invite", body: "Invite the people you work with." },
];

export default function StepperExample() {
  return (
    <Stepper steps={steps} className="max-w-lg">
      <StepperList aria-label="Setup">
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
        <StepperPanel key={step.id} value={step.id} className="text-control text-muted-foreground">
          {step.body}
        </StepperPanel>
      ))}
      <StepperActions>
        <StepperPrevious />
        <StepperNext />
      </StepperActions>
    </Stepper>
  );
}
