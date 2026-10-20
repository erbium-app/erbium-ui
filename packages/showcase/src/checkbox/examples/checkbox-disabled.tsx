import { Checkbox } from "@erbium/ui/components/checkbox";
import { Field, FieldLabel } from "@erbium/ui/components/field";

const CheckboxDisabled = () => (
  <div className="flex flex-col gap-group">
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

export default CheckboxDisabled;
