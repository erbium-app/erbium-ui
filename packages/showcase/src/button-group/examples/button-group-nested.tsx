import { Icon } from "@erbium/ui/components/icon";

import { Button } from "@erbium/ui/components/button";
import { ButtonGroup } from "@erbium/ui/components/button-group";

export default function ButtonGroupNestedExample() {
  return (
    <ButtonGroup>
      <ButtonGroup>
        <Button variant="outline" size="sm">
          1
        </Button>
        <Button variant="outline" size="sm">
          2
        </Button>
        <Button variant="outline" size="sm">
          3
        </Button>
        <Button variant="outline" size="sm">
          4
        </Button>
        <Button variant="outline" size="sm">
          5
        </Button>
      </ButtonGroup>
      <ButtonGroup>
        <Button variant="outline" size="icon-sm" aria-label="Previous">
          <Icon name="arrow-left-01" />
        </Button>
        <Button variant="outline" size="icon-sm" aria-label="Next">
          <Icon name="arrow-right-01" />
        </Button>
      </ButtonGroup>
    </ButtonGroup>
  );
}
