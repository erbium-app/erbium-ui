import { useState } from "react";
import { CopyButton } from "@erbium/ui/blocks/copy-button";
import { Icon } from "@erbium/ui/components/icon";

import { Field, FieldDescription, FieldGroup, FieldLabel } from "@erbium/ui/components/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
  InputGroupTextarea,
} from "@erbium/ui/components/input-group";

export const InputGroupBlockStart = () => {
  const [code, setCode] = useState("console.log('Hello, world!');");

  return (
    <FieldGroup className="max-w-sm">
      <Field>
        <FieldLabel>Input</FieldLabel>
        <InputGroup className="h-auto">
          <InputGroupInput placeholder="Enter your name" />
          <InputGroupAddon align="block-start">
            <InputGroupText>Full Name</InputGroupText>
          </InputGroupAddon>
        </InputGroup>
        <FieldDescription>Header positioned above the input.</FieldDescription>
      </Field>
      <Field>
        <FieldLabel>Textarea</FieldLabel>
        <InputGroup>
          <InputGroupTextarea
            value={code}
            onChange={(event) => {
              setCode(event.target.value);
            }}
            placeholder="console.log('Hello, world!');"
            className="font-mono text-caption"
          />
          <InputGroupAddon align="block-start">
            <Icon name="file-code" className="text-muted-foreground" />
            <InputGroupText className="font-mono">script.js</InputGroupText>
            <CopyButton
              value={code}
              aria-label="Copy script"
              render={<InputGroupButton variant="embedded" size="icon-xs" className="ml-auto" />}
            />
          </InputGroupAddon>
        </InputGroup>
        <FieldDescription>Header positioned above the textarea.</FieldDescription>
      </Field>
    </FieldGroup>
  );
};
