import { Icon } from "@erbium/ui/components/icon";

import { ToggleGroup, ToggleGroupItem } from "@erbium/ui/components/toggle-group";

export default function ToggleGroupVerticalExample() {
  return (
    <ToggleGroup multiple orientation="vertical" spacing={1} defaultValue={["bold", "italic"]}>
      <ToggleGroupItem value="bold" aria-label="Toggle bold">
        <Icon name="bold" />
      </ToggleGroupItem>
      <ToggleGroupItem value="italic" aria-label="Toggle italic">
        <Icon name="italic" />
      </ToggleGroupItem>
      <ToggleGroupItem value="underline" aria-label="Toggle underline">
        <Icon name="underline" />
      </ToggleGroupItem>
    </ToggleGroup>
  );
}
