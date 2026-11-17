import { Button } from "@erbium/ui/components/button";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@erbium/ui/components/hover-card";

export default function HoverCardExample() {
  return (
    <HoverCard>
      <HoverCardTrigger delay={10} closeDelay={100} render={<Button variant="link" />}>
        Hover Here
      </HoverCardTrigger>
      <HoverCardContent className="flex w-64 flex-col gap-0.5">
        <div className="font-semibold">@erbium</div>
        <div>Accessible components for building your next interface.</div>
        <div className="mt-1 text-metadata text-muted-foreground">Joined December 2021</div>
      </HoverCardContent>
    </HoverCard>
  );
}
