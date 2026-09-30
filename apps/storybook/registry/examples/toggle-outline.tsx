// @ts-nocheck
import { HugeiconsIcon } from "@hugeicons/react";
import ItalicIcon from "@hugeicons/core-free-icons/ItalicIcon";

import { Toggle } from "../components/toggle";

export default function ToggleOutline() {
  return (
    <Toggle variant="outline" aria-label="Toggle italic">
      <HugeiconsIcon icon={ItalicIcon} />
    </Toggle>
  );
}
