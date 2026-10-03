import { HugeiconsIcon } from "@hugeicons/react";
import BookOpenCheckIcon from "@hugeicons/core-free-icons/BookOpenCheckIcon";
import GitBranchIcon from "@hugeicons/core-free-icons/GitBranchIcon";
import Search01Icon from "@hugeicons/core-free-icons/Search01Icon";

import { Marker, MarkerContent, MarkerIcon } from "@erbium/ui/components/marker";

export function MarkerIconDemo() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-12 py-12">
      <Marker>
        <MarkerIcon>
          <HugeiconsIcon icon={GitBranchIcon} />
        </MarkerIcon>
        <MarkerContent>Switched to a new branch</MarkerContent>
      </Marker>
      <Marker variant="separator">
        <MarkerIcon>
          <HugeiconsIcon icon={Search01Icon} />
        </MarkerIcon>
        <MarkerContent>Explored 4 files</MarkerContent>
      </Marker>
      <Marker className="flex-col">
        <MarkerIcon>
          <HugeiconsIcon icon={BookOpenCheckIcon} />
        </MarkerIcon>
        <MarkerContent>Syncing completed</MarkerContent>
      </Marker>
    </div>
  );
}
