import { Field, FieldContent, FieldDescription, FieldLabel } from "@erbium/ui/components/field";
import { Switch } from "@erbium/ui/components/switch";

const FieldSwitch = () => (
  <div className="w-full max-w-md">
    <Field orientation="horizontal">
      <FieldContent>
        <FieldLabel>Multi-factor authentication</FieldLabel>
        <FieldDescription>
          Enable multi-factor authentication. If you do not have a two-factor device, you can use a
          one-time code sent to your email.
        </FieldDescription>
      </FieldContent>
      <Switch />
    </Field>
  </div>
);

export default FieldSwitch;
