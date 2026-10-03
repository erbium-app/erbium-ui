import { HugeiconsIcon } from "@hugeicons/react";
import ItalicIcon from "@hugeicons/core-free-icons/ItalicIcon";

import { Toggle } from "@erbium/ui/components/toggle";

export function ToggleText() {
  return (
    <Toggle aria-label="Toggle italic">
      <HugeiconsIcon icon={ItalicIcon} />
      Italic
    </Toggle>
  );
}
