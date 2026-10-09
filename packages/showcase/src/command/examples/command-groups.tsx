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
  CommandGroupLabel,
  CommandCollection,
  CommandInput,
  CommandItem,
  CommandList,
  CommandShortcut,
} from "@erbium/ui/components/command";

const commandGroups = [
  {
    label: "Suggestions",
    items: [
      {
        label: "Calendar",
        disabled: false,
        content: (
          <>
            <HugeiconsIcon icon={Calendar01Icon} />
            <span>Calendar</span>
          </>
        ),
      },
      {
        label: "Search Emoji",
        disabled: false,
        content: (
          <>
            <HugeiconsIcon icon={SmileIcon} />
            <span>Search Emoji</span>
          </>
        ),
      },
      {
        label: "Calculator",
        disabled: false,
        content: (
          <>
            <HugeiconsIcon icon={CalculatorIcon} />
            <span>Calculator</span>
          </>
        ),
      },
    ],
  },
  {
    label: "Settings",
    items: [
      {
        label: "Profile",
        disabled: false,
        content: (
          <>
            <HugeiconsIcon icon={UserIcon} />
            <span>Profile</span>
            <CommandShortcut hotkey="Mod+P" />
          </>
        ),
      },
      {
        label: "Billing",
        disabled: false,
        content: (
          <>
            <HugeiconsIcon icon={CreditCardIcon} />
            <span>Billing</span>
            <CommandShortcut hotkey="Mod+B" />
          </>
        ),
      },
      {
        label: "Settings",
        disabled: false,
        content: (
          <>
            <HugeiconsIcon icon={Settings01Icon} />
            <span>Settings</span>
            <CommandShortcut hotkey="Mod+S" />
          </>
        ),
      },
    ],
  },
];

export function CommandWithGroups() {
  const [open, setOpen] = React.useState(false);

  return (
    <div className="flex flex-col gap-group">
      <Button onClick={() => setOpen(true)} variant="outline" className="w-fit">
        Open Menu
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <Command items={commandGroups}>
          <CommandInput aria-label="Search commands" placeholder="Type a command or search..." />
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandList>
            {(group: (typeof commandGroups)[number]) => (
              <CommandGroup key={group.label} items={group.items}>
                <CommandGroupLabel>{group.label}</CommandGroupLabel>
                <CommandCollection>
                  {(item: (typeof commandGroups)[number]["items"][number]) => (
                    <CommandItem
                      key={item.label}
                      value={item}
                      disabled={item.disabled}
                      onClick={() => setOpen(false)}
                    >
                      {item.content}
                    </CommandItem>
                  )}
                </CommandCollection>
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </CommandDialog>
    </div>
  );
}
