import { useState } from "react";
import { CopyButton } from "@erbium/ui/blocks/copy-button";
import { Button } from "@erbium/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuSearch,
  DropdownMenuList,
  DropdownMenuEmpty,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuCheckboxItem,
} from "@erbium/ui/components/dropdown-menu";

export default function SearchableExample() {
  const [action, setAction] = useState("No action selected.");

  return (
    <div className="grid gap-related">
      <DropdownMenu searchable>
        <DropdownMenuTrigger render={<Button variant="outline" />}>
          Project actions
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-72">
          <DropdownMenuSearch aria-label="Search project actions" />
          <DropdownMenuEmpty>No project actions found.</DropdownMenuEmpty>
          <DropdownMenuList>
            <DropdownMenuGroup>
              <DropdownMenuLabel>Project</DropdownMenuLabel>
              {["Open project", "Rename project", "Duplicate project"].map((label) => (
                <DropdownMenuItem
                  key={label}
                  label={label}
                  onClick={() => {
                    setAction(label);
                  }}
                >
                  {label}
                </DropdownMenuItem>
              ))}
              <CopyButton
                value="https://erbium.dev/projects/erbium"
                render={<DropdownMenuItem label="Copy project link" />}
                onClick={() => {
                  setAction("Copy project link");
                }}
              >
                Copy project link
              </CopyButton>
            </DropdownMenuGroup>
            <DropdownMenuSub searchable>
              <DropdownMenuSubTrigger label="Move to folder">Move to folder</DropdownMenuSubTrigger>
              <DropdownMenuSubContent className="w-64">
                <DropdownMenuSearch aria-label="Search folders" placeholder="Search folders…" />
                <DropdownMenuEmpty>No folders found.</DropdownMenuEmpty>
                <DropdownMenuList>
                  {["Design", "Engineering", "Research"].map((folder) => (
                    <DropdownMenuItem
                      key={folder}
                      label={folder}
                      onClick={() => {
                        setAction(`Move to ${folder}`);
                      }}
                    >
                      {folder}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuList>
              </DropdownMenuSubContent>
            </DropdownMenuSub>
            <DropdownMenuCheckboxItem label="Keep available offline" defaultChecked>
              Keep available offline
            </DropdownMenuCheckboxItem>
            <DropdownMenuGroup>
              <DropdownMenuLabel>Export</DropdownMenuLabel>
              {["Export PDF", "Export Markdown", "Export CSV", "Download archive"].map((label) => (
                <DropdownMenuItem
                  key={label}
                  label={label}
                  onClick={() => {
                    setAction(label);
                  }}
                >
                  {label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuGroup>
          </DropdownMenuList>
        </DropdownMenuContent>
      </DropdownMenu>
      <output className="text-caption text-muted-foreground">{action}</output>
    </div>
  );
}
