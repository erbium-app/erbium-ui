import {
  NumberField,
  NumberFieldDecrement,
  NumberFieldGroup,
  NumberFieldIncrement,
  NumberFieldInput,
} from "@erbium/ui/components/number-field";

const Example = () => (
  <div className="flex w-56 flex-col gap-3">
    <NumberField defaultValue={1499.5} step={0.5} format={{ style: "currency", currency: "USD" }}>
      <NumberFieldGroup>
        <NumberFieldDecrement />
        <NumberFieldInput aria-label="Price" />
        <NumberFieldIncrement />
      </NumberFieldGroup>
    </NumberField>
    <NumberField defaultValue={0.25} step={0.05} min={0} max={1} format={{ style: "percent" }}>
      <NumberFieldGroup>
        <NumberFieldDecrement />
        <NumberFieldInput aria-label="Opacity" />
        <NumberFieldIncrement />
      </NumberFieldGroup>
    </NumberField>
    <NumberField defaultValue={1234567}>
      <span className="text-xs text-muted-foreground">Western grouping (en)</span>
      <NumberFieldGroup>
        <NumberFieldInput aria-label="Western grouping" className="text-start" />
      </NumberFieldGroup>
    </NumberField>
    <NumberField defaultValue={1234567} locale="en-IN">
      <span className="text-xs text-muted-foreground">Indian lakh grouping (en-IN)</span>
      <NumberFieldGroup>
        <NumberFieldInput aria-label="Indian lakh grouping" className="text-start" />
      </NumberFieldGroup>
    </NumberField>
  </div>
);

export default Example;
