import { Icon } from "@erbium/ui/components/icon";

import {
  Command,
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
            <Icon name="calendar-01" />
            <span>Calendar</span>
          </>
        ),
      },
      {
        label: "Search Emoji",
        disabled: false,
        content: (
          <>
            <Icon name="smile" />
            <span>Search Emoji</span>
          </>
        ),
      },
      {
        label: "Calculator",
        disabled: true,
        content: (
          <>
            <Icon name="calculator" />
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
            <Icon name="user" />
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
            <Icon name="credit-card" />
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
            <Icon name="settings-01" />
            <span>Settings</span>
            <CommandShortcut hotkey="Mod+S" />
          </>
        ),
      },
    ],
  },
];

export default function CommandDemo() {
  return (
    <Command items={commandGroups} className="md:min-w-[450px]">
      <CommandInput aria-label="Search commands" placeholder="Type a command or search..." />
      <CommandEmpty>No results found.</CommandEmpty>
      <CommandList>
        {(group: (typeof commandGroups)[number]) => (
          <CommandGroup key={group.label} items={group.items}>
            <CommandGroupLabel>{group.label}</CommandGroupLabel>
            <CommandCollection>
              {(item: (typeof commandGroups)[number]["items"][number]) => (
                <CommandItem key={item.label} value={item} disabled={item.disabled}>
                  {item.content}
                </CommandItem>
              )}
            </CommandCollection>
          </CommandGroup>
        )}
      </CommandList>
    </Command>
  );
}
