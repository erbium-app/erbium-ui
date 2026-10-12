import { Icon } from "@erbium/ui/components/icon";

import { Field, FieldDescription, FieldLabel } from "@erbium/ui/components/field";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@erbium/ui/components/input-group";

export function InputGroupInlineEnd() {
  return (
    <Field className="max-w-sm">
      <FieldLabel>Input</FieldLabel>
      <InputGroup>
        <InputGroupInput type="password" placeholder="Enter password" />
        <InputGroupAddon align="inline-end">
          <Icon name="eye-off" />
        </InputGroupAddon>
      </InputGroup>
      <FieldDescription>Icon positioned at the end.</FieldDescription>
    </Field>
  );
}
