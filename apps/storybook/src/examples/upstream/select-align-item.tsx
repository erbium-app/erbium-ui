import * as React from "react";

import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@erbium/ui/components/field";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@erbium/ui/components/select";
import { Switch } from "@erbium/ui/components/switch";

const items = [
  { label: "Select a fruit", value: null },
  { label: "Apple", value: "apple" },
  { label: "Banana", value: "banana" },
  { label: "Blueberry", value: "blueberry" },
  { label: "Grapes", value: "grapes" },
  { label: "Pineapple", value: "pineapple" },
];

export function SelectAlignItem() {
  const [alignItemWithTrigger, setAlignItemWithTrigger] = React.useState(true);

  return (
    <FieldGroup className="w-full max-w-xs">
      <Field orientation="horizontal">
        <FieldContent>
          <FieldLabel>Align Item</FieldLabel>
          <FieldDescription>Toggle to align the item with the trigger.</FieldDescription>
        </FieldContent>
        <Switch checked={alignItemWithTrigger} onCheckedChange={setAlignItemWithTrigger} />
      </Field>
      <Field>
        <Select items={items} defaultValue="banana">
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent alignItemWithTrigger={alignItemWithTrigger}>
            <SelectGroup>
              {items.map((item) => (
                <SelectItem key={item.value} value={item.value}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </Field>
    </FieldGroup>
  );
}
