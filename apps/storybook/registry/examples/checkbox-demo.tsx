// @ts-nocheck
import { Checkbox } from "../components/checkbox";
import { Field, FieldContent, FieldDescription, FieldLabel } from "../components/field";

export default function CheckboxDemo() {
  return (
    <div className="flex flex-col gap-6">
      <Field orientation="horizontal">
        <Checkbox id="terms" />
        <FieldLabel htmlFor="terms">Accept terms and conditions</FieldLabel>
      </Field>
      <Field orientation="horizontal" className="items-start">
        <Checkbox id="terms-2" defaultChecked />
        <FieldContent>
          <FieldLabel htmlFor="terms-2">Accept terms and conditions</FieldLabel>
          <FieldDescription>
            By clicking this checkbox, you agree to the terms and conditions.
          </FieldDescription>
        </FieldContent>
      </Field>
      <Field orientation="horizontal" disabled>
        <Checkbox id="toggle" />
        <FieldLabel htmlFor="toggle">Enable notifications</FieldLabel>
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
