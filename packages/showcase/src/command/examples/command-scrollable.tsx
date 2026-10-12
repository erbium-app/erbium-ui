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
    label: "Navigation",
    items: [
      {
        label: "Home",
        disabled: false,
        content: (
          <>
            <Icon name="home-01" />
            <span>Home</span>
            <CommandShortcut hotkey="Mod+H" />
          </>
        ),
      },
      {
        label: "Inbox",
        disabled: false,
        content: (
          <>
            <Icon name="inbox" />
            <span>Inbox</span>
            <CommandShortcut hotkey="Mod+I" />
          </>
        ),
      },
      {
        label: "Documents",
        disabled: false,
        content: (
          <>
            <Icon name="file-text" />
            <span>Documents</span>
            <CommandShortcut hotkey="Mod+D" />
          </>
        ),
      },
      {
        label: "Folders",
        disabled: false,
        content: (
          <>
            <Icon name="folder-01" />
            <span>Folders</span>
            <CommandShortcut hotkey="Mod+F" />
          </>
        ),
      },
    ],
  },
  {
    label: "Actions",
    items: [
      {
        label: "New File",
        disabled: false,
        content: (
          <>
            <Icon name="plus" />
            <span>New File</span>
            <CommandShortcut hotkey="Mod+N" />
          </>
        ),
      },
      {
        label: "New Folder",
        disabled: false,
        content: (
          <>
            <Icon name="folder-plus" />
            <span>New Folder</span>
            <CommandShortcut hotkey="Shift+Mod+N" />
          </>
        ),
      },
      {
        label: "Duplicate file",
        disabled: false,
        content: (
          <>
            <Icon name="file-text" />
            <span>Duplicate file</span>
            <CommandShortcut hotkey="Mod+D" />
          </>
        ),
      },
      {
        label: "Cut",
        disabled: false,
        content: (
          <>
            <Icon name="scissors" />
            <span>Cut</span>
            <CommandShortcut hotkey="Mod+X" />
          </>
        ),
      },
      {
        label: "Paste",
        disabled: false,
        content: (
          <>
            <Icon name="clipboard-paste" />
            <span>Paste</span>
            <CommandShortcut hotkey="Mod+V" />
          </>
        ),
      },
      {
        label: "Delete",
        disabled: false,
        content: (
          <>
            <Icon name="trash" />
            <span>Delete</span>
            <CommandShortcut hotkey="Backspace" />
          </>
        ),
      },
    ],
  },
  {
    label: "View",
    items: [
      {
        label: "Grid View",
        disabled: false,
        content: (
          <>
            <Icon name="layout-grid" />
            <span>Grid View</span>
          </>
        ),
      },
      {
        label: "List View",
        disabled: false,
        content: (
          <>
            <Icon name="list" />
            <span>List View</span>
          </>
        ),
      },
      {
        label: "Zoom In",
        disabled: false,
        content: (
          <>
            <Icon name="zoom-in" />
            <span>Zoom In</span>
            <CommandShortcut hotkey="Mod+Plus" />
          </>
        ),
      },
      {
        label: "Zoom Out",
        disabled: false,
        content: (
          <>
            <Icon name="zoom-out" />
            <span>Zoom Out</span>
            <CommandShortcut hotkey="Mod+-" />
          </>
        ),
      },
    ],
  },
  {
    label: "Account",
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
      {
        label: "Notifications",
        disabled: false,
        content: (
          <>
            <Icon name="bell" />
            <span>Notifications</span>
          </>
        ),
      },
      {
        label: "Help & Support",
        disabled: false,
        content: (
          <>
            <Icon name="help-circle" />
            <span>Help & Support</span>
          </>
        ),
      },
    ],
  },
  {
    label: "Tools",
    items: [
      {
        label: "Calculator",
        disabled: false,
        content: (
          <>
            <Icon name="calculator" />
            <span>Calculator</span>
          </>
        ),
      },
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
        label: "Image Editor",
        disabled: false,
        content: (
          <>
            <Icon name="image-01" />
            <span>Image Editor</span>
          </>
        ),
      },
      {
        label: "Code Editor",
        disabled: false,
        content: (
          <>
            <Icon name="code" />
            <span>Code Editor</span>
          </>
        ),
      },
    ],
  },
];

export function CommandManyItems() {
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
