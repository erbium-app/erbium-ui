import { ItalicIcon } from "lucide-react";

import { Toggle } from "@erbium/ui/components/toggle";

export function ToggleText() {
  return (
    <Toggle aria-label="Toggle italic">
      <ItalicIcon />
      Italic
    </Toggle>
  );
}
