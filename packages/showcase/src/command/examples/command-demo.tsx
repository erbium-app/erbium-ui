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
    items: [
      {
        content: (
          <>
            <Icon name="calendar-01" />
            <span>Calendar</span>
          </>
        ),
        disabled: false,
        label: "Calendar",
      },
      {
        content: (
          <>
            <Icon name="smile" />
            <span>Search Emoji</span>
          </>
        ),
        disabled: false,
        label: "Search Emoji",
      },
      {
        content: (
          <>
            <Icon name="calculator" />
            <span>Calculator</span>
          </>
        ),
        disabled: true,
        label: "Calculator",
      },
    ],
    label: "Suggestions",
  },
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

const CommandDemo = () => (
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

export default CommandDemo;
