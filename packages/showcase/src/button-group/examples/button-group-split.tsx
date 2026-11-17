import { Icon } from "@erbium/ui/components/icon";

import { Button } from "@erbium/ui/components/button";
import { ButtonGroup, ButtonGroupSeparator } from "@erbium/ui/components/button-group";

export default function ButtonGroupSplitExample() {
  return (
    <ButtonGroup>
      <Button variant="secondary">Button</Button>
      <ButtonGroupSeparator />
      <Button size="icon" variant="secondary">
        <Icon name="plus" />
      </Button>
    </ButtonGroup>
  );
}
