import { Icon } from "@erbium/ui/components/icon";

import { Button } from "@erbium/ui/components/button";
import { ButtonGroup, ButtonGroupText } from "@erbium/ui/components/button-group";
import { Input } from "@erbium/ui/components/input";

export default function ButtonGroupTextExample() {
  return (
    <div className="flex flex-col items-start gap-group">
      <ButtonGroup>
        <ButtonGroupText>https://</ButtonGroupText>
        <Input aria-label="Domain" placeholder="example.com" className="w-48" />
      </ButtonGroup>
      <ButtonGroup>
        <ButtonGroupText>
          <Icon name="user" aria-hidden="true" />
          Assignee
        </ButtonGroupText>
        <Button variant="outline">Leo Brandt</Button>
        <Button variant="outline" size="icon" aria-label="Clear assignee">
          <Icon name="x" aria-hidden="true" />
        </Button>
      </ButtonGroup>
      <ButtonGroup>
        <ButtonGroupText>
          <Icon name="tag-01" aria-hidden="true" />
          Labels
        </ButtonGroupText>
        <Button variant="outline" size="sm" className="text-muted-foreground">
          includes any of
        </Button>
        <Button variant="outline" size="sm">
          Feature
        </Button>
        <Button variant="outline" size="icon-sm" aria-label="Remove labels filter">
          <Icon name="x" aria-hidden="true" />
        </Button>
      </ButtonGroup>
    </div>
  );
}
