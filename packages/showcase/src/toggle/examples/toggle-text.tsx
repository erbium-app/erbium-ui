import { Icon } from "@erbium/ui/components/icon";

import { Toggle } from "@erbium/ui/components/toggle";

export default function ToggleTextExample() {
  return (
    <Toggle aria-label="Toggle italic">
      <Icon name="italic" />
      Italic
    </Toggle>
  );
}
