import { HugeiconsIcon } from "@hugeicons/react";
import BadgeCheckIcon from "@hugeicons/core-free-icons/BadgeCheckIcon";
import BellIcon from "@hugeicons/core-free-icons/BellIcon";
import CreditCardIcon from "@hugeicons/core-free-icons/CreditCardIcon";
import LogOutIcon from "@hugeicons/core-free-icons/LogOutIcon";

import { Avatar, AvatarFallback, AvatarImage } from "@erbium/ui/components/avatar";
import { Button } from "@erbium/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@erbium/ui/components/dropdown-menu";

export function DropdownMenuAvatar() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button variant="ghost" size="icon" className="rounded-full" />}>
        <Avatar>
          <AvatarImage src="https://github.com/shadcn.png" alt="shadcn" />
          <AvatarFallback>LR</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <HugeiconsIcon icon={BadgeCheckIcon} />
            Account
          </DropdownMenuItem>
          <DropdownMenuItem>
            <HugeiconsIcon icon={CreditCardIcon} />
            Billing
          </DropdownMenuItem>
          <DropdownMenuItem>
            <HugeiconsIcon icon={BellIcon} />
            Notifications
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <HugeiconsIcon icon={LogOutIcon} />
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
