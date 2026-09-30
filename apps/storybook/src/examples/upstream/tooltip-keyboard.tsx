import { HugeiconsIcon } from "@hugeicons/react";
import SaveIcon from "@hugeicons/core-free-icons/SaveIcon";

import { Button } from "@erbium/ui/components/button";
import { Kbd } from "@erbium/ui/components/kbd";
import { Tooltip, TooltipContent, TooltipTrigger } from "@erbium/ui/components/tooltip";

export function TooltipKeyboard() {
  return (
    <Tooltip>
      <TooltipTrigger render={<Button variant="outline" size="icon-sm" />}>
        <HugeiconsIcon icon={SaveIcon} />
      </TooltipTrigger>
      <TooltipContent>
        Save Changes <Kbd>S</Kbd>
      </TooltipContent>
    </Tooltip>
  );
}
