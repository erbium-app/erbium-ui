import { Icon } from "@erbium/ui/components/icon";

import { Toggle } from "@erbium/ui/components/toggle";

export function ToggleText() {
  return (
    <Toggle aria-label="Toggle italic">
      <Icon name="italic" />
      Italic
    </Toggle>
  );
}
