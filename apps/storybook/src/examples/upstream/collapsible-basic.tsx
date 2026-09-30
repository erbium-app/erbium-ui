import { ChevronRightIcon } from "lucide-react";
import { Button } from "@erbium/ui/components/button";
import { Card } from "@erbium/ui/components/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@erbium/ui/components/collapsible";
import { Separator } from "@erbium/ui/components/separator";

export function CollapsibleBasic() {
  return (
    <Card className="mx-auto w-64 gap-0 p-0" size="sm">
      <Collapsible>
        <CollapsibleTrigger className="group/details flex w-full items-center rounded-xl px-3 py-2 text-start text-sm font-medium outline-none hover:bg-accent data-panel-open:rounded-b-none [&:has(+_[data-slot=collapsible-content]:not([hidden]))]:rounded-b-none focus-visible:ring-2 focus-visible:ring-ring/40">
          Product details
          <ChevronRightIcon
            aria-hidden="true"
            className="ms-auto size-4 text-muted-foreground transition-transform duration-200 group-data-panel-open/details:rotate-90 motion-reduce:transition-none"
          />
        </CollapsibleTrigger>
        <CollapsibleContent>
          <Separator />
          <div className="flex flex-col items-start gap-2 px-3 pt-2 pb-3 text-sm text-muted-foreground">
            <div>This panel can be expanded or collapsed to reveal additional content.</div>
            <Button size="xs">Learn More</Button>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}
