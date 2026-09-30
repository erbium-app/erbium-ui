// @ts-nocheck
import { HugeiconsIcon } from "@hugeicons/react";
import Bookmark01Icon from "@hugeicons/core-free-icons/Bookmark01Icon";
import HeartIcon from "@hugeicons/core-free-icons/HeartIcon";
import StarIcon from "@hugeicons/core-free-icons/StarIcon";

import { ToggleGroup, ToggleGroupItem } from "../components/toggle-group";

export default function ToggleGroupSpacing() {
  return (
    <ToggleGroup variant="outline" spacing={2} size="sm">
      <ToggleGroupItem
        value="star"
        aria-label="Toggle star"
        className="data-[state=on]:bg-transparent data-[state=on]:*:[svg]:fill-warning data-[state=on]:*:[svg]:stroke-warning"
      >
        <HugeiconsIcon icon={StarIcon} />
        Star
      </ToggleGroupItem>
      <ToggleGroupItem
        value="heart"
        aria-label="Toggle heart"
        className="data-[state=on]:bg-transparent data-[state=on]:*:[svg]:fill-destructive data-[state=on]:*:[svg]:stroke-destructive"
      >
        <HugeiconsIcon icon={HeartIcon} />
        Heart
      </ToggleGroupItem>
      <ToggleGroupItem
        value="bookmark"
        aria-label="Toggle bookmark"
        className="data-[state=on]:bg-transparent data-[state=on]:*:[svg]:fill-info data-[state=on]:*:[svg]:stroke-info"
      >
        <HugeiconsIcon icon={Bookmark01Icon} />
        Bookmark
      </ToggleGroupItem>
    </ToggleGroup>
  );
}
