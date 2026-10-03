import {
  NumberField,
  NumberFieldDecrement,
  NumberFieldGroup,
  NumberFieldIncrement,
  NumberFieldInput,
} from "@erbium/ui/components/number-field";

const Example = () => (
  <NumberField defaultValue={1200} className="w-48">
    <NumberFieldGroup>
      <NumberFieldDecrement />
      <NumberFieldInput aria-label="Quantity" />
      <NumberFieldIncrement />
    </NumberFieldGroup>
  </NumberField>
);

export default Example;
