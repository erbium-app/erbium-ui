import { Field, FieldLabel } from "@erbium/ui/components/field";
import { Slider } from "@erbium/ui/components/slider";

const MARKS = [
  { label: "0%", value: 0 },
  { label: "25%", value: 25 },
  { label: "50%", value: 50 },
  { label: "75%", value: 75 },
  { label: "100%", value: 100 },
];

const Example = () => (
  <div className="mx-auto flex w-full max-w-xs flex-col gap-section">
    <Field className="gap-related">
      <FieldLabel>Opacity</FieldLabel>
      <Slider defaultValue={75} step={25} marks={MARKS} />
    </Field>
    <Field className="gap-related">
      <FieldLabel>Brightness</FieldLabel>
      <Slider defaultValue={4} min={0} max={10} marks />
    </Field>
  </div>
);

export default Example;
