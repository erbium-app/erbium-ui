import { Field, FieldLabel } from "@erbium/ui/components/field";
import { Slider } from "@erbium/ui/components/slider";

const Example = () => (
  <div className="mx-auto flex w-full max-w-xs flex-col gap-section">
    <Field className="gap-related">
      <FieldLabel>Push, at least 10 apart</FieldLabel>
      <Slider defaultValue={[30, 60]} minStepsBetweenValues={10} />
    </Field>
    <Field className="gap-related">
      <FieldLabel>Swap</FieldLabel>
      <Slider defaultValue={[30, 60]} thumbCollisionBehavior="swap" />
    </Field>
    <Field className="gap-related">
      <FieldLabel>Stop at the neighbour</FieldLabel>
      <Slider defaultValue={[30, 60]} thumbCollisionBehavior="none" />
    </Field>
  </div>
);

export default Example;
