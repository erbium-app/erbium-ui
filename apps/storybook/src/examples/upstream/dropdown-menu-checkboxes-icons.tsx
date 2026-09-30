import * as React from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import BellIcon from "@hugeicons/core-free-icons/BellIcon";
import Mail01Icon from "@hugeicons/core-free-icons/Mail01Icon";
import MessageSquareIcon from "@hugeicons/core-free-icons/MessageSquareIcon";

import { Button } from "@erbium/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@erbium/ui/components/dropdown-menu";

export function DropdownMenuCheckboxesIcons() {
  const [notifications, setNotifications] = React.useState({
    email: true,
    sms: false,
    push: true,
  });

  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button variant="outline" />}>Notifications</DropdownMenuTrigger>
      <DropdownMenuContent className="w-48">
        <DropdownMenuGroup>
          <DropdownMenuLabel>Notification Preferences</DropdownMenuLabel>
          <DropdownMenuCheckboxItem
            checked={notifications.email}
            onCheckedChange={(checked) =>
              setNotifications({ ...notifications, email: checked === true })
            }
          >
            <HugeiconsIcon icon={Mail01Icon} />
            Email notifications
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem
            checked={notifications.sms}
            onCheckedChange={(checked) =>
              setNotifications({ ...notifications, sms: checked === true })
            }
          >
            <HugeiconsIcon icon={MessageSquareIcon} />
            SMS notifications
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem
            checked={notifications.push}
            onCheckedChange={(checked) =>
              setNotifications({ ...notifications, push: checked === true })
            }
          >
            <HugeiconsIcon icon={BellIcon} />
            Push notifications
          </DropdownMenuCheckboxItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
