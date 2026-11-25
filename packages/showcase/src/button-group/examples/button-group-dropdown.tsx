import { CopyButton, CopyButtonIcon } from "@erbium/ui/blocks/copy-button";
import { Icon } from "@erbium/ui/components/icon";

import { RotatingChevron } from "@erbium/ui/components/stateful-icon";
import { Button } from "@erbium/ui/components/button";
import { ButtonGroup } from "@erbium/ui/components/button-group";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuList,
} from "@erbium/ui/components/dropdown-menu";

export default function ButtonGroupDropdownExample() {
  return (
    <ButtonGroup>
      <Button variant="outline">Follow</Button>
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button variant="outline">
              <RotatingChevron />
            </Button>
          }
        />
        <DropdownMenuContent align="end" className="[--radius:1rem]">
          <DropdownMenuList>
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <Icon name="volume-off" />
                Mute Conversation
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Icon name="check" />
                Mark as Read
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Icon name="alert-01" />
                Report Conversation
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Icon name="user-round-x" />
                Block User
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Icon name="share-01" />
                Share Conversation
              </DropdownMenuItem>
              <CopyButton value="Conversation with Alex" render={<DropdownMenuItem />}>
                <CopyButtonIcon />
                <span>Copy Conversation</span>
              </CopyButton>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem variant="error">
                <Icon name="trash" />
                Delete Conversation
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuList>
        </DropdownMenuContent>
      </DropdownMenu>
    </ButtonGroup>
  );
}
