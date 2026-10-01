import { HugeiconsIcon } from "@hugeicons/react";
import CreditCardIcon from "@hugeicons/core-free-icons/CreditCardIcon";
import LogOutIcon from "@hugeicons/core-free-icons/LogOutIcon";
import Settings01Icon from "@hugeicons/core-free-icons/Settings01Icon";
import UserIcon from "@hugeicons/core-free-icons/UserIcon";

import { Button } from "@erbium/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@erbium/ui/components/dropdown-menu";

export function DropdownMenuIcons() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button variant="outline" />}>Open</DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem>
          <HugeiconsIcon icon={UserIcon} />
          Profile
        </DropdownMenuItem>
        <DropdownMenuItem>
          <HugeiconsIcon icon={CreditCardIcon} />
          Billing
        </DropdownMenuItem>
        <DropdownMenuItem>
          <HugeiconsIcon icon={Settings01Icon} />
          Settings
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="error">
          <HugeiconsIcon icon={LogOutIcon} />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
