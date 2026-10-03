import { HoverCard, HoverCardContent, HoverCardTrigger } from "@erbium/ui/components/hover-card";
import { Button } from "@erbium/ui/components/button";

const Example = (args: {
  side: "top" | "right" | "bottom" | "left";
  align: "start" | "center" | "end";
  sideOffset: number;
  defaultOpen: boolean;
}) => (
  <HoverCard key={String(args.defaultOpen)} defaultOpen={args.defaultOpen}>
    <HoverCardTrigger render={<Button variant="link">Hover for card</Button>} />
    <HoverCardContent side={args.side} align={args.align} sideOffset={args.sideOffset}>
      Preview content
    </HoverCardContent>
  </HoverCard>
);

export default Example;
