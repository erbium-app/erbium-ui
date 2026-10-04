import { useState } from "react";
import { CopyButton } from "@erbium/ui/blocks/copy-button";
import { HugeiconsIcon } from "@hugeicons/react";
import FileCodeIcon from "@hugeicons/core-free-icons/FileCodeIcon";

import { Field, FieldDescription, FieldGroup, FieldLabel } from "@erbium/ui/components/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
  InputGroupTextarea,
} from "@erbium/ui/components/input-group";

export function InputGroupBlockStart() {
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
            onChange={(event) => setCode(event.target.value)}
            placeholder="console.log('Hello, world!');"
            className="font-mono text-sm"
          />
          <InputGroupAddon align="block-start">
            <HugeiconsIcon icon={FileCodeIcon} className="text-muted-foreground" />
            <InputGroupText className="font-mono">script.js</InputGroupText>
            <CopyButton
              value={code}
              aria-label="Copy script"
              render={<InputGroupButton size="icon-xs" className="ml-auto" />}
            />
          </InputGroupAddon>
        </InputGroup>
        <FieldDescription>Header positioned above the textarea.</FieldDescription>
      </Field>
    </FieldGroup>
  );
}
