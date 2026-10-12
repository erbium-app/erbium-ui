import { useState } from "react";
import { CopyButton } from "@erbium/ui/blocks/copy-button";
import { Icon } from "@erbium/ui/components/icon";

import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupText,
  InputGroupTextarea,
} from "@erbium/ui/components/input-group";

export default function InputGroupTextareaExample() {
  const [code, setCode] = useState("console.log('Hello, world!');");
  return (
    <div className="grid w-full max-w-md gap-group">
      <InputGroup>
        <InputGroupTextarea
          value={code}
          onChange={(event) => setCode(event.target.value)}
          id="textarea-code-32"
          placeholder="console.log('Hello, world!');"
          className="min-h-[200px]"
        />
        <InputGroupAddon align="block-end" className="border-t">
          <InputGroupText>Line 1, Column 1</InputGroupText>
          <InputGroupButton size="sm" className="ml-auto" variant="default">
            Run <Icon name="corner-down-left" />
          </InputGroupButton>
        </InputGroupAddon>
        <InputGroupAddon align="block-start" className="border-b">
          <InputGroupText className="font-mono font-medium">
            <Icon name="file-code" />
            script.js
          </InputGroupText>
          <InputGroupButton className="ml-auto" size="icon-xs">
            <Icon name="refresh-ccw" />
          </InputGroupButton>
          <CopyButton
            value={code}
            aria-label="Copy script"
            render={<InputGroupButton variant="ghost" size="icon-xs" />}
          />
        </InputGroupAddon>
      </InputGroup>
    </div>
  );
}
