import { HugeiconsIcon } from "@hugeicons/react";
import BoldIcon from "@hugeicons/core-free-icons/BoldIcon";
import ItalicIcon from "@hugeicons/core-free-icons/ItalicIcon";
import UnderlineIcon from "@hugeicons/core-free-icons/UnderlineIcon";

import { ToggleGroup, ToggleGroupItem } from "@erbium/ui/components/toggle-group";

export default function ToggleGroupDemo() {
  return (
    <ToggleGroup variant="outline">
      <ToggleGroupItem value="bold" aria-label="Toggle bold">
        <HugeiconsIcon icon={BoldIcon} className="h-4 w-4" />
      </ToggleGroupItem>
      <ToggleGroupItem value="italic" aria-label="Toggle italic">
        <HugeiconsIcon icon={ItalicIcon} className="h-4 w-4" />
      </ToggleGroupItem>
      <ToggleGroupItem value="strikethrough" aria-label="Toggle strikethrough">
        <HugeiconsIcon icon={UnderlineIcon} className="h-4 w-4" />
      </ToggleGroupItem>
    </ToggleGroup>
  );
}
