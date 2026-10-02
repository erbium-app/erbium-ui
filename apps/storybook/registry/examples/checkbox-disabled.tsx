// @ts-nocheck
import { Checkbox } from "../components/checkbox";
import { Field, FieldLabel } from "../components/field";

export default function CheckboxDisabled() {
  return (
    <div className="flex flex-col gap-4">
      <Field orientation="horizontal">
        <Checkbox disabled />
        <FieldLabel>Accept terms and conditions</FieldLabel>
      </Field>
      <Field orientation="horizontal">
        <Checkbox disabled defaultChecked />
        <FieldLabel>Enable notifications</FieldLabel>
      </Field>
      <Field orientation="horizontal">
        <Checkbox disabled indeterminate />
        <FieldLabel>Sync some folders</FieldLabel>
      </Field>
    </div>
  );
}
