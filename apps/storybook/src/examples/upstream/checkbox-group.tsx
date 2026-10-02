import { Checkbox, CheckboxGroup } from "@erbium/ui/components/checkbox";
import {
  Field,
  FieldDescription,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@erbium/ui/components/field";

export function CheckboxGroupFieldset() {
  return (
    <FieldSet>
      <FieldLegend variant="label">Show these items on the desktop:</FieldLegend>
      <FieldDescription>Select the items you want to show on the desktop.</FieldDescription>
      <CheckboxGroup defaultValue={["hard-disks", "external-disks"]}>
        <Field orientation="horizontal">
          <Checkbox name="desktop-items" value="hard-disks" />
          <FieldLabel className="font-normal">Hard disks</FieldLabel>
        </Field>
        <Field orientation="horizontal">
          <Checkbox name="desktop-items" value="external-disks" />
          <FieldLabel className="font-normal">External disks</FieldLabel>
        </Field>
        <Field orientation="horizontal">
          <Checkbox name="desktop-items" value="cds-dvds" />
          <FieldLabel className="font-normal">CDs, DVDs, and iPods</FieldLabel>
        </Field>
        <Field orientation="horizontal">
          <Checkbox name="desktop-items" value="connected-servers" />
          <FieldLabel className="font-normal">Connected servers</FieldLabel>
        </Field>
      </CheckboxGroup>
    </FieldSet>
  );
}
