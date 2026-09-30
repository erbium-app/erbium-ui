import { HugeiconsIcon } from "@hugeicons/react";
import Alert01Icon from "@hugeicons/core-free-icons/Alert01Icon";
import CheckIcon from "@hugeicons/core-free-icons/CheckIcon";
import CopyIcon from "@hugeicons/core-free-icons/CopyIcon";
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
} from "@erbium/ui/components/dropdown-menu";

export default function ButtonGroupDropdown() {
  return (
    <ButtonGroup>
      <Button variant="outline">Follow</Button>
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button variant="outline" className="group group/menu-trigger pl-2!">
              <RotatingChevron />
            </Button>
          }
        />
        <DropdownMenuContent align="end" className="[--radius:1rem]">
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
            <DropdownMenuItem>
              <HugeiconsIcon icon={CopyIcon} />
              Copy Conversation
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem variant="destructive">
              <HugeiconsIcon icon={TrashIcon} />
              Delete Conversation
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </ButtonGroup>
  );
}
