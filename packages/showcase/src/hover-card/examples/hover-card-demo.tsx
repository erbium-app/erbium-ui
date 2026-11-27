import { Avatar, AvatarFallback, AvatarImage } from "@erbium/ui/components/avatar";
import { Button } from "@erbium/ui/components/button";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@erbium/ui/components/hover-card";

export default function HoverCardExample() {
  return (
    <HoverCard>
      <HoverCardTrigger render={<Button variant="link">@erbium</Button>} />
      <HoverCardContent className="w-80">
        <div className="flex justify-between gap-group">
          <Avatar>
            <AvatarImage
              src="https://ui.erbium.app/brand/erbium-logo-dark.svg"
              alt="Erbium UI"
              className="bg-foreground p-1 dark:bg-background"
            />
            <AvatarFallback>EU</AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <h4 className="text-subtitle">@erbium</h4>
            <p className="text-caption">Accessible components for building your next interface.</p>
            <div className="text-metadata text-muted-foreground">Joined December 2021</div>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}
