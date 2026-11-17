import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@erbium/ui/components/collapsible";
import { RotatingChevron as RotatingChevronIcon } from "@erbium/ui/components/stateful-icon";

export default function StatefulIconRotatingChevronExample() {
  return (
    <Collapsible className="w-72">
      <CollapsibleTrigger className="group flex w-full items-center rounded-lg border px-3 py-2 text-start">
        Project details
        <RotatingChevronIcon direction="right" className="ms-auto size-4" />
      </CollapsibleTrigger>
      <CollapsibleContent className="px-3 py-2 text-caption text-muted-foreground">
        The shared chevron follows the trigger’s open state.
      </CollapsibleContent>
    </Collapsible>
  );
}
