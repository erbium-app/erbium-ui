// @ts-nocheck
import { HugeiconsIcon } from "@hugeicons/react";
import CheckIcon from "@hugeicons/core-free-icons/CheckIcon";
import CopyIcon from "@hugeicons/core-free-icons/CopyIcon";

import { Button } from "../components/button";
import { useCopyToClipboard } from "../hooks/use-copy-to-clipboard";
import { StatefulIcon } from "../components/stateful-icon";

export default function StatefulIconDemo() {
  const { copyToClipboard, isCopied } = useCopyToClipboard({ timeout: 1200 });

  return (
    <Button
      aria-label={isCopied ? "Copied" : "Copy example text"}
      onClick={() => copyToClipboard("Stateful icons animate between states.")}
      size="icon"
      variant="outline"
    >
      <StatefulIcon
        state={isCopied ? "success" : "idle"}
        icons={{
          idle: <HugeiconsIcon icon={CopyIcon} className="size-4" />,
          success: <HugeiconsIcon icon={CheckIcon} className="size-4" />,
        }}
      />
    </Button>
  );
}
