import { Icon } from "@erbium/ui/components/icon";

import { Field, FieldLabel } from "@erbium/ui/components/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from "@erbium/ui/components/input-group";

export function InputInputGroup() {
  return (
    <Field>
      <FieldLabel>Website URL</FieldLabel>
      <InputGroup>
        <InputGroupInput placeholder="example.com" />
        <InputGroupAddon>
          <InputGroupText>https://</InputGroupText>
        </InputGroupAddon>
        <InputGroupAddon align="inline-end">
          <Icon name="info" />
        </InputGroupAddon>
      </InputGroup>
    </Field>
  );
}
