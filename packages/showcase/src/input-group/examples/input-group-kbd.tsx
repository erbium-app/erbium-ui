import { Icon } from "@erbium/ui/components/icon";

import { InputGroup, InputGroupAddon, InputGroupInput } from "@erbium/ui/components/input-group";
import { Kbd } from "@erbium/ui/components/kbd";

export default function InputGroupKbdExample() {
  return (
    <InputGroup className="max-w-sm">
      <InputGroupInput placeholder="Search..." />
      <InputGroupAddon>
        <Icon name="search-01" className="text-muted-foreground" />
      </InputGroupAddon>
      <InputGroupAddon align="inline-end">
        <Kbd hotkey="Mod+K" />
      </InputGroupAddon>
    </InputGroup>
  );
}
