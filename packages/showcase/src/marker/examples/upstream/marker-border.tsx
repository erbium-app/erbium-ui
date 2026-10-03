import { HugeiconsIcon } from "@hugeicons/react";
import FileTextIcon from "@hugeicons/core-free-icons/FileTextIcon";
import GitBranchIcon from "@hugeicons/core-free-icons/GitBranchIcon";
import Search01Icon from "@hugeicons/core-free-icons/Search01Icon";

import { Marker, MarkerContent, MarkerIcon } from "@erbium/ui/components/marker";

export function MarkerBorderDemo() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-3 py-12">
      <Marker variant="border">
        <MarkerIcon>
          <HugeiconsIcon icon={GitBranchIcon} />
        </MarkerIcon>
        <MarkerContent>Switched to release-candidate</MarkerContent>
      </Marker>
      <Marker variant="border">
        <MarkerIcon>
          <HugeiconsIcon icon={Search01Icon} />
        </MarkerIcon>
        <MarkerContent>Reviewed 8 related files</MarkerContent>
      </Marker>
      <Marker variant="border">
        <MarkerIcon>
          <HugeiconsIcon icon={FileTextIcon} />
        </MarkerIcon>
        <MarkerContent>Opened implementation notes</MarkerContent>
      </Marker>
    </div>
  );
}
