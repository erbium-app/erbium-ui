// @ts-nocheck
import { HugeiconsIcon } from "@hugeicons/react";
import Bookmark01Icon from "@hugeicons/core-free-icons/Bookmark01Icon";

import { Toggle } from "../components/toggle";

export default function ToggleDemo() {
  return (
    <Toggle
      aria-label="Toggle bookmark"
      size="sm"
      variant="outline"
      className="data-[state=on]:bg-transparent data-[state=on]:*:[svg]:fill-info data-[state=on]:*:[svg]:stroke-info"
    >
      <HugeiconsIcon icon={Bookmark01Icon} />
      Bookmark
    </Toggle>
  );
}
