import {
  CollapsibleTrigger,
  CollapsibleContent,
  Collapsible,
} from "@erbium/ui/components/collapsible";
import { Card } from "@erbium/ui/components/card";
import { RotatingChevron } from "@erbium/ui/components/stateful-icon";
import { Separator } from "@erbium/ui/components/separator";
import type * as React from "react";

export const defaultProps = {
  defaultOpen: true,
  disabled: false,
} satisfies React.ComponentProps<typeof Collapsible>;

export default function CollapsiblePlaygroundExample(
  args: React.ComponentProps<typeof Collapsible> = defaultProps,
) {
  return (
    <Card className="w-72 gap-0 p-0" size="sm">
      <Collapsible key={String(args.defaultOpen)} {...args}>
        <CollapsibleTrigger className="group group/playground flex w-full items-center rounded-xl px-3 py-2 text-start text-caption font-medium outline-none hover:bg-accent data-panel-open:rounded-b-none [&:has(+_[data-slot=collapsible-content]:not([hidden]))]:rounded-b-none focus-visible:ring-2 focus-visible:ring-focus-halo">
          Show details
          <RotatingChevron direction="right" className="ms-auto size-4 text-muted-foreground" />
        </CollapsibleTrigger>
        <CollapsibleContent>
          <Separator />
          <div className="px-3 pt-2 pb-3 text-caption text-muted-foreground">
            More information is available here.
          </div>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}
