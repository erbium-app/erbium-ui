import * as React from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import CreditCardIcon from "@hugeicons/core-free-icons/CreditCardIcon";
import Settings01Icon from "@hugeicons/core-free-icons/Settings01Icon";
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

export function CommandWithShortcuts() {
  const [open, setOpen] = React.useState(false);

  return (
    <div className="flex flex-col gap-4">
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
