import { HugeiconsIcon } from "@hugeicons/react";
import PlusIcon from "@hugeicons/core-free-icons/PlusIcon";

import { Button } from "@erbium/ui/components/button";
import { ButtonGroup, ButtonGroupSeparator } from "@erbium/ui/components/button-group";

export default function ButtonGroupSplit() {
  return (
    <ButtonGroup>
      <Button variant="secondary">Button</Button>
      <ButtonGroupSeparator />
      <Button size="icon" variant="secondary">
        <HugeiconsIcon icon={PlusIcon} />
      </Button>
    </ButtonGroup>
  );
}
