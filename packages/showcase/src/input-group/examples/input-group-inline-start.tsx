import { Icon } from "@erbium/ui/components/icon";

import { Field, FieldDescription, FieldLabel } from "@erbium/ui/components/field";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@erbium/ui/components/input-group";

export const InputGroupInlineStart = () => (
  <Field className="max-w-sm">
    <FieldLabel>Input</FieldLabel>
    <InputGroup>
      <InputGroupInput placeholder="Search..." />
      <InputGroupAddon align="inline-start">
        <Icon name="search-01" className="text-muted-foreground" />
      </InputGroupAddon>
    </InputGroup>
    <FieldDescription>Icon positioned at the start.</FieldDescription>
  </Field>
);
