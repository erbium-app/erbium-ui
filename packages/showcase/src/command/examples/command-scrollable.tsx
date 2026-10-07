import * as React from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import BellIcon from "@hugeicons/core-free-icons/BellIcon";
import CalculatorIcon from "@hugeicons/core-free-icons/CalculatorIcon";
import Calendar01Icon from "@hugeicons/core-free-icons/Calendar01Icon";
import ClipboardPasteIcon from "@hugeicons/core-free-icons/ClipboardPasteIcon";
import CodeIcon from "@hugeicons/core-free-icons/CodeIcon";
import CreditCardIcon from "@hugeicons/core-free-icons/CreditCardIcon";
import FileTextIcon from "@hugeicons/core-free-icons/FileTextIcon";
import Folder01Icon from "@hugeicons/core-free-icons/Folder01Icon";
import FolderPlusIcon from "@hugeicons/core-free-icons/FolderPlusIcon";
import HelpCircleIcon from "@hugeicons/core-free-icons/HelpCircleIcon";
import Home01Icon from "@hugeicons/core-free-icons/Home01Icon";
import Image01Icon from "@hugeicons/core-free-icons/Image01Icon";
import InboxIcon from "@hugeicons/core-free-icons/InboxIcon";
import LayoutGridIcon from "@hugeicons/core-free-icons/LayoutGridIcon";
import ListIcon from "@hugeicons/core-free-icons/ListIcon";
import PlusIcon from "@hugeicons/core-free-icons/PlusIcon";
import ScissorsIcon from "@hugeicons/core-free-icons/ScissorsIcon";
import Settings01Icon from "@hugeicons/core-free-icons/Settings01Icon";
import TrashIcon from "@hugeicons/core-free-icons/TrashIcon";
import UserIcon from "@hugeicons/core-free-icons/UserIcon";
import ZoomInIcon from "@hugeicons/core-free-icons/ZoomInIcon";
import ZoomOutIcon from "@hugeicons/core-free-icons/ZoomOutIcon";

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
            <HugeiconsIcon icon={Home01Icon} />
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
            <HugeiconsIcon icon={InboxIcon} />
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
            <HugeiconsIcon icon={FileTextIcon} />
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
            <HugeiconsIcon icon={Folder01Icon} />
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
            <HugeiconsIcon icon={PlusIcon} />
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
            <HugeiconsIcon icon={FolderPlusIcon} />
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
            <HugeiconsIcon icon={FileTextIcon} />
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
            <HugeiconsIcon icon={ScissorsIcon} />
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
            <HugeiconsIcon icon={ClipboardPasteIcon} />
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
            <HugeiconsIcon icon={TrashIcon} />
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
            <HugeiconsIcon icon={LayoutGridIcon} />
            <span>Grid View</span>
          </>
        ),
      },
      {
        label: "List View",
        disabled: false,
        content: (
          <>
            <HugeiconsIcon icon={ListIcon} />
            <span>List View</span>
          </>
        ),
      },
      {
        label: "Zoom In",
        disabled: false,
        content: (
          <>
            <HugeiconsIcon icon={ZoomInIcon} />
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
            <HugeiconsIcon icon={ZoomOutIcon} />
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
      {
        label: "Notifications",
        disabled: false,
        content: (
          <>
            <HugeiconsIcon icon={BellIcon} />
            <span>Notifications</span>
          </>
        ),
      },
      {
        label: "Help & Support",
        disabled: false,
        content: (
          <>
            <HugeiconsIcon icon={HelpCircleIcon} />
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
            <HugeiconsIcon icon={CalculatorIcon} />
            <span>Calculator</span>
          </>
        ),
      },
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
        label: "Image Editor",
        disabled: false,
        content: (
          <>
            <HugeiconsIcon icon={Image01Icon} />
            <span>Image Editor</span>
          </>
        ),
      },
      {
        label: "Code Editor",
        disabled: false,
        content: (
          <>
            <HugeiconsIcon icon={CodeIcon} />
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
