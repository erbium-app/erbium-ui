import {
  NumberField,
  NumberFieldDecrement,
  NumberFieldGroup,
  NumberFieldIncrement,
  NumberFieldInput,
} from "@erbium/ui/components/number-field";

export default function NumberFieldSizesExample() {
  return (
    <div className="flex w-48 flex-col gap-related">
      {(["sm", "default", "lg"] as const).map((size) => (
        <NumberField key={size} size={size} defaultValue={8}>
          <NumberFieldGroup>
            <NumberFieldDecrement />
            <NumberFieldInput aria-label={`Size ${size}`} />
            <NumberFieldIncrement />
          </NumberFieldGroup>
        </NumberField>
      ))}
    </div>
  );
}
