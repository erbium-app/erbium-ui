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
            <Icon name="home-01" />
            <span>Home</span>
            <CommandShortcut hotkey="Mod+H" />
          </>
        ),
        disabled: false,
        label: "Home",
      },
      {
        content: (
          <>
            <Icon name="inbox" />
            <span>Inbox</span>
            <CommandShortcut hotkey="Mod+I" />
          </>
        ),
        disabled: false,
        label: "Inbox",
      },
      {
        content: (
          <>
            <Icon name="file-text" />
            <span>Documents</span>
            <CommandShortcut hotkey="Mod+D" />
          </>
        ),
        disabled: false,
        label: "Documents",
      },
      {
        content: (
          <>
            <Icon name="folder-01" />
            <span>Folders</span>
            <CommandShortcut hotkey="Mod+F" />
          </>
        ),
        disabled: false,
        label: "Folders",
      },
    ],
    label: "Navigation",
  },
  {
    items: [
      {
        content: (
          <>
            <Icon name="plus" />
            <span>New File</span>
            <CommandShortcut hotkey="Mod+N" />
          </>
        ),
        disabled: false,
        label: "New File",
      },
      {
        content: (
          <>
            <Icon name="folder-plus" />
            <span>New Folder</span>
            <CommandShortcut hotkey="Mod+Shift+N" />
          </>
        ),
        disabled: false,
        label: "New Folder",
      },
      {
        content: (
          <>
            <Icon name="file-text" />
            <span>Duplicate file</span>
            <CommandShortcut hotkey="Mod+D" />
          </>
        ),
        disabled: false,
        label: "Duplicate file",
      },
      {
        content: (
          <>
            <Icon name="scissors" />
            <span>Cut</span>
            <CommandShortcut hotkey="Mod+X" />
          </>
        ),
        disabled: false,
        label: "Cut",
      },
      {
        content: (
          <>
            <Icon name="clipboard-paste" />
            <span>Paste</span>
            <CommandShortcut hotkey="Mod+V" />
          </>
        ),
        disabled: false,
        label: "Paste",
      },
      {
        content: (
          <>
            <Icon name="trash" />
            <span>Delete</span>
            <CommandShortcut hotkey="Backspace" />
          </>
        ),
        disabled: false,
        label: "Delete",
      },
    ],
    label: "Actions",
  },
  {
    items: [
      {
        content: (
          <>
            <Icon name="layout-grid" />
            <span>Grid View</span>
          </>
        ),
        disabled: false,
        label: "Grid View",
      },
      {
        content: (
          <>
            <Icon name="list" />
            <span>List View</span>
          </>
        ),
        disabled: false,
        label: "List View",
      },
      {
        content: (
          <>
            <Icon name="zoom-in" />
            <span>Zoom In</span>
            <CommandShortcut hotkey="Mod++" />
          </>
        ),
        disabled: false,
        label: "Zoom In",
      },
      {
        content: (
          <>
            <Icon name="zoom-out" />
            <span>Zoom Out</span>
            <CommandShortcut hotkey="Mod+-" />
          </>
        ),
        disabled: false,
        label: "Zoom Out",
      },
    ],
    label: "View",
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
      {
        content: (
          <>
            <Icon name="bell" />
            <span>Notifications</span>
          </>
        ),
        disabled: false,
        label: "Notifications",
      },
      {
        content: (
          <>
            <Icon name="help-circle" />
            <span>Help & Support</span>
          </>
        ),
        disabled: false,
        label: "Help & Support",
      },
    ],
    label: "Account",
  },
  {
    items: [
      {
        content: (
          <>
            <Icon name="calculator" />
            <span>Calculator</span>
          </>
        ),
        disabled: false,
        label: "Calculator",
      },
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
            <Icon name="image-01" />
            <span>Image Editor</span>
          </>
        ),
        disabled: false,
        label: "Image Editor",
      },
      {
        content: (
          <>
            <Icon name="code" />
            <span>Code Editor</span>
          </>
        ),
        disabled: false,
        label: "Code Editor",
      },
    ],
    label: "Tools",
  },
];

export const CommandManyItems = () => {
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
};
