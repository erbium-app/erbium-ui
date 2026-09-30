// @ts-nocheck
import { HugeiconsIcon } from "@hugeicons/react";
import Search01Icon from "@hugeicons/core-free-icons/Search01Icon";

import { Button } from "../components/button";
import { ButtonGroup } from "../components/button-group";
import { Input } from "../components/input";

export default function ButtonGroupInput() {
  return (
    <ButtonGroup>
      <Input placeholder="Search..." />
      <Button variant="outline" aria-label="Search">
        <HugeiconsIcon icon={Search01Icon} />
      </Button>
    </ButtonGroup>
  );
}
