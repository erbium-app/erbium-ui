import * as React from "react";
import { useHotkey } from "@tanstack/react-hotkeys";

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
} from "@erbium/ui/components/command";

const commandGroups = [
  {
    items: [
      { content: <> Calendar </>, disabled: false, label: "Calendar" },
      { content: <> Search Emoji </>, disabled: false, label: "Search Emoji" },
      { content: <> Calculator </>, disabled: false, label: "Calculator" },
    ],
    label: "Suggestions",
  },
];

export function CommandBasic() {
  const [open, setOpen] = React.useState(false);

  // Toggle the palette with Mod+K, but keep the shortcut from firing while
  // typing in an editable control. `allow` avoids a duplicate-registration
  // warning when the example renders beside an app that already owns Mod+K.
  useHotkey(
    "Mod+K",
    () => {
      setOpen((current) => !current);
    },
    {
      conflictBehavior: "allow",
      ignoreInputs: true,
    },
  );

  return (
    <div className="flex flex-col gap-group">
      <Button
        onClick={() => {
          setOpen(true);
        }}
        variant="outline"
        className="w-fit"
      >
        Open Command Palette
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
