import {
  Stepper,
  StepperActions,
  StepperDots,
  StepperNext,
  StepperPanel,
  StepperPrevious,
} from "@erbium/ui/components/stepper";

const steps = [
  { id: "welcome", title: "Welcome", body: "A short tour of your new workspace." },
  { id: "projects", title: "Projects", body: "Projects hold your files and the people on them." },
  { id: "search", title: "Search", body: "Search finds any file, comment or person." },
  { id: "sharing", title: "Sharing", body: "Share a link to bring anyone into a project." },
  { id: "done", title: "Done", body: "You are ready to start your first project." },
];

const titles = new Map(steps.map((step) => [step.id, step.title]));

export default function StepperDotsExample() {
  return (
    <Stepper steps={steps} className="max-w-xs items-center">
      <StepperDots aria-label="Tour" label={(step) => titles.get(step.id) ?? step.id} />
      {steps.map((step) => (
        <StepperPanel
          key={step.id}
          value={step.id}
          className="min-h-12 text-center text-control text-pretty"
        >
          {step.body}
        </StepperPanel>
      ))}
      <StepperActions className="w-full">
        <StepperPrevious />
        <StepperNext finishLabel="Start" />
      </StepperActions>
    </Stepper>
  );
}
