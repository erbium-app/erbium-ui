import {
  Stepper,
  StepperContent,
  StepperDescription,
  StepperIndicator,
  StepperItem,
  StepperList,
  StepperNext,
  StepperPanel,
  StepperPrevious,
  StepperText,
  StepperTitle,
  StepperTrigger,
} from "@erbium/ui/components/stepper";

const steps = [
  { description: "Connect the repository", id: "source", title: "Source" },
  { description: "Pick a build command", id: "build", title: "Build" },
  { description: "Choose where it runs", id: "deploy", title: "Deploy" },
];

// Each step's content sits under it. The content's start border is the connector.
export default function StepperVerticalExample() {
  return (
    <Stepper steps={steps} orientation="vertical" className="max-w-sm">
      <StepperList aria-label="New project">
        {steps.map((step) => (
          <StepperItem key={step.id} value={step.id}>
            <StepperTrigger>
              <StepperIndicator />
              <StepperText>
                <StepperTitle>{step.title}</StepperTitle>
                <StepperDescription>{step.description}</StepperDescription>
              </StepperText>
            </StepperTrigger>
            <StepperContent>
              <StepperPanel value={step.id} className="flex flex-col gap-related pt-2">
                <p className="text-control-sm text-muted-foreground">{step.title} settings.</p>
                <div className="flex gap-related">
                  <StepperPrevious />
                  <StepperNext finishLabel="Deploy" />
                </div>
              </StepperPanel>
            </StepperContent>
          </StepperItem>
        ))}
      </StepperList>
    </Stepper>
  );
}
