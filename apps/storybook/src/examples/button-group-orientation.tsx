import { HugeiconsIcon } from "@hugeicons/react";
import MinusIcon from "@hugeicons/core-free-icons/MinusIcon";
import PlusIcon from "@hugeicons/core-free-icons/PlusIcon";

import { Button } from "@erbium/ui/components/button";
import { ButtonGroup } from "@erbium/ui/components/button-group";

export default function ButtonGroupOrientation() {
  return (
    <ButtonGroup orientation="vertical" aria-label="Media controls" className="h-fit">
      <Button variant="outline" size="icon">
        <HugeiconsIcon icon={PlusIcon} />
      </Button>
      <Button variant="outline" size="icon">
        <HugeiconsIcon icon={MinusIcon} />
      </Button>
    </ButtonGroup>
  );
}
