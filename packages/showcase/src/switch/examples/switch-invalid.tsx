import { Field, FieldContent, FieldDescription, FieldLabel } from "@erbium/ui/components/field";
import { Switch } from "@erbium/ui/components/switch";

export const SwitchInvalid = () => (
  <Field orientation="horizontal" className="max-w-sm" invalid>
    <FieldContent>
      <FieldLabel>Accept terms and conditions</FieldLabel>
      <FieldDescription>You must accept the terms and conditions to continue.</FieldDescription>
    </FieldContent>
    <Switch />
  </Field>
);
