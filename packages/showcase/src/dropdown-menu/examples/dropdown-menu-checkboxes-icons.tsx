import * as React from "react";
import { Icon } from "@erbium/ui/components/icon";

import { Button } from "@erbium/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuTrigger,
  DropdownMenuList,
} from "@erbium/ui/components/dropdown-menu";

export function DropdownMenuCheckboxesIcons() {
  const [notifications, setNotifications] = React.useState({
    email: true,
    push: true,
    sms: false,
  });

  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button variant="outline" />}>Notifications</DropdownMenuTrigger>
      <DropdownMenuContent className="w-48">
        <DropdownMenuList>
          <DropdownMenuGroup>
            <DropdownMenuLabel>Notification Preferences</DropdownMenuLabel>
            <DropdownMenuCheckboxItem
              checked={notifications.email}
              onCheckedChange={(checked) => {
                setNotifications({ ...notifications, email: checked });
              }}
            >
              <Icon name="mail-01" />
              Email notifications
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={notifications.sms}
              onCheckedChange={(checked) => {
                setNotifications({ ...notifications, sms: checked });
              }}
            >
              <Icon name="message-square" />
              SMS notifications
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={notifications.push}
              onCheckedChange={(checked) => {
                setNotifications({ ...notifications, push: checked });
              }}
            >
              <Icon name="bell" />
              Push notifications
            </DropdownMenuCheckboxItem>
          </DropdownMenuGroup>
        </DropdownMenuList>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
