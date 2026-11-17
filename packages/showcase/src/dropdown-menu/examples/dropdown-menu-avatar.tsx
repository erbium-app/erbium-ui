import { Icon } from "@erbium/ui/components/icon";

import { Avatar, AvatarFallback, AvatarImage } from "@erbium/ui/components/avatar";
import { Button } from "@erbium/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuList,
} from "@erbium/ui/components/dropdown-menu";

export default function DropdownMenuAvatarExample() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={<Button variant="ghost" size="icon-lg" className="rounded-avatar" />}
      >
        <Avatar>
          <AvatarImage
            src="https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=256&h=256&fit=crop"
            alt="John Doe"
          />
          <AvatarFallback>JD</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuList>
          <DropdownMenuGroup>
            <DropdownMenuItem>
              <Icon name="badge-check" />
              Account
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Icon name="credit-card" />
              Billing
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Icon name="bell" />
              Notifications
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <Icon name="log-out" />
            Sign Out
          </DropdownMenuItem>
        </DropdownMenuList>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
