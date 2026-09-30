import * as React from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import ChevronDownIcon from "@hugeicons/core-free-icons/ChevronDownIcon";

import { Bubble, BubbleContent } from "@erbium/ui/components/bubble";
import { Button } from "@erbium/ui/components/button";
import { Collapsible, CollapsibleTrigger } from "@erbium/ui/components/collapsible";

const text = `The accessibility review found two focus states that were visually too subtle in dark mode.

I checked the dialog, menu, and drawer paths because each one renders focusable controls inside a layered surface.

The dialog and drawer are fine. The menu needs the hover and focus tokens split so keyboard focus stays visible when the pointer is not involved.

I also recommend keeping the change in the style file instead of the primitive so the other themes can choose their own focus treatment later.`;

const previewLength = 180;

export function BubbleCollapsible() {
  const [open, setOpen] = React.useState(false);
  const isLong = text.length > previewLength;
  const preview = `${text.slice(0, previewLength)}...`;

  return (
    <div className="flex w-full max-w-sm flex-col gap-8 py-12">
      <Bubble variant="muted">
        <BubbleContent>How can I help you today?</BubbleContent>
      </Bubble>

      <Bubble variant="muted" align="end">
        <BubbleContent className="whitespace-pre-line">
          <Collapsible open={open} onOpenChange={setOpen}>
            <div>{open || !isLong ? text : preview}</div>
            {isLong ? (
              <CollapsibleTrigger
                render={<Button variant="link" className="gap-1 p-0 text-muted-foreground" />}
              >
                {open ? "Show less" : "Show more"}
                <HugeiconsIcon
                  icon={ChevronDownIcon}
                  data-icon="inline-end"
                  className="transition-transform duration-200 ease-in-out group-data-panel-open/button:rotate-180 motion-reduce:transition-none"
                />
              </CollapsibleTrigger>
            ) : null}
          </Collapsible>
        </BubbleContent>
      </Bubble>
    </div>
  );
}
