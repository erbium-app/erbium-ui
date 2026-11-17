import { CopyButton, CopyButtonIcon } from "@erbium/ui/blocks/copy-button";
import { Icon } from "@erbium/ui/components/icon";

import { RotatingChevron } from "@erbium/ui/components/stateful-icon";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuList,
} from "@erbium/ui/components/dropdown-menu";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@erbium/ui/components/input-group";

export default function InputGroupDropdownExample() {
  return (
    <div className="grid w-full max-w-sm gap-group">
      <InputGroup>
        <InputGroupInput placeholder="Enter file name" />
        <InputGroupAddon align="inline-end">
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <InputGroupButton variant="ghost" aria-label="More" size="icon-xs">
                  <Icon name="more-horizontal" />
                </InputGroupButton>
              }
            />
            <DropdownMenuContent align="end">
              <DropdownMenuList>
                <DropdownMenuItem>Settings</DropdownMenuItem>
                <CopyButton value="/projects/erbium/script.js" render={<DropdownMenuItem />}>
                  <CopyButtonIcon />
                  <span>Copy path</span>
                </CopyButton>
                <DropdownMenuItem>Open location</DropdownMenuItem>
              </DropdownMenuList>
            </DropdownMenuContent>
          </DropdownMenu>
        </InputGroupAddon>
      </InputGroup>
      <InputGroup className="[--radius:1rem]">
        <InputGroupInput placeholder="Enter search query" />
        <InputGroupAddon align="inline-end">
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <InputGroupButton
                  variant="ghost"
                  className="group group/search-menu-trigger text-metadata"
                >
                  Search In... <RotatingChevron className="size-3" />
                </InputGroupButton>
              }
            />
            <DropdownMenuContent align="end" className="[--radius:0.95rem]">
              <DropdownMenuList>
                <DropdownMenuItem>Documentation</DropdownMenuItem>
                <DropdownMenuItem>Blog Posts</DropdownMenuItem>
                <DropdownMenuItem>Changelog</DropdownMenuItem>
              </DropdownMenuList>
            </DropdownMenuContent>
          </DropdownMenu>
        </InputGroupAddon>
      </InputGroup>
    </div>
  );
}
