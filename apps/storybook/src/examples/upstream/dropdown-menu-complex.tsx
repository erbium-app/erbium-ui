import * as React from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import BellIcon from "@hugeicons/core-free-icons/BellIcon";
import CreditCardIcon from "@hugeicons/core-free-icons/CreditCardIcon";
import Download01Icon from "@hugeicons/core-free-icons/Download01Icon";
import EyeIcon from "@hugeicons/core-free-icons/EyeIcon";
import File01Icon from "@hugeicons/core-free-icons/File01Icon";
import FileCodeIcon from "@hugeicons/core-free-icons/FileCodeIcon";
import FileTextIcon from "@hugeicons/core-free-icons/FileTextIcon";
import Folder01Icon from "@hugeicons/core-free-icons/Folder01Icon";
import FolderOpenIcon from "@hugeicons/core-free-icons/FolderOpenIcon";
import FolderSearchIcon from "@hugeicons/core-free-icons/FolderSearchIcon";
import HelpCircleIcon from "@hugeicons/core-free-icons/HelpCircleIcon";
import KeyboardIcon from "@hugeicons/core-free-icons/KeyboardIcon";
import LanguagesIcon from "@hugeicons/core-free-icons/LanguagesIcon";
import Layout01Icon from "@hugeicons/core-free-icons/Layout01Icon";
import LogOutIcon from "@hugeicons/core-free-icons/LogOutIcon";
import Mail01Icon from "@hugeicons/core-free-icons/Mail01Icon";
import MonitorIcon from "@hugeicons/core-free-icons/MonitorIcon";
import MoonIcon from "@hugeicons/core-free-icons/MoonIcon";
import MoreHorizontalIcon from "@hugeicons/core-free-icons/MoreHorizontalIcon";
import PaletteIcon from "@hugeicons/core-free-icons/PaletteIcon";
import SaveIcon from "@hugeicons/core-free-icons/SaveIcon";
import Settings01Icon from "@hugeicons/core-free-icons/Settings01Icon";
import Shield01Icon from "@hugeicons/core-free-icons/Shield01Icon";
import Sun01Icon from "@hugeicons/core-free-icons/Sun01Icon";
import UserIcon from "@hugeicons/core-free-icons/UserIcon";

import { Button } from "@erbium/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@erbium/ui/components/dropdown-menu";

