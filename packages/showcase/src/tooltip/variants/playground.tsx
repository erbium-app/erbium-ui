import { Tooltip, TooltipTrigger, TooltipContent } from "@erbium/ui/components/tooltip";
import { Button } from "@erbium/ui/components/button";

export const defaultProps = {
  align: "center",
  defaultOpen: false,
  side: "top",
  sideOffset: 4,
} satisfies {
  side: "top" | "right" | "bottom" | "left";
  align: "start" | "center" | "end";
  sideOffset: number;
  defaultOpen: boolean;
};

export default function TooltipPlaygroundExample(
  args: {
    side: "top" | "right" | "bottom" | "left";
    align: "start" | "center" | "end";
    sideOffset: number;
    defaultOpen: boolean;
  } = defaultProps,
) {
  return (
    <Tooltip key={String(args.defaultOpen)} defaultOpen={args.defaultOpen}>
      <TooltipTrigger render={<Button variant="outline">Hover for tooltip</Button>} />
      <TooltipContent side={args.side} align={args.align} sideOffset={args.sideOffset}>
        Helpful information
      </TooltipContent>
    </Tooltip>
  );
}
