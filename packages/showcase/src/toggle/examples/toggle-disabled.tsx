import { HugeiconsIcon } from "@hugeicons/react";
import UnderlineIcon from "@hugeicons/core-free-icons/UnderlineIcon";

import { Toggle } from "@erbium/ui/components/toggle";

export default function ToggleDisabled() {
  return (
    <Toggle aria-label="Toggle italic" disabled>
      <HugeiconsIcon icon={UnderlineIcon} className="h-4 w-4" />
    </Toggle>
  );
}
