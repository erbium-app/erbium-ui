import * as React from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import ArchiveIcon from "@hugeicons/core-free-icons/ArchiveIcon";
import ArrowLeft01Icon from "@hugeicons/core-free-icons/ArrowLeft01Icon";
import CalendarPlusIcon from "@hugeicons/core-free-icons/CalendarPlusIcon";
import Clock01Icon from "@hugeicons/core-free-icons/Clock01Icon";
import Delete02Icon from "@hugeicons/core-free-icons/Delete02Icon";
import ListFilterIcon from "@hugeicons/core-free-icons/ListFilterIcon";
import MailCheckIcon from "@hugeicons/core-free-icons/MailCheckIcon";
import MoreHorizontalIcon from "@hugeicons/core-free-icons/MoreHorizontalIcon";
import Tag01Icon from "@hugeicons/core-free-icons/Tag01Icon";

import { Button } from "@erbium/ui/components/button";
import { ButtonGroup } from "@erbium/ui/components/button-group";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
  DropdownMenuList,
} from "@erbium/ui/components/dropdown-menu";

export default function ButtonGroupDemo() {
  const [label, setLabel] = React.useState("personal");

  return (
    <ButtonGroup>
      <ButtonGroup className="hidden sm:flex">
        <Button variant="outline" size="icon" aria-label="Go Back">
          <HugeiconsIcon icon={ArrowLeft01Icon} />
        </Button>
      </ButtonGroup>
      <ButtonGroup>
        <Button variant="outline">Archive</Button>
        <Button variant="outline">Report</Button>
      </ButtonGroup>
      <ButtonGroup>
        <Button variant="outline">Snooze</Button>
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button variant="outline" size="icon" aria-label="More Options">
                <HugeiconsIcon icon={MoreHorizontalIcon} />
              </Button>
            }
          />
          <DropdownMenuContent align="end" className="w-52">
            <DropdownMenuList>
              <DropdownMenuGroup>
                <DropdownMenuItem>
                  <HugeiconsIcon icon={MailCheckIcon} />
                  Mark as Read
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <HugeiconsIcon icon={ArchiveIcon} />
                  Archive
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem>
                  <HugeiconsIcon icon={Clock01Icon} />
                  Snooze
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <HugeiconsIcon icon={CalendarPlusIcon} />
                  Add to Calendar
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <HugeiconsIcon icon={ListFilterIcon} />
                  Add to List
                </DropdownMenuItem>
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger>
                    <HugeiconsIcon icon={Tag01Icon} />
                    Label As...
                  </DropdownMenuSubTrigger>
                  <DropdownMenuSubContent>
                    <DropdownMenuList>
                      <DropdownMenuRadioGroup value={label} onValueChange={setLabel}>
                        <DropdownMenuRadioItem value="personal">Personal</DropdownMenuRadioItem>
                        <DropdownMenuRadioItem value="work">Work</DropdownMenuRadioItem>
                        <DropdownMenuRadioItem value="other">Other</DropdownMenuRadioItem>
                      </DropdownMenuRadioGroup>
                    </DropdownMenuList>
                  </DropdownMenuSubContent>
                </DropdownMenuSub>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem variant="error">
                  <HugeiconsIcon icon={Delete02Icon} />
                  Trash
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuList>
          </DropdownMenuContent>
        </DropdownMenu>
      </ButtonGroup>
    </ButtonGroup>
  );
}
