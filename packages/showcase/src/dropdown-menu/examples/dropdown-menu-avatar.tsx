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
      <DropdownMenuTrigger
        render={<Button variant="ghost" size="icon" className="rounded-[35%]" />}
      >
        <Avatar>
          <AvatarImage
            src="data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2264%22%20height%3D%2264%22%20viewBox%3D%220%200%2064%2064%22%3E%3Crect%20width%3D%2264%22%20height%3D%2264%22%20rx%3D%2232%22%20fill%3D%22%23475569%22%2F%3E%3Ctext%20x%3D%2232%22%20y%3D%2233%22%20text-anchor%3D%22middle%22%20dominant-baseline%3D%22middle%22%20font-family%3D%22sans-serif%22%20font-size%3D%2222%22%20fill%3D%22white%22%3EJD%3C%2Ftext%3E%3C%2Fsvg%3E"
            alt="John Doe"
          />
          <AvatarFallback>JD</AvatarFallback>
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
