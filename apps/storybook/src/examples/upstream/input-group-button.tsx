import * as React from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import CheckIcon from "@hugeicons/core-free-icons/CheckIcon";
import CopyIcon from "@hugeicons/core-free-icons/CopyIcon";
import InfoIcon from "@hugeicons/core-free-icons/InfoIcon";
import StarIcon from "@hugeicons/core-free-icons/StarIcon";

import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@erbium/ui/components/input-group";
import { Popover, PopoverContent, PopoverTrigger } from "@erbium/ui/components/popover";

export default function InputGroupButtonExample() {
  const [isCopied, setIsCopied] = React.useState(false);
  async function copyToClipboard(value: string) {
    await navigator.clipboard.writeText(value);
    setIsCopied(true);
  }
  const [isFavorite, setIsFavorite] = React.useState(false);

  return (
    <div className="grid w-full max-w-sm gap-6">
      <InputGroup>
        <InputGroupInput placeholder="https://x.com/shadcn" readOnly />
        <InputGroupAddon align="inline-end">
          <InputGroupButton
            aria-label="Copy"
            title="Copy"
            size="icon-xs"
            onClick={() => {
              void copyToClipboard("https://x.com/shadcn");
            }}
          >
            {isCopied ? <HugeiconsIcon icon={CheckIcon} /> : <HugeiconsIcon icon={CopyIcon} />}
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
      <InputGroup className="[--radius:9999px]">
        <InputGroupAddon>
          <Popover>
            <PopoverTrigger
              render={
                <InputGroupButton
                  aria-label="Connection information"
                  variant="secondary"
                  size="icon-xs"
                >
                  <HugeiconsIcon icon={InfoIcon} />
                </InputGroupButton>
              }
            />
            <PopoverContent align="start" className="flex flex-col gap-1 rounded-xl text-sm">
              <p className="font-medium">Your connection is not secure.</p>
              <p>You should not enter any sensitive information on this site.</p>
            </PopoverContent>
          </Popover>
        </InputGroupAddon>
        <InputGroupAddon className="pl-1.5 text-muted-foreground">https://</InputGroupAddon>
        <InputGroupInput id="input-secure-19" />
        <InputGroupAddon align="inline-end">
          <InputGroupButton onClick={() => setIsFavorite(!isFavorite)} size="icon-xs">
            <HugeiconsIcon
              icon={StarIcon}
              data-favorite={isFavorite}
              className="data-[favorite=true]:fill-info data-[favorite=true]:stroke-info"
            />
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
      <InputGroup>
        <InputGroupInput placeholder="Type to search..." />
        <InputGroupAddon align="inline-end">
          <InputGroupButton variant="secondary">Search</InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
    </div>
  );
}
