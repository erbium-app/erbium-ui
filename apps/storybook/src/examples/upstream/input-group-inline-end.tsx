import { HugeiconsIcon } from "@hugeicons/react";
import EyeOffIcon from "@hugeicons/core-free-icons/EyeOffIcon";

import { Field, FieldDescription, FieldLabel } from "@erbium/ui/components/field";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@erbium/ui/components/input-group";

export function InputGroupInlineEnd() {
  return (
    <Field className="max-w-sm">
      <FieldLabel>Input</FieldLabel>
      <InputGroup>
        <InputGroupInput type="password" placeholder="Enter password" />
        <InputGroupAddon align="inline-end">
          <HugeiconsIcon icon={EyeOffIcon} />
        </InputGroupAddon>
      </InputGroup>
      <FieldDescription>Icon positioned at the end.</FieldDescription>
    </Field>
  );
}
