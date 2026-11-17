import { Icon } from "@erbium/ui/components/icon";

import { Button } from "@erbium/ui/components/button";
import { Kbd } from "@erbium/ui/components/kbd";
import { Tooltip, TooltipContent, TooltipTrigger } from "@erbium/ui/components/tooltip";

export default function TooltipKeyboardExample() {
  return (
    <Tooltip>
      <TooltipTrigger render={<Button variant="outline" size="icon-sm" />}>
        <Icon name="save" />
      </TooltipTrigger>
      <TooltipContent>
        Save Changes <Kbd hotkey="S" />
      </TooltipContent>
    </Tooltip>
  );
}
