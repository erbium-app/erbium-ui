import { Field } from "@erbium/ui/components/field";
import {
  NumberField,
  NumberFieldGroup,
  NumberFieldInput,
  NumberFieldIncrement,
  NumberFieldDecrement,
  NumberFieldScrubArea,
} from "@erbium/ui/components/number-field";

const Demo = () => (
  <Field>
    <NumberField defaultValue={24} min={0} max={200} className="w-48">
      <NumberFieldScrubArea label="Font size" />
      <NumberFieldGroup>
        <NumberFieldDecrement />
        <NumberFieldInput />
        <NumberFieldIncrement />
      </NumberFieldGroup>
    </NumberField>
  </Field>
);

export default Demo;
