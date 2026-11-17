import { Icon } from "@erbium/ui/components/icon";

import { InputGroup, InputGroupAddon, InputGroupInput } from "@erbium/ui/components/input-group";
import { Kbd } from "@erbium/ui/components/kbd";

export default function KbdInputGroupExample() {
  return (
    <div className="flex w-full max-w-xs flex-col gap-section">
      <InputGroup>
        <InputGroupInput placeholder="Search..." />
        <InputGroupAddon>
          <Icon name="search-01" />
        </InputGroupAddon>
        <InputGroupAddon align="inline-end">
          <Kbd hotkey="Mod+K" />
        </InputGroupAddon>
      </InputGroup>
    </div>
  );
}
