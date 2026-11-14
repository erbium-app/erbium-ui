import { Field, FieldLabel } from "@erbium/ui/components/field";
import { Checkbox } from "@erbium/ui/components/checkbox";
import type * as React from "react";

const Example = (args: React.ComponentProps<typeof Checkbox>) => (
  <Field orientation="horizontal" required={args.required}>
    <Checkbox key={String(args.defaultChecked)} {...args} id="playground-checkbox" />
    <FieldLabel htmlFor="playground-checkbox">Accept terms</FieldLabel>
  </Field>
);

export default Example;
