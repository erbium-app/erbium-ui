import { Icon } from "@erbium/ui/components/icon";

import { ToggleGroup, ToggleGroupItem } from "@erbium/ui/components/toggle-group";

const ToggleGroupDemo = () => (
  <ToggleGroup variant="outline">
    <ToggleGroupItem value="bold" aria-label="Toggle bold">
      <Icon name="bold" className="h-4 w-4" />
    </ToggleGroupItem>
    <ToggleGroupItem value="italic" aria-label="Toggle italic">
      <Icon name="italic" className="h-4 w-4" />
    </ToggleGroupItem>
    <ToggleGroupItem value="strikethrough" aria-label="Toggle strikethrough">
      <Icon name="underline" className="h-4 w-4" />
    </ToggleGroupItem>
  </ToggleGroup>
);

export default ToggleGroupDemo;
