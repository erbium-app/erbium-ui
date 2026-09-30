import { HugeiconsIcon } from "@hugeicons/react";
import GitBranchIcon from "@hugeicons/core-free-icons/GitBranchIcon";
import GitForkIcon from "@hugeicons/core-free-icons/GitForkIcon";

import { Button } from "@erbium/ui/components/button";

export default function ButtonWithIcon() {
  return (
    <div className="flex gap-2">
      <Button variant="outline">
        <HugeiconsIcon icon={GitBranchIcon} data-icon="inline-start" /> New Branch
      </Button>
      <Button variant="outline">
        Fork
        <HugeiconsIcon icon={GitForkIcon} data-icon="inline-end" />
      </Button>
    </div>
  );
}
