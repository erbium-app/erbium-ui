import { Button } from "@erbium/ui/components/button";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@erbium/ui/components/hover-card";

const HOVER_CARD_SIDES = ["left", "top", "bottom", "right"] as const;

export const HoverCardSides = () => (
  <div className="flex flex-wrap justify-center gap-related">
    {HOVER_CARD_SIDES.map((side) => (
      <HoverCard key={side}>
        <HoverCardTrigger
          delay={100}
          closeDelay={100}
          render={<Button variant="outline" className="capitalize" />}
        >
          {side}
        </HoverCardTrigger>
        <HoverCardContent side={side}>
          <div className="flex flex-col gap-1">
            <h4 className="text-subtitle">Hover Card</h4>
            <p>This hover card appears on the {side} side of the trigger.</p>
          </div>
        </HoverCardContent>
      </HoverCard>
    ))}
  </div>
);
