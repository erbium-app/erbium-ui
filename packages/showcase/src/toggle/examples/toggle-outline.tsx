import { Icon } from "@erbium/ui/components/icon";

import { Toggle } from "@erbium/ui/components/toggle";

export default function ToggleOutlineExample() {
  return (
    <Toggle variant="outline" aria-label="Toggle italic">
      <Icon name="italic" />
    </Toggle>
  );
}
