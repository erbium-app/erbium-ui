import * as React from "react";
import { Icon } from "@erbium/ui/components/icon";

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
    items: [
      {
        content: (
          <>
            <Icon name="user" />
            <span>Profile</span>
            <CommandShortcut hotkey="Mod+P" />
          </>
        ),
        disabled: false,
        label: "Profile",
      },
      {
        content: (
          <>
            <Icon name="credit-card" />
            <span>Billing</span>
            <CommandShortcut hotkey="Mod+B" />
          </>
        ),
        disabled: false,
        label: "Billing",
      },
      {
        content: (
          <>
            <Icon name="settings-01" />
            <span>Settings</span>
            <CommandShortcut hotkey="Mod+S" />
          </>
        ),
        disabled: false,
        label: "Settings",
      },
    ],
    label: "Settings",
  },
];

export default function CommandWithShortcutsExample() {
  const [open, setOpen] = React.useState(false);

  return (
    <div className="flex flex-col gap-group">
      <Button
        onClick={() => {
          setOpen(true);
        }}
        variant="outline"
        className="w-fit"
      >
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
                      onClick={() => {
                        setOpen(false);
                      }}
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
