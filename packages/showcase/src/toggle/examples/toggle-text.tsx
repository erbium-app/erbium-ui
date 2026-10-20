import { Icon } from "@erbium/ui/components/icon";

import { Toggle } from "@erbium/ui/components/toggle";

export const ToggleText = () => (
  <Toggle aria-label="Toggle italic">
    <Icon name="italic" />
    Italic
  </Toggle>
);
