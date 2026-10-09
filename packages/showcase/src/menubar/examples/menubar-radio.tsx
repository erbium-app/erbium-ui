import * as React from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import Sun03Icon from "@hugeicons/core-free-icons/Sun03Icon";
import Moon02Icon from "@hugeicons/core-free-icons/Moon02Icon";

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

export function MenubarRadio() {
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
                <HugeiconsIcon icon={Sun03Icon} />
                Light
              </MenubarRadioItem>
              <MenubarRadioItem value="dark">
                <HugeiconsIcon icon={Moon02Icon} />
                Dark
              </MenubarRadioItem>
            </MenubarRadioGroup>
          </MenubarList>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  );
}
