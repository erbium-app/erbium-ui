import {
  Menubar,
  MenubarCheckboxItem,
  MenubarContent,
  MenubarGroup,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarShortcut,
  MenubarTrigger,
  MenubarList,
} from "@erbium/ui/components/menubar";

export function MenubarCheckbox() {
  return (
    <Menubar className="w-72">
      <MenubarMenu>
        <MenubarTrigger>View</MenubarTrigger>
        <MenubarContent className="w-64">
          <MenubarList>
            <MenubarGroup>
              <MenubarCheckboxItem>Always Show Bookmarks Bar</MenubarCheckboxItem>
              <MenubarCheckboxItem checked>Always Show Full URLs</MenubarCheckboxItem>
            </MenubarGroup>
            <MenubarSeparator />
            <MenubarItem inset>
              Reload <MenubarShortcut hotkey="Mod+R" />
            </MenubarItem>
            <MenubarItem disabled inset>
              Force Reload <MenubarShortcut hotkey="Shift+Mod+R" />
            </MenubarItem>
          </MenubarList>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>Format</MenubarTrigger>
        <MenubarContent>
          <MenubarList>
            <MenubarGroup>
              <MenubarCheckboxItem checked>Strikethrough</MenubarCheckboxItem>
              <MenubarCheckboxItem>Code</MenubarCheckboxItem>
              <MenubarCheckboxItem>Superscript</MenubarCheckboxItem>
            </MenubarGroup>
          </MenubarList>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  );
}
