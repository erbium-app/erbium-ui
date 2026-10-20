import { RotatingChevron } from "@erbium/ui/components/stateful-icon";
import { Button } from "@erbium/ui/components/button";
import { Card } from "@erbium/ui/components/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@erbium/ui/components/collapsible";
import { Separator } from "@erbium/ui/components/separator";

export const CollapsibleBasic = () => (
  <Card className="mx-auto w-64 gap-0 p-0" size="sm">
    <Collapsible>
      <CollapsibleTrigger className="group group/details flex w-full items-center rounded-xl px-3 py-2 text-start text-caption font-medium outline-none hover:bg-accent data-panel-open:rounded-b-none [&:has(+_[data-slot=collapsible-content]:not([hidden]))]:rounded-b-none focus-visible:ring-2 focus-visible:ring-focus-halo">
        Product details
        <RotatingChevron scope="collapsible" className="ms-auto size-4 text-muted-foreground" />
      </CollapsibleTrigger>
      <CollapsibleContent>
        <Separator />
        <div className="flex flex-col items-start gap-related px-3 pt-2 pb-3 text-caption text-muted-foreground">
          <div>This panel can be expanded or collapsed to reveal additional content.</div>
          <Button size="xs">Learn More</Button>
        </div>
      </CollapsibleContent>
    </Collapsible>
  </Card>
);
