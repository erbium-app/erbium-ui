import { HugeiconsIcon } from "@hugeicons/react";
import InfoIcon from "@hugeicons/core-free-icons/InfoIcon";

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
          <HugeiconsIcon icon={InfoIcon} />
        </InputGroupAddon>
      </InputGroup>
    </Field>
  );
}
