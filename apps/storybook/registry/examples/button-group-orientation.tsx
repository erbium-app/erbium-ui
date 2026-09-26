// @ts-nocheck
import { MinusIcon, PlusIcon } from "lucide-react";

import { Button } from "../components/button";
import { ButtonGroup } from "../components/button-group";

export default function ButtonGroupOrientation() {
  return (
    <ButtonGroup orientation="vertical" aria-label="Media controls" className="h-fit">
      <Button variant="outline" size="icon">
        <PlusIcon />
      </Button>
      <Button variant="outline" size="icon">
        <MinusIcon />
      </Button>
    </ButtonGroup>
  );
}
