import { CopyButton, CopyButtonIcon } from "@erbium/ui/blocks/copy-button";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarShortcut,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarTrigger,
  MenubarList,
} from "@erbium/ui/components/menubar";

export const MenubarSubmenu = () => (
  <Menubar className="w-72">
    <MenubarMenu>
      <MenubarTrigger>File</MenubarTrigger>
      <MenubarContent>
        <MenubarList>
          <MenubarSub>
            <MenubarSubTrigger>Share</MenubarSubTrigger>
            <MenubarSubContent>
              <MenubarList>
                <MenubarItem>Email link</MenubarItem>
                <MenubarItem>Messages</MenubarItem>
                <MenubarItem>Notes</MenubarItem>
              </MenubarList>
            </MenubarSubContent>
          </MenubarSub>
          <MenubarSeparator />
          <MenubarItem>
            Print... <MenubarShortcut hotkey="Mod+P" />
          </MenubarItem>
        </MenubarList>
      </MenubarContent>
    </MenubarMenu>
    <MenubarMenu>
      <MenubarTrigger>Edit</MenubarTrigger>
      <MenubarContent>
        <MenubarList>
          <MenubarItem>
            Undo <MenubarShortcut hotkey="Mod+Z" />
          </MenubarItem>
          <MenubarItem>
            Redo <MenubarShortcut hotkey="Mod+Shift+Z" />
          </MenubarItem>
          <MenubarSeparator />
          <MenubarSub>
            <MenubarSubTrigger>Find</MenubarSubTrigger>
            <MenubarSubContent>
              <MenubarList>
                <MenubarItem>Find...</MenubarItem>
                <MenubarItem>Find Next</MenubarItem>
                <MenubarItem>Find Previous</MenubarItem>
              </MenubarList>
            </MenubarSubContent>
          </MenubarSub>
          <MenubarSeparator />
          <MenubarItem>Cut</MenubarItem>
          <CopyButton value="Erbium UI" render={<MenubarItem />}>
            <CopyButtonIcon />
            <span>Copy</span>
          </CopyButton>
          <MenubarItem>Paste</MenubarItem>
        </MenubarList>
      </MenubarContent>
    </MenubarMenu>
  </Menubar>
);
