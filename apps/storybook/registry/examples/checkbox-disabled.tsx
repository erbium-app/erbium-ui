// @ts-nocheck
import { Checkbox } from "../components/checkbox";
import { Field, FieldLabel } from "../components/field";

export default function CheckboxDisabled() {
  return (
    <div className="flex flex-col gap-4">
      <Field orientation="horizontal">
        <Checkbox id="disabled-unchecked" disabled />
        <FieldLabel htmlFor="disabled-unchecked">Accept terms and conditions</FieldLabel>
      </Field>
      <Field orientation="horizontal">
        <Checkbox id="disabled-checked" disabled defaultChecked />
        <FieldLabel htmlFor="disabled-checked">Enable notifications</FieldLabel>
      </Field>
      <Field orientation="horizontal">
        <Checkbox id="disabled-indeterminate" disabled indeterminate />
        <FieldLabel htmlFor="disabled-indeterminate">Sync some folders</FieldLabel>
      </Field>
    </div>
  );
}
