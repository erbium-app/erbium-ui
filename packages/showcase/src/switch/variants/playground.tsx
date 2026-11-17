import { Field, FieldLabel } from "@erbium/ui/components/field";
import { Switch } from "@erbium/ui/components/switch";
import type * as React from "react";

export const defaultProps = {
  defaultChecked: false,
  disabled: false,
  readOnly: false,
  required: false,
  size: "default",
} satisfies React.ComponentProps<typeof Switch>;

export default function SwitchPlaygroundExample(
  args: React.ComponentProps<typeof Switch> = defaultProps,
) {
  return (
    <Field orientation="horizontal" required={args.required}>
      <Switch key={String(args.defaultChecked)} id="playground-switch" {...args} />
      <FieldLabel htmlFor="playground-switch">Airplane mode</FieldLabel>
    </Field>
  );
}
