import * as React from "react";
import { Icon } from "@erbium/ui/components/icon";

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
  DropdownMenuList,
} from "@erbium/ui/components/dropdown-menu";

export const DropdownMenuComplex = () => {
  const [notifications, setNotifications] = React.useState({
    email: true,
    push: true,
    sms: false,
  });

  const [theme, setTheme] = React.useState("light");

  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button variant="outline" />}>Complex Menu</DropdownMenuTrigger>
      <DropdownMenuContent className="w-44">
        <DropdownMenuList>
          <DropdownMenuGroup>
            <DropdownMenuLabel>File</DropdownMenuLabel>
            <DropdownMenuItem>
              <Icon name="file-01" />
              New File
              <DropdownMenuShortcut hotkey="Mod+N" />
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Icon name="folder-01" />
              New Folder
              <DropdownMenuShortcut hotkey="Shift+Mod+N" />
            </DropdownMenuItem>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>
                <Icon name="folder-open" />
                Open Recent
              </DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent>
                  <DropdownMenuList>
                    <DropdownMenuGroup>
                      <DropdownMenuLabel>Recent Projects</DropdownMenuLabel>
                      <DropdownMenuItem>
                        <Icon name="file-code" />
                        Project Alpha
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Icon name="file-code" />
                        Project Beta
                      </DropdownMenuItem>
                      <DropdownMenuSub>
                        <DropdownMenuSubTrigger>
                          <Icon name="more-horizontal" />
                          More Projects
                        </DropdownMenuSubTrigger>
                        <DropdownMenuPortal>
                          <DropdownMenuSubContent>
                            <DropdownMenuList>
                              <DropdownMenuItem>
                                <Icon name="file-code" />
                                Project Gamma
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Icon name="file-code" />
                                Project Delta
                              </DropdownMenuItem>
                            </DropdownMenuList>
                          </DropdownMenuSubContent>
                        </DropdownMenuPortal>
                      </DropdownMenuSub>
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                      <DropdownMenuItem>
                        <Icon name="folder-search" />
                        Browse...
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                  </DropdownMenuList>
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Icon name="save" />
              Save
              <DropdownMenuShortcut hotkey="Mod+S" />
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Icon name="download-01" />
              Export
              <DropdownMenuShortcut hotkey="Shift+Mod+E" />
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuLabel>View</DropdownMenuLabel>
            <DropdownMenuCheckboxItem
              checked={notifications.email}
              onCheckedChange={(checked) => {
                setNotifications({ ...notifications, email: checked });
              }}
            >
              <Icon name="eye" />
              Show Sidebar
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={notifications.sms}
              onCheckedChange={(checked) => {
                setNotifications({ ...notifications, sms: checked });
              }}
            >
              <Icon name="layout-01" />
              Show Status Bar
            </DropdownMenuCheckboxItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuLabel>Theme</DropdownMenuLabel>
            <DropdownMenuRadioGroup value={theme} onValueChange={setTheme}>
              <DropdownMenuRadioItem value="light">
                <Icon name="sun-03" />
                Light
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="dark">
                <Icon name="moon-02" />
                Dark
              </DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuLabel>Account</DropdownMenuLabel>
            <DropdownMenuItem>
              <Icon name="user" />
              Profile
              <DropdownMenuShortcut hotkey="Shift+Mod+P" />
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Icon name="credit-card" />
              Billing
            </DropdownMenuItem>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>
                <Icon name="settings-01" />
                Settings
              </DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent>
                  <DropdownMenuList>
                    <DropdownMenuGroup>
                      <DropdownMenuLabel>Preferences</DropdownMenuLabel>
                      <DropdownMenuItem>
                        <Icon name="keyboard" />
                        Keyboard Shortcuts
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Icon name="languages" />
                        Language
                      </DropdownMenuItem>
                      <DropdownMenuSub>
                        <DropdownMenuSubTrigger>
                          <Icon name="bell" />
                          Notifications
                        </DropdownMenuSubTrigger>
                        <DropdownMenuPortal>
                          <DropdownMenuSubContent>
                            <DropdownMenuList>
                              <DropdownMenuGroup>
                                <DropdownMenuLabel>Notification Types</DropdownMenuLabel>
                                <DropdownMenuCheckboxItem
                                  checked={notifications.push}
                                  onCheckedChange={(checked) => {
                                    setNotifications({
                                      ...notifications,
                                      push: checked,
                                    });
                                  }}
                                >
                                  <Icon name="bell" />
                                  Push Notifications
                                </DropdownMenuCheckboxItem>
                                <DropdownMenuCheckboxItem
                                  checked={notifications.email}
                                  onCheckedChange={(checked) => {
                                    setNotifications({
                                      ...notifications,
                                      email: checked,
                                    });
                                  }}
                                >
                                  <Icon name="mail-01" />
                                  Email Notifications
                                </DropdownMenuCheckboxItem>
                              </DropdownMenuGroup>
                            </DropdownMenuList>
                          </DropdownMenuSubContent>
                        </DropdownMenuPortal>
                      </DropdownMenuSub>
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                      <DropdownMenuItem>
                        <Icon name="shield-01" />
                        Privacy & Security
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                  </DropdownMenuList>
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem>
              <Icon name="help-circle" />
              Help & Support
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Icon name="file-text" />
              Documentation
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem variant="error">
              <Icon name="log-out" />
              Sign Out
              <DropdownMenuShortcut hotkey="Shift+Mod+Q" />
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuList>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
