import { Button } from "@erbium/ui/components/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@erbium/ui/components/tooltip";

export const TooltipSides = () => (
  <div className="flex flex-wrap gap-related">
    {(["left", "top", "bottom", "right"] as const).map((side) => (
      <Tooltip key={side}>
        <TooltipTrigger render={<Button variant="outline" className="w-fit capitalize" />}>
          {side}
        </TooltipTrigger>
        <TooltipContent side={side}>
          <p>Add to library</p>
        </TooltipContent>
      </Tooltip>
    ))}
  </div>
);
