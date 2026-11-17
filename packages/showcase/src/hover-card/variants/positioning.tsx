import { HoverCard, HoverCardContent, HoverCardTrigger } from "@erbium/ui/components/hover-card";
import { Button } from "@erbium/ui/components/button";

export default function HoverCardPositioningExample() {
  return (
    <HoverCard>
      <HoverCardTrigger render={<Button variant="link" />}>Preview above</HoverCardTrigger>
      <HoverCardContent align="start" side="top">
        Aligned to the start of the trigger.
      </HoverCardContent>
    </HoverCard>
  );
}
