import { Checkbox } from "@erbium/ui/components/checkbox";
import { Field, FieldContent, FieldDescription, FieldLabel } from "@erbium/ui/components/field";

export default function CheckboxDemo() {
  return (
    <div className="flex flex-col gap-section">
      <Field orientation="horizontal">
        <Checkbox />
        <FieldLabel>Accept terms and conditions</FieldLabel>
      </Field>
      <Field orientation="horizontal" className="items-start">
        <Checkbox defaultChecked />
        <FieldContent>
          <FieldLabel>Accept terms and conditions</FieldLabel>
          <FieldDescription>
            By clicking this checkbox, you agree to the terms and conditions.
          </FieldDescription>
        </FieldContent>
      </Field>
      <Field orientation="horizontal" disabled>
        <Checkbox />
        <FieldLabel>Enable notifications</FieldLabel>
      </Field>
      <Field variant="card" orientation="horizontal">
        <Checkbox defaultChecked />
        <FieldContent>
          <FieldLabel>Enable notifications</FieldLabel>
          <FieldDescription>You can enable or disable notifications at any time.</FieldDescription>
        </FieldContent>
      </Field>
    </div>
  );
}
