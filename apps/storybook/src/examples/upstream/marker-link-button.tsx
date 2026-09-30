import { HugeiconsIcon } from "@hugeicons/react";
import GitBranchIcon from "@hugeicons/core-free-icons/GitBranchIcon";
import RotateCcwIcon from "@hugeicons/core-free-icons/RotateCcwIcon";

import { toast } from "@erbium/ui/components/toast";

import { Marker, MarkerContent, MarkerIcon } from "@erbium/ui/components/marker";

export function MarkerLinkButtonDemo() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-8 py-12">
      <Marker render={<a href="#links-and-buttons" />}>
        <MarkerIcon>
          <HugeiconsIcon icon={GitBranchIcon} />
        </MarkerIcon>
        <MarkerContent>View the pull request</MarkerContent>
      </Marker>
      <Marker
        render={
          <button
            type="button"
            className="transition-colors hover:text-foreground"
            onClick={() => toast.add({ title: "You clicked the revert button" })}
          />
        }
      >
        <MarkerIcon>
          <HugeiconsIcon icon={RotateCcwIcon} />
        </MarkerIcon>
        <MarkerContent>Revert this change</MarkerContent>
      </Marker>
    </div>
  );
}
