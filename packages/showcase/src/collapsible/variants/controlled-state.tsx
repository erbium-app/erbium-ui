import { useState } from "react";
import { Button } from "@erbium/ui/components/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@erbium/ui/components/collapsible";

export default function CollapsibleControlledStateExample() {
  const [open, setOpen] = useState(false);

  return (
    <Collapsible open={open} onOpenChange={setOpen} className="w-72">
      <CollapsibleTrigger render={<Button variant="outline" />}>
        {open ? "Hide details" : "Show details"}
      </CollapsibleTrigger>
      <CollapsibleContent className="pt-4">
        This section is controlled by React state.
      </CollapsibleContent>
    </Collapsible>
  );
}
