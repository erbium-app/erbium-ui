import { Icon } from "@erbium/ui/components/icon";

import { Button } from "@erbium/ui/components/button";
import { ButtonGroup } from "@erbium/ui/components/button-group";

export default function ButtonGroupOrientationExample() {
  return (
    <ButtonGroup orientation="vertical" aria-label="Media controls" className="h-fit">
      <Button variant="outline" size="icon">
        <Icon name="plus" />
      </Button>
      <Button variant="outline" size="icon">
        <Icon name="minus" />
      </Button>
    </ButtonGroup>
  );
}
