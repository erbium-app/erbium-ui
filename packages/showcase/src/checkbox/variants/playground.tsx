import { Field, FieldLabel } from "@erbium/ui/components/field";
import { Checkbox } from "@erbium/ui/components/checkbox";
import type * as React from "react";

export const defaultProps = {
  defaultChecked: false,
  disabled: false,
  indeterminate: false,
  readOnly: false,
  required: false,
} satisfies React.ComponentProps<typeof Checkbox>;

export default function CheckboxPlaygroundExample(
  args: React.ComponentProps<typeof Checkbox> = defaultProps,
) {
  return (
    <Field orientation="horizontal" required={args.required}>
      <Checkbox key={String(args.defaultChecked)} {...args} id="playground-checkbox" />
      <FieldLabel htmlFor="playground-checkbox">Accept terms</FieldLabel>
    </Field>
  );
}
