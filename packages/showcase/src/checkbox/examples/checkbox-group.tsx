import { Checkbox, CheckboxGroup } from "@erbium/ui/components/checkbox";
import {
  FieldItem,
  FieldDescription,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@erbium/ui/components/field";

export default function CheckboxGroupFieldsetExample() {
  return (
    <FieldSet>
      <FieldLegend variant="label">Show these items on the desktop:</FieldLegend>
      <FieldDescription>Select the items you want to show on the desktop.</FieldDescription>
      <CheckboxGroup defaultValue={["hard-disks", "external-disks"]}>
        <FieldItem orientation="horizontal">
          <Checkbox name="desktop-items" value="hard-disks" />
          <FieldLabel className="font-normal">Hard disks</FieldLabel>
        </FieldItem>
        <FieldItem orientation="horizontal">
          <Checkbox name="desktop-items" value="external-disks" />
          <FieldLabel className="font-normal">External disks</FieldLabel>
        </FieldItem>
        <FieldItem orientation="horizontal">
          <Checkbox name="desktop-items" value="cds-dvds" />
          <FieldLabel className="font-normal">CDs, DVDs, and iPods</FieldLabel>
        </FieldItem>
        <FieldItem orientation="horizontal">
          <Checkbox name="desktop-items" value="connected-servers" />
          <FieldLabel className="font-normal">Connected servers</FieldLabel>
        </FieldItem>
      </CheckboxGroup>
    </FieldSet>
  );
}
