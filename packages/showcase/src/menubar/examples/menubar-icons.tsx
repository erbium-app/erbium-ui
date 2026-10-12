import { Icon } from "@erbium/ui/components/icon";

import {
  Menubar,
  MenubarContent,
  MenubarGroup,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarShortcut,
  MenubarTrigger,
  MenubarList,
} from "@erbium/ui/components/menubar";

export function MenubarIcons() {
  return (
    <Menubar className="w-72">
      <MenubarMenu>
        <MenubarTrigger>File</MenubarTrigger>
        <MenubarContent>
          <MenubarList>
            <MenubarItem>
              <Icon name="file-01" />
              New File <MenubarShortcut hotkey="Mod+N" />
            </MenubarItem>
            <MenubarItem>
              <Icon name="folder-01" />
              Open Folder
            </MenubarItem>
            <MenubarSeparator />
            <MenubarItem>
              <Icon name="save" />
              Save <MenubarShortcut hotkey="Mod+S" />
            </MenubarItem>
          </MenubarList>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>More</MenubarTrigger>
        <MenubarContent>
          <MenubarList>
            <MenubarGroup>
              <MenubarItem>
                <Icon name="settings-01" />
                Settings
              </MenubarItem>
              <MenubarItem>
                <Icon name="help-circle" />
                Help
              </MenubarItem>
              <MenubarSeparator />
              <MenubarItem variant="error">
                <Icon name="trash" />
                Delete
              </MenubarItem>
            </MenubarGroup>
          </MenubarList>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  );
}
