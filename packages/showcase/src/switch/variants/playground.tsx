import { Field, FieldLabel } from "@erbium/ui/components/field";
import { Switch } from "@erbium/ui/components/switch";
import type * as React from "react";

const Example = (args: React.ComponentProps<typeof Switch>) => (
  <Field orientation="horizontal">
    <Switch key={String(args.defaultChecked)} id="playground-switch" {...args} />
    <FieldLabel htmlFor="playground-switch">Airplane mode</FieldLabel>
  </Field>
);

export default Example;
