import { HugeiconsIcon } from "@hugeicons/react";
import CopyIcon from "@hugeicons/core-free-icons/CopyIcon";
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
  return (
    <div className="grid w-full max-w-md gap-4">
      <InputGroup>
        <InputGroupTextarea
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
          <InputGroupButton variant="ghost" size="icon-xs">
            <HugeiconsIcon icon={CopyIcon} />
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
    </div>
  );
}
