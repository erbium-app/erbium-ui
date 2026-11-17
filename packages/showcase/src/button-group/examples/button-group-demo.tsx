import * as React from "react";
import { Icon } from "@erbium/ui/components/icon";

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

export default function ButtonGroupExample() {
  const [label, setLabel] = React.useState("personal");

  return (
    <ButtonGroup>
      <ButtonGroup className="hidden sm:flex">
        <Button variant="outline" size="icon" aria-label="Go Back">
          <Icon name="arrow-left-01" />
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
                <Icon name="more-horizontal" />
              </Button>
            }
          />
          <DropdownMenuContent align="end" className="w-52">
            <DropdownMenuList>
              <DropdownMenuGroup>
                <DropdownMenuItem>
                  <Icon name="mail-check" />
                  Mark as Read
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Icon name="archive" />
                  Archive
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem>
                  <Icon name="clock-01" />
                  Snooze
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Icon name="calendar-plus" />
                  Add to Calendar
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Icon name="list-filter" />
                  Add to List
                </DropdownMenuItem>
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger>
                    <Icon name="tag-01" />
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
                  <Icon name="delete-02" />
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
