import { Icon } from "@erbium/ui/components/icon";

import { Field, FieldDescription, FieldLabel } from "@erbium/ui/components/field";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@erbium/ui/components/input-group";

export default function InputGroupInlineEndExample() {
  return (
    <Field className="max-w-sm">
      <FieldLabel>Input</FieldLabel>
      <InputGroup>
        <InputGroupInput type="email" placeholder="Enter email" />
        <InputGroupAddon align="inline-end">
          <Icon name="mail-01" />
        </InputGroupAddon>
      </InputGroup>
      <FieldDescription>Icon positioned at the end.</FieldDescription>
    </Field>
  );
}
