import { HugeiconsIcon } from "@hugeicons/react";
import BoldIcon from "@hugeicons/core-free-icons/BoldIcon";
import ItalicIcon from "@hugeicons/core-free-icons/ItalicIcon";
import UnderlineIcon from "@hugeicons/core-free-icons/UnderlineIcon";

import { ToggleGroup, ToggleGroupItem } from "@erbium/ui/components/toggle-group";

export function ToggleGroupVertical() {
  return (
    <ToggleGroup multiple orientation="vertical" spacing={1} defaultValue={["bold", "italic"]}>
      <ToggleGroupItem value="bold" aria-label="Toggle bold">
        <HugeiconsIcon icon={BoldIcon} />
      </ToggleGroupItem>
      <ToggleGroupItem value="italic" aria-label="Toggle italic">
        <HugeiconsIcon icon={ItalicIcon} />
      </ToggleGroupItem>
      <ToggleGroupItem value="underline" aria-label="Toggle underline">
        <HugeiconsIcon icon={UnderlineIcon} />
      </ToggleGroupItem>
    </ToggleGroup>
  );
}