export function DropdownMenuComplex() {
  const [notifications, setNotifications] = React.useState({
    email: true,
    sms: false,
    push: true,
  });
  const [theme, setTheme] = React.useState("light");

  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button variant="outline" />}>Complex Menu</DropdownMenuTrigger>
      <DropdownMenuContent className="w-44">
        <DropdownMenuGroup>
          <DropdownMenuLabel>File</DropdownMenuLabel>
          <DropdownMenuItem>
            <HugeiconsIcon icon={File01Icon} />
            New File
            <DropdownMenuShortcut>⌘N</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <HugeiconsIcon icon={Folder01Icon} />
            New Folder
            <DropdownMenuShortcut>⇧⌘N</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <HugeiconsIcon icon={FolderOpenIcon} />
              Open Recent
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent>
                <DropdownMenuGroup>
                  <DropdownMenuLabel>Recent Projects</DropdownMenuLabel>
                  <DropdownMenuItem>
                    <HugeiconsIcon icon={FileCodeIcon} />
                    Project Alpha
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <HugeiconsIcon icon={FileCodeIcon} />
                    Project Beta
                  </DropdownMenuItem>
                  <DropdownMenuSub>
                    <DropdownMenuSubTrigger>
                      <HugeiconsIcon icon={MoreHorizontalIcon} />
                      More Projects
                    </DropdownMenuSubTrigger>
                    <DropdownMenuPortal>
                      <DropdownMenuSubContent>
                        <DropdownMenuItem>
                          <HugeiconsIcon icon={FileCodeIcon} />
                          Project Gamma
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <HugeiconsIcon icon={FileCodeIcon} />
                          Project Delta
                        </DropdownMenuItem>
                      </DropdownMenuSubContent>
                    </DropdownMenuPortal>
                  </DropdownMenuSub>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem>
                    <HugeiconsIcon icon={FolderSearchIcon} />
                    Browse...
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <HugeiconsIcon icon={SaveIcon} />
            Save
            <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <HugeiconsIcon icon={Download01Icon} />
            Export
            <DropdownMenuShortcut>⇧⌘E</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuLabel>View</DropdownMenuLabel>
          <DropdownMenuCheckboxItem
            checked={notifications.email}
            onCheckedChange={(checked) =>
              setNotifications({ ...notifications, email: checked === true })
            }
          >
            <HugeiconsIcon icon={EyeIcon} />
            Show Sidebar
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem
            checked={notifications.sms}
            onCheckedChange={(checked) =>
              setNotifications({ ...notifications, sms: checked === true })
            }
          >
            <HugeiconsIcon icon={Layout01Icon} />
            Show Status Bar
          </DropdownMenuCheckboxItem>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <HugeiconsIcon icon={PaletteIcon} />
              Theme
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent>
                <DropdownMenuGroup>
                  <DropdownMenuLabel>Appearance</DropdownMenuLabel>
                  <DropdownMenuRadioGroup value={theme} onValueChange={setTheme}>
                    <DropdownMenuRadioItem value="light">
                      <HugeiconsIcon icon={Sun01Icon} />
                      Light
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="dark">
                      <HugeiconsIcon icon={MoonIcon} />
                      Dark
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="system">
                      <HugeiconsIcon icon={MonitorIcon} />
                      System
                    </DropdownMenuRadioItem>
                  </DropdownMenuRadioGroup>
                </DropdownMenuGroup>
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuLabel>Account</DropdownMenuLabel>
          <DropdownMenuItem>
            <HugeiconsIcon icon={UserIcon} />
            Profile
            <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <HugeiconsIcon icon={CreditCardIcon} />
            Billing
          </DropdownMenuItem>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <HugeiconsIcon icon={Settings01Icon} />
              Settings
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent>
                <DropdownMenuGroup>
                  <DropdownMenuLabel>Preferences</DropdownMenuLabel>
                  <DropdownMenuItem>
                    <HugeiconsIcon icon={KeyboardIcon} />
                    Keyboard Shortcuts
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <HugeiconsIcon icon={LanguagesIcon} />
                    Language
                  </DropdownMenuItem>
                  <DropdownMenuSub>
                    <DropdownMenuSubTrigger>
                      <HugeiconsIcon icon={BellIcon} />
                      Notifications
                    </DropdownMenuSubTrigger>
                    <DropdownMenuPortal>
                      <DropdownMenuSubContent>
                        <DropdownMenuGroup>
                          <DropdownMenuLabel>Notification Types</DropdownMenuLabel>
                          <DropdownMenuCheckboxItem
                            checked={notifications.push}
                            onCheckedChange={(checked) =>
                              setNotifications({
                                ...notifications,
                                push: checked === true,
                              })
                            }
                          >
                            <HugeiconsIcon icon={BellIcon} />
                            Push Notifications
                          </DropdownMenuCheckboxItem>
                          <DropdownMenuCheckboxItem
                            checked={notifications.email}
                            onCheckedChange={(checked) =>
                              setNotifications({
                                ...notifications,
                                email: checked === true,
                              })
                            }
                          >
                            <HugeiconsIcon icon={Mail01Icon} />
                            Email Notifications
                          </DropdownMenuCheckboxItem>
                        </DropdownMenuGroup>
                      </DropdownMenuSubContent>
                    </DropdownMenuPortal>
                  </DropdownMenuSub>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem>
                    <HugeiconsIcon icon={Shield01Icon} />
                    Privacy & Security
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <HugeiconsIcon icon={HelpCircleIcon} />
            Help & Support
          </DropdownMenuItem>
          <DropdownMenuItem>
            <HugeiconsIcon icon={FileTextIcon} />
            Documentation
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem variant="destructive">
            <HugeiconsIcon icon={LogOutIcon} />
            Sign Out
            <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
