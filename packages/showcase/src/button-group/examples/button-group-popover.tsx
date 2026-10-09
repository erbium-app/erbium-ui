import { HugeiconsIcon } from "@hugeicons/react";
import BotIcon from "@hugeicons/core-free-icons/BotIcon";

import { RotatingChevron } from "@erbium/ui/components/stateful-icon";
import { Button } from "@erbium/ui/components/button";
import { ButtonGroup } from "@erbium/ui/components/button-group";
import {
  Popover,
  PopoverContent,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@erbium/ui/components/popover";
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
        <PopoverContent align="end" className="overflow-hidden rounded-xl">
          <PopoverHeader>
            <PopoverTitle>Agent Tasks</PopoverTitle>
          </PopoverHeader>
          <Separator />
          <div className="flex flex-col gap-related text-caption">
            <Textarea
              placeholder="Describe your task in natural language."
              className="resize-none"
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
