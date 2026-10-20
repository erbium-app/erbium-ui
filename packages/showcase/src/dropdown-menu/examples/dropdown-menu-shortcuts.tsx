import { Button } from "@erbium/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
  DropdownMenuList,
} from "@erbium/ui/components/dropdown-menu";

export const DropdownMenuShortcuts = () => (
  <DropdownMenu>
    <DropdownMenuTrigger render={<Button variant="outline" />}>Open</DropdownMenuTrigger>
    <DropdownMenuContent>
      <DropdownMenuList>
        <DropdownMenuGroup>
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuItem>
            Profile
            <DropdownMenuShortcut hotkey="Shift+Mod+P" />
          </DropdownMenuItem>
          <DropdownMenuItem>
            Billing
            <DropdownMenuShortcut hotkey="Mod+B" />
          </DropdownMenuItem>
          <DropdownMenuItem>
            Settings
            <DropdownMenuShortcut hotkey="Mod+S" />
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          Log out
          <DropdownMenuShortcut hotkey="Shift+Mod+Q" />
        </DropdownMenuItem>
      </DropdownMenuList>
    </DropdownMenuContent>
  </DropdownMenu>
);
