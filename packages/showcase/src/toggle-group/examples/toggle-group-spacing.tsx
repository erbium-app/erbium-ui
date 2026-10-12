import { Icon } from "@erbium/ui/components/icon";

import { ToggleGroup, ToggleGroupItem } from "@erbium/ui/components/toggle-group";

export default function ToggleGroupSpacing() {
  return (
    <ToggleGroup variant="outline" spacing={2} size="sm">
      <ToggleGroupItem
        value="star"
        aria-label="Toggle star"
        className="data-[state=on]:bg-transparent data-[state=on]:*:[svg]:fill-warning data-[state=on]:*:[svg]:stroke-warning"
      >
        <Icon name="star" />
        Star
      </ToggleGroupItem>
      <ToggleGroupItem
        value="heart"
        aria-label="Toggle heart"
        className="data-[state=on]:bg-transparent data-[state=on]:*:[svg]:fill-error data-[state=on]:*:[svg]:stroke-error"
      >
        <Icon name="heart" />
        Heart
      </ToggleGroupItem>
      <ToggleGroupItem
        value="bookmark"
        aria-label="Toggle bookmark"
        className="data-[state=on]:bg-transparent data-[state=on]:*:[svg]:fill-info data-[state=on]:*:[svg]:stroke-info"
      >
        <Icon name="bookmark-01" />
        Bookmark
      </ToggleGroupItem>
    </ToggleGroup>
  );
}
