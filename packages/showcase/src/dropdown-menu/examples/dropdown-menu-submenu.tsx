import { Button } from "@erbium/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
  DropdownMenuList,
} from "@erbium/ui/components/dropdown-menu";

export const DropdownMenuSubmenu = () => (
  <DropdownMenu>
    <DropdownMenuTrigger render={<Button variant="outline" />}>Open</DropdownMenuTrigger>
    <DropdownMenuContent>
      <DropdownMenuList>
        <DropdownMenuGroup>
          <DropdownMenuItem>Team</DropdownMenuItem>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>Invite users</DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent>
                <DropdownMenuList>
                  <DropdownMenuItem>Email</DropdownMenuItem>
                  <DropdownMenuItem>Message</DropdownMenuItem>
                  <DropdownMenuSub>
                    <DropdownMenuSubTrigger>More options</DropdownMenuSubTrigger>
                    <DropdownMenuPortal>
                      <DropdownMenuSubContent>
                        <DropdownMenuList>
                          <DropdownMenuItem>Calendly</DropdownMenuItem>
                          <DropdownMenuItem>Slack</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>Webhook</DropdownMenuItem>
                        </DropdownMenuList>
                      </DropdownMenuSubContent>
                    </DropdownMenuPortal>
                  </DropdownMenuSub>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>Advanced...</DropdownMenuItem>
                </DropdownMenuList>
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
          <DropdownMenuItem>
            New Team
            <DropdownMenuShortcut hotkey="Mod+T" />
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuList>
    </DropdownMenuContent>
  </DropdownMenu>
);
