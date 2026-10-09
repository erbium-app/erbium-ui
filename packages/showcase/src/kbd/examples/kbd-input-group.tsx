import { HugeiconsIcon } from "@hugeicons/react";
import Search01Icon from "@hugeicons/core-free-icons/Search01Icon";

import { InputGroup, InputGroupAddon, InputGroupInput } from "@erbium/ui/components/input-group";
import { Kbd } from "@erbium/ui/components/kbd";

export default function KbdInputGroup() {
  return (
    <div className="flex w-full max-w-xs flex-col gap-section">
      <InputGroup>
        <InputGroupInput placeholder="Search..." />
        <InputGroupAddon>
          <HugeiconsIcon icon={Search01Icon} />
        </InputGroupAddon>
        <InputGroupAddon align="inline-end">
          <Kbd hotkey="Mod+K" />
        </InputGroupAddon>
      </InputGroup>
    </div>
  );
}
