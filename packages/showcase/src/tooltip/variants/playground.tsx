import { Tooltip, TooltipTrigger, TooltipContent } from "@erbium/ui/components/tooltip";
import { Button } from "@erbium/ui/components/button";

const Example = (args: {
  side: "top" | "right" | "bottom" | "left";
  align: "start" | "center" | "end";
  sideOffset: number;
  defaultOpen: boolean;
}) => (
  <Tooltip key={String(args.defaultOpen)} defaultOpen={args.defaultOpen}>
    <TooltipTrigger render={<Button variant="outline">Hover for tooltip</Button>} />
    <TooltipContent side={args.side} align={args.align} sideOffset={args.sideOffset}>
      Helpful information
    </TooltipContent>
  </Tooltip>
);

export default Example;
