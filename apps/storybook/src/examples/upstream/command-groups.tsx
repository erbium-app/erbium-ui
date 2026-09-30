import * as React from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import CalculatorIcon from "@hugeicons/core-free-icons/CalculatorIcon";
import Calendar01Icon from "@hugeicons/core-free-icons/Calendar01Icon";
import CreditCardIcon from "@hugeicons/core-free-icons/CreditCardIcon";
import Settings01Icon from "@hugeicons/core-free-icons/Settings01Icon";
import SmileIcon from "@hugeicons/core-free-icons/SmileIcon";
import UserIcon from "@hugeicons/core-free-icons/UserIcon";

import { Button } from "@erbium/ui/components/button";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@erbium/ui/components/command";

export function CommandWithGroups() {
  const [open, setOpen] = React.useState(false);

  return (
    <div className="flex flex-col gap-4">
      <Button onClick={() => setOpen(true)} variant="outline" className="w-fit">
        Open Menu
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <Command>
          <CommandInput placeholder="Type a command or search..." />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup heading="Suggestions">
              <CommandItem>
                <HugeiconsIcon icon={Calendar01Icon} />
                <span>Calendar</span>
              </CommandItem>
              <CommandItem>
                <HugeiconsIcon icon={SmileIcon} />
                <span>Search Emoji</span>
              </CommandItem>
              <CommandItem>
                <HugeiconsIcon icon={CalculatorIcon} />
                <span>Calculator</span>
              </CommandItem>
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup heading="Settings">
              <CommandItem>
                <HugeiconsIcon icon={UserIcon} />
                <span>Profile</span>
                <CommandShortcut>⌘P</CommandShortcut>
              </CommandItem>
              <CommandItem>
                <HugeiconsIcon icon={CreditCardIcon} />
                <span>Billing</span>
                <CommandShortcut>⌘B</CommandShortcut>
              </CommandItem>
              <CommandItem>
                <HugeiconsIcon icon={Settings01Icon} />
                <span>Settings</span>
                <CommandShortcut>⌘S</CommandShortcut>
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </CommandDialog>
    </div>
  );
}
