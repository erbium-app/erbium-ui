// @ts-nocheck
import { HugeiconsIcon } from "@hugeicons/react";
import BotIcon from "@hugeicons/core-free-icons/BotIcon";
import ChevronDownIcon from "@hugeicons/core-free-icons/ChevronDownIcon";

import { Button } from "../components/button";
import { ButtonGroup } from "../components/button-group";
import { Popover, PopoverContent, PopoverTrigger } from "../components/popover";
import { Separator } from "../components/separator";
import { Textarea } from "../components/textarea";

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
              className="group/popover-trigger"
            >
              <HugeiconsIcon
                icon={ChevronDownIcon}
                className="transition-transform duration-200 ease-in-out group-data-popup-open/popover-trigger:rotate-180 group-data-open/popover-trigger:rotate-180 motion-reduce:transition-none"
              />
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
