import { BookmarkIcon } from "lucide-react";

import { Toggle } from "@erbium/ui/components/toggle";

export default function ToggleDemo() {
  return (
    <Toggle
      aria-label="Toggle bookmark"
      size="sm"
      variant="outline"
      className="data-[state=on]:bg-transparent data-[state=on]:*:[svg]:fill-info data-[state=on]:*:[svg]:stroke-info"
    >
      <BookmarkIcon />
      Bookmark
    </Toggle>
  );
}
