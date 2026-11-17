import { HoverCard, HoverCardContent, HoverCardTrigger } from "@erbium/ui/components/hover-card";
import { Button } from "@erbium/ui/components/button";

export default function HoverCardTriggerDelaysExample() {
  return (
    <HoverCard>
      <HoverCardTrigger closeDelay={200} delay={100} render={<Button variant="link" />}>
        Hover to preview
      </HoverCardTrigger>
      <HoverCardContent>Opens after 100 ms and closes after 200 ms.</HoverCardContent>
    </HoverCard>
  );
}
