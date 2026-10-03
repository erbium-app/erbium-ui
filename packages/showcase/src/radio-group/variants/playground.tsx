import { Field, FieldLabel } from "@erbium/ui/components/field";
import { RadioGroup, RadioGroupItem } from "@erbium/ui/components/radio-group";
import type * as React from "react";

const Example = (args: React.ComponentProps<typeof RadioGroup>) => (
  <RadioGroup key={String(args.defaultValue)} {...args}>
    {["one", "two", "three"].map((value) => (
      <Field orientation="horizontal" key={value}>
        <RadioGroupItem value={value} id={`playground-${value}`} />
        <FieldLabel htmlFor={`playground-${value}`}>Option {value}</FieldLabel>
      </Field>
    ))}
  </RadioGroup>
);

export default Example;
