import { Icon } from "@erbium/ui/components/icon";

import { Toggle } from "@erbium/ui/components/toggle";

export default function ToggleExample() {
  return (
    <Toggle
      aria-label="Toggle bookmark"
      size="sm"
      variant="outline"
      className="data-[state=on]:bg-transparent data-[state=on]:*:[svg]:fill-info data-[state=on]:*:[svg]:stroke-info"
    >
      <Icon name="bookmark-01" />
      Bookmark
    </Toggle>
  );
}
