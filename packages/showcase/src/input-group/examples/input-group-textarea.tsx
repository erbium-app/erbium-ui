import { useState } from "react";
import { CopyButton } from "@erbium/ui/blocks/copy-button";
import { HugeiconsIcon } from "@hugeicons/react";
import CornerDownLeftIcon from "@hugeicons/core-free-icons/CornerDownLeftIcon";
import FileCodeIcon from "@hugeicons/core-free-icons/FileCodeIcon";
import RefreshCcwIcon from "@hugeicons/core-free-icons/RefreshCcwIcon";

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
            Run <HugeiconsIcon icon={CornerDownLeftIcon} />
          </InputGroupButton>
        </InputGroupAddon>
        <InputGroupAddon align="block-start" className="border-b">
          <InputGroupText className="font-mono font-medium">
            <HugeiconsIcon icon={FileCodeIcon} />
            script.js
          </InputGroupText>
          <InputGroupButton className="ml-auto" size="icon-xs">
            <HugeiconsIcon icon={RefreshCcwIcon} />
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
