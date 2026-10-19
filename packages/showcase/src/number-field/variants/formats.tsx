import {
  NumberField,
  NumberFieldDecrement,
  NumberFieldGroup,
  NumberFieldIncrement,
  NumberFieldInput,
} from "@erbium/ui/components/number-field";

const Example = () => (
  <div className="flex w-56 flex-col gap-related">
    <NumberField defaultValue={1499.5} step={0.5} format={{ currency: "USD", style: "currency" }}>
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
    <NumberField defaultValue={1_234_567}>
      <span className="text-metadata text-muted-foreground">Western grouping (en)</span>
      <NumberFieldGroup>
        <NumberFieldInput aria-label="Western grouping" className="text-start" />
      </NumberFieldGroup>
    </NumberField>
    <NumberField defaultValue={1_234_567} locale="en-IN">
      <span className="text-metadata text-muted-foreground">Indian lakh grouping (en-IN)</span>
      <NumberFieldGroup>
        <NumberFieldInput aria-label="Indian lakh grouping" className="text-start" />
      </NumberFieldGroup>
    </NumberField>
  </div>
);

export default Example;
