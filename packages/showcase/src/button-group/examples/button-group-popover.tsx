import { HugeiconsIcon } from "@hugeicons/react";
import BotIcon from "@hugeicons/core-free-icons/BotIcon";

import { RotatingChevron } from "@erbium/ui/components/stateful-icon";
import { Button } from "@erbium/ui/components/button";
import { ButtonGroup } from "@erbium/ui/components/button-group";
import { Popover, PopoverContent, PopoverTrigger } from "@erbium/ui/components/popover";
import { Separator } from "@erbium/ui/components/separator";
import { Textarea } from "@erbium/ui/components/textarea";

export default function ButtonGroupPopover() {
  return (
    <ButtonGroup>
      <Button variant="outline">
        <HugeiconsIcon icon={BotIcon} /> Copilot
      </Button>
      <Popover>
        <PopoverTrigger
          render={
            <Button
              variant="outline"
              size="icon"
              aria-label="Open Popover"
              className="group group/popover-trigger"
            >
              <RotatingChevron />
            </Button>
          }
        />
        <PopoverContent align="end" className="gap-0 overflow-hidden rounded-xl p-0 text-sm">
          <div className="px-3 py-2">
            <div className="text-sm font-medium">Agent Tasks</div>
          </div>
          <Separator />
          <div className="p-3 text-sm *:[p:not(:last-child)]:mb-2">
            <Textarea
              placeholder="Describe your task in natural language."
              className="mb-3 resize-none"
            />
            <p className="font-medium">Start a new task with Copilot</p>
            <p className="text-muted-foreground">
              Describe your task in natural language. Copilot will work in the background and open a
              pull request for your review.
            </p>
          </div>
        </PopoverContent>
      </Popover>
    </ButtonGroup>
  );
}
