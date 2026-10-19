import { useState } from "react";
import { CopyButton } from "@erbium/ui/blocks/copy-button";
import { Icon } from "@erbium/ui/components/icon";
import { Separator } from "@erbium/ui/components/separator";

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
        <InputGroupAddon align="block-start" className="pb-2">
          <InputGroupText className="font-mono">
            <Icon name="file-code" />
            script.js
          </InputGroupText>
          <InputGroupButton className="ml-auto" size="icon-xs">
            <Icon name="refresh-ccw" />
          </InputGroupButton>
          <CopyButton
            value={code}
            aria-label="Copy script"
            render={<InputGroupButton size="icon-xs" />}
          />
        </InputGroupAddon>
        <Separator variant="full" />
        <InputGroupTextarea
          value={code}
          onChange={(event) => setCode(event.target.value)}
          id="textarea-code-32"
          placeholder="console.log('Hello, world!');"
          className="min-h-[200px]"
        />
        <Separator variant="full" />
        <InputGroupAddon align="block-end" className="pt-2">
          <InputGroupText>Line 1, Column 1</InputGroupText>
          <InputGroupButton size="sm" className="ml-auto" variant="default">
            Run <Icon name="corner-down-left" />
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
    </div>
  );
}
