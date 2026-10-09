import { CopyButton, CopyButtonIcon } from "@erbium/ui/blocks/copy-button";
import { HugeiconsIcon } from "@hugeicons/react";
import Alert01Icon from "@hugeicons/core-free-icons/Alert01Icon";
import CheckIcon from "@hugeicons/core-free-icons/CheckIcon";
import Share01Icon from "@hugeicons/core-free-icons/Share01Icon";
import TrashIcon from "@hugeicons/core-free-icons/TrashIcon";
import UserRoundXIcon from "@hugeicons/core-free-icons/UserRoundXIcon";
import VolumeOffIcon from "@hugeicons/core-free-icons/VolumeOffIcon";

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

export default function ButtonGroupDropdown() {
  return (
    <ButtonGroup>
      <Button variant="outline">Follow</Button>
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button variant="outline" className="group group/menu-trigger">
              <RotatingChevron />
            </Button>
          }
        />
        <DropdownMenuContent align="end" className="[--radius:1rem]">
          <DropdownMenuList>
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <HugeiconsIcon icon={VolumeOffIcon} />
                Mute Conversation
              </DropdownMenuItem>
              <DropdownMenuItem>
                <HugeiconsIcon icon={CheckIcon} />
                Mark as Read
              </DropdownMenuItem>
              <DropdownMenuItem>
                <HugeiconsIcon icon={Alert01Icon} />
                Report Conversation
              </DropdownMenuItem>
              <DropdownMenuItem>
                <HugeiconsIcon icon={UserRoundXIcon} />
                Block User
              </DropdownMenuItem>
              <DropdownMenuItem>
                <HugeiconsIcon icon={Share01Icon} />
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
                <HugeiconsIcon icon={TrashIcon} />
                Delete Conversation
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuList>
        </DropdownMenuContent>
      </DropdownMenu>
    </ButtonGroup>
  );
}
