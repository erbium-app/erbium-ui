import { Stepper } from "@erbium-ui/react/stepper";

const steps = [
  { id: "one", title: "One" },
  { id: "two", title: "Two" },
  { id: "three", title: "Three" },
];

// The primitive carries no styles. Its state is in `data-*` and ARIA attributes, so any classes
// can style it; these use Tailwind's attribute variants.
export default function StepperHeadlessExample() {
  return (
    <Stepper.Root steps={steps} className="flex flex-col gap-4">
      <Stepper.List aria-label="Plain steps" className="flex gap-2">
        {steps.map((step) => (
          <Stepper.Item key={step.id} value={step.id}>
            <Stepper.Trigger className="rounded-full border border-dashed px-3 py-1 aria-disabled:opacity-40 data-[status=complete]:border-solid data-[status=complete]:bg-foreground data-[status=complete]:text-background data-[status=current]:border-solid">
              <Stepper.Title>{step.title}</Stepper.Title>
            </Stepper.Trigger>
          </Stepper.Item>
        ))}
      </Stepper.List>
      {steps.map((step) => (
        <Stepper.Panel key={step.id} value={step.id}>
          Panel {step.title}
        </Stepper.Panel>
      ))}
      <div className="flex gap-2">
        <Stepper.Previous className="rounded-md border px-3 py-1 aria-disabled:opacity-40">
          Back
        </Stepper.Previous>
        <Stepper.Next className="rounded-md border px-3 py-1 aria-busy:cursor-progress aria-disabled:opacity-40">
          Next
        </Stepper.Next>
      </div>
      <Stepper.Announcer />
    </Stepper.Root>
  );
}
