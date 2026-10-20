import * as React from "react";
import { Icon } from "@erbium/ui/components/icon";

import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarSeparator,
  MenubarTrigger,
  MenubarList,
} from "@erbium/ui/components/menubar";

export const MenubarRadio = () => {
  const [user, setUser] = React.useState("benoit");
  const [theme, setTheme] = React.useState("light");

  return (
    <Menubar className="w-72">
      <MenubarMenu>
        <MenubarTrigger>Profiles</MenubarTrigger>
        <MenubarContent>
          <MenubarList>
            <MenubarRadioGroup value={user} onValueChange={setUser}>
              <MenubarRadioItem value="andy">Andy</MenubarRadioItem>
              <MenubarRadioItem value="benoit">Benoit</MenubarRadioItem>
              <MenubarRadioItem value="luis">Luis</MenubarRadioItem>
            </MenubarRadioGroup>
            <MenubarSeparator />
            <MenubarItem inset>Edit...</MenubarItem>
            <MenubarItem inset>Add Profile...</MenubarItem>
          </MenubarList>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>Theme</MenubarTrigger>
        <MenubarContent>
          <MenubarList>
            <MenubarRadioGroup value={theme} onValueChange={setTheme}>
              <MenubarRadioItem value="light">
                <Icon name="sun-03" />
                Light
              </MenubarRadioItem>
              <MenubarRadioItem value="dark">
                <Icon name="moon-02" />
                Dark
              </MenubarRadioItem>
            </MenubarRadioGroup>
          </MenubarList>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  );
};
