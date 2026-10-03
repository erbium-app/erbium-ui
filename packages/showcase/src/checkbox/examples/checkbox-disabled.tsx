import { Checkbox } from "@erbium/ui/components/checkbox";
import { Field, FieldLabel } from "@erbium/ui/components/field";

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
