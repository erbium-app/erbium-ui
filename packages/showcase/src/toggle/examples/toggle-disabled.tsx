import { Icon } from "@erbium/ui/components/icon";

import { Toggle } from "@erbium/ui/components/toggle";

const ToggleDisabled = () => (
  <Toggle aria-label="Toggle italic" disabled>
    <Icon name="underline" className="h-4 w-4" />
  </Toggle>
);

export default ToggleDisabled;
