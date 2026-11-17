import { Button } from "@erbium/ui/components/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@erbium/ui/components/tooltip";

export default function TooltipExample() {
  return (
    <Tooltip>
      <TooltipTrigger render={<Button variant="outline">Hover</Button>} />
      <TooltipContent>
        <p>Add to library</p>
      </TooltipContent>
    </Tooltip>
  );
}
