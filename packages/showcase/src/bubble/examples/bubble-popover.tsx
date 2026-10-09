import { HugeiconsIcon } from "@hugeicons/react";
import InfoIcon from "@hugeicons/core-free-icons/InfoIcon";

import { Bubble, BubbleContent, BubbleReactions } from "@erbium/ui/components/bubble";
import { Button } from "@erbium/ui/components/button";
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@erbium/ui/components/popover";

export function BubblePopoverDemo() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-group py-12">
      <Bubble align="end">
        <BubbleContent>Run the build script.</BubbleContent>
      </Bubble>
      <Bubble variant="error">
        <BubbleContent>Failed to run the command.</BubbleContent>
        <BubbleReactions>
          <Popover>
            <PopoverTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon-xs"
                  aria-label="Show error details"
                  className="aria-expanded:text-error"
                />
              }
            >
              <HugeiconsIcon icon={InfoIcon} />
            </PopoverTrigger>
            <PopoverContent>
              <PopoverHeader>
                <PopoverTitle className="text-caption">
                  Command failed with exit code 1
                </PopoverTitle>
                <PopoverDescription className="text-caption">
                  ENOENT: no such file or directory, open pnpm-lock.yaml
                </PopoverDescription>
              </PopoverHeader>
            </PopoverContent>
          </Popover>
        </BubbleReactions>
      </Bubble>
    </div>
  );
}
