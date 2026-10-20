import { Field, FieldLabel } from "@erbium/ui/components/field";
import { Switch } from "@erbium/ui/components/switch";
import { Icon } from "@erbium/ui/components/icon";

const SwitchIcons = () => (
  <div className="flex flex-col gap-group">
    <Field orientation="horizontal">
      <Switch startIcon={<Icon name="check" />} endIcon={<Icon name="x" />} defaultChecked />
      <FieldLabel>Track icons</FieldLabel>
    </Field>
    <Field orientation="horizontal">
      <Switch thumbIcon={<Icon name="sun-01" />} />
      <FieldLabel>Thumb icon</FieldLabel>
    </Field>
    <Field orientation="horizontal">
      <Switch startIcon={<Icon name="moon" />} endIcon={<Icon name="sun-01" />} />
      <FieldLabel>Dark mode</FieldLabel>
    </Field>
  </div>
);

export default SwitchIcons;
