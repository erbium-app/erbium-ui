import { Icon } from "@erbium/ui/components/icon";

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

export default function DropdownMenuErrorExample() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button variant="outline" />}>Actions</DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuList>
          <DropdownMenuGroup>
            <DropdownMenuItem>
              <Icon name="pencil" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Icon name="share-01" />
              Share
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem variant="error">
              <Icon name="trash" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuList>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
