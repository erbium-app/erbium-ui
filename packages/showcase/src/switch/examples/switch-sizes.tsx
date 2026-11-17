import { Field, FieldGroup, FieldLabel } from "@erbium/ui/components/field";
import { Switch } from "@erbium/ui/components/switch";

export default function SwitchSizesExample() {
  return (
    <FieldGroup className="w-full max-w-[10rem]">
      <Field orientation="horizontal">
        <Switch size="sm" />
        <FieldLabel>Small</FieldLabel>
      </Field>
      <Field orientation="horizontal">
        <Switch size="default" />
        <FieldLabel>Default</FieldLabel>
      </Field>
    </FieldGroup>
  );
}
