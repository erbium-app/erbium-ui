import { Field, FieldLabel } from "@erbium/ui/components/field";
import { RadioGroup, RadioGroupItem } from "@erbium/ui/components/radio-group";
import type * as React from "react";

export const defaultProps = {
  defaultValue: "one",
  disabled: false,
  readOnly: false,
  required: false,
} satisfies React.ComponentProps<typeof RadioGroup>;

export default function RadioGroupPlaygroundExample(
  args: React.ComponentProps<typeof RadioGroup> = defaultProps,
) {
  return (
    <RadioGroup key={String(args.defaultValue)} {...args}>
      {["one", "two", "three"].map((value) => (
        <Field orientation="horizontal" key={value}>
          <RadioGroupItem value={value} id={`playground-${value}`} />
          <FieldLabel htmlFor={`playground-${value}`}>Option {value}</FieldLabel>
        </Field>
      ))}
    </RadioGroup>
  );
}
