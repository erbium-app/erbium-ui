import { HugeiconsIcon } from "@hugeicons/react";
import File01Icon from "@hugeicons/core-free-icons/File01Icon";
import Folder01Icon from "@hugeicons/core-free-icons/Folder01Icon";
import HelpCircleIcon from "@hugeicons/core-free-icons/HelpCircleIcon";
import SaveIcon from "@hugeicons/core-free-icons/SaveIcon";
import Settings01Icon from "@hugeicons/core-free-icons/Settings01Icon";
import TrashIcon from "@hugeicons/core-free-icons/TrashIcon";

import {
  Menubar,
  MenubarContent,
  MenubarGroup,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarShortcut,
  MenubarTrigger,
} from "@erbium/ui/components/menubar";

export function MenubarIcons() {
  return (
    <Menubar className="w-72">
      <MenubarMenu>
        <MenubarTrigger>File</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>
            <HugeiconsIcon icon={File01Icon} />
            New File <MenubarShortcut>⌘N</MenubarShortcut>
          </MenubarItem>
          <MenubarItem>
            <HugeiconsIcon icon={Folder01Icon} />
            Open Folder
          </MenubarItem>
          <MenubarSeparator />
          <MenubarItem>
            <HugeiconsIcon icon={SaveIcon} />
            Save <MenubarShortcut>⌘S</MenubarShortcut>
          </MenubarItem>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>More</MenubarTrigger>
        <MenubarContent>
          <MenubarGroup>
            <MenubarItem>
              <HugeiconsIcon icon={Settings01Icon} />
              Settings
            </MenubarItem>
            <MenubarItem>
              <HugeiconsIcon icon={HelpCircleIcon} />
              Help
            </MenubarItem>
            <MenubarSeparator />
            <MenubarItem variant="destructive">
              <HugeiconsIcon icon={TrashIcon} />
              Delete
            </MenubarItem>
          </MenubarGroup>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  );
}
