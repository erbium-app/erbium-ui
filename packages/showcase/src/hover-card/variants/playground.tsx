import { HoverCard, HoverCardContent, HoverCardTrigger } from "@erbium/ui/components/hover-card";
import { Button } from "@erbium/ui/components/button";

export const defaultProps = {
  align: "center",
  defaultOpen: false,
  side: "bottom",
  sideOffset: 4,
} satisfies {
  side: "top" | "right" | "bottom" | "left";
  align: "start" | "center" | "end";
  sideOffset: number;
  defaultOpen: boolean;
};

export default function HoverCardPlaygroundExample(
  args: {
    side: "top" | "right" | "bottom" | "left";
    align: "start" | "center" | "end";
    sideOffset: number;
    defaultOpen: boolean;
  } = defaultProps,
) {
  return (
    <HoverCard key={String(args.defaultOpen)} defaultOpen={args.defaultOpen}>
      <HoverCardTrigger render={<Button variant="link">Hover for card</Button>} />
      <HoverCardContent side={args.side} align={args.align} sideOffset={args.sideOffset}>
        Preview content
      </HoverCardContent>
    </HoverCard>
  );
}
