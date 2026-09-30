import * as React from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import BellIcon from "@hugeicons/core-free-icons/BellIcon";
import CalculatorIcon from "@hugeicons/core-free-icons/CalculatorIcon";
import Calendar01Icon from "@hugeicons/core-free-icons/Calendar01Icon";
import ClipboardPasteIcon from "@hugeicons/core-free-icons/ClipboardPasteIcon";
import CodeIcon from "@hugeicons/core-free-icons/CodeIcon";
import CopyIcon from "@hugeicons/core-free-icons/CopyIcon";
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
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@erbium/ui/components/command";

export function CommandManyItems() {
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
            <CommandGroup heading="Navigation">
              <CommandItem>
                <HugeiconsIcon icon={Home01Icon} />
                <span>Home</span>
                <CommandShortcut hotkey="Mod+H" />
              </CommandItem>
              <CommandItem>
                <HugeiconsIcon icon={InboxIcon} />
                <span>Inbox</span>
                <CommandShortcut hotkey="Mod+I" />
              </CommandItem>
              <CommandItem>
                <HugeiconsIcon icon={FileTextIcon} />
                <span>Documents</span>
                <CommandShortcut hotkey="Mod+D" />
              </CommandItem>
              <CommandItem>
                <HugeiconsIcon icon={Folder01Icon} />
                <span>Folders</span>
                <CommandShortcut hotkey="Mod+F" />
              </CommandItem>
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup heading="Actions">
              <CommandItem>
                <HugeiconsIcon icon={PlusIcon} />
                <span>New File</span>
                <CommandShortcut hotkey="Mod+N" />
              </CommandItem>
              <CommandItem>
                <HugeiconsIcon icon={FolderPlusIcon} />
                <span>New Folder</span>
                <CommandShortcut hotkey="Shift+Mod+N" />
              </CommandItem>
              <CommandItem>
                <HugeiconsIcon icon={CopyIcon} />
                <span>Copy</span>
                <CommandShortcut hotkey="Mod+C" />
              </CommandItem>
              <CommandItem>
                <HugeiconsIcon icon={ScissorsIcon} />
                <span>Cut</span>
                <CommandShortcut hotkey="Mod+X" />
              </CommandItem>
              <CommandItem>
                <HugeiconsIcon icon={ClipboardPasteIcon} />
                <span>Paste</span>
                <CommandShortcut hotkey="Mod+V" />
              </CommandItem>
              <CommandItem>
                <HugeiconsIcon icon={TrashIcon} />
                <span>Delete</span>
                <CommandShortcut hotkey="Backspace" />
              </CommandItem>
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup heading="View">
              <CommandItem>
                <HugeiconsIcon icon={LayoutGridIcon} />
                <span>Grid View</span>
              </CommandItem>
              <CommandItem>
                <HugeiconsIcon icon={ListIcon} />
                <span>List View</span>
              </CommandItem>
              <CommandItem>
                <HugeiconsIcon icon={ZoomInIcon} />
                <span>Zoom In</span>
                <CommandShortcut hotkey="Mod+Plus" />
              </CommandItem>
              <CommandItem>
                <HugeiconsIcon icon={ZoomOutIcon} />
                <span>Zoom Out</span>
                <CommandShortcut hotkey="Mod+-" />
              </CommandItem>
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup heading="Account">
              <CommandItem>
                <HugeiconsIcon icon={UserIcon} />
                <span>Profile</span>
                <CommandShortcut hotkey="Mod+P" />
              </CommandItem>
              <CommandItem>
                <HugeiconsIcon icon={CreditCardIcon} />
                <span>Billing</span>
                <CommandShortcut hotkey="Mod+B" />
              </CommandItem>
              <CommandItem>
                <HugeiconsIcon icon={Settings01Icon} />
                <span>Settings</span>
                <CommandShortcut hotkey="Mod+S" />
              </CommandItem>
              <CommandItem>
                <HugeiconsIcon icon={BellIcon} />
                <span>Notifications</span>
              </CommandItem>
              <CommandItem>
                <HugeiconsIcon icon={HelpCircleIcon} />
                <span>Help & Support</span>
              </CommandItem>
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup heading="Tools">
              <CommandItem>
                <HugeiconsIcon icon={CalculatorIcon} />
                <span>Calculator</span>
              </CommandItem>
              <CommandItem>
                <HugeiconsIcon icon={Calendar01Icon} />
                <span>Calendar</span>
              </CommandItem>
              <CommandItem>
                <HugeiconsIcon icon={Image01Icon} />
                <span>Image Editor</span>
              </CommandItem>
              <CommandItem>
                <HugeiconsIcon icon={CodeIcon} />
                <span>Code Editor</span>
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </CommandDialog>
    </div>
  );
}
