import { useState } from "react";
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

const SearchableExample = () => {
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
              {["Open project", "Rename project", "Duplicate project", "Copy project link"].map(
                (label) => (
                  <DropdownMenuItem
                    key={label}
                    label={label}
                    onClick={() => {
                      setAction(label);
                    }}
                  >
                    {label}
                  </DropdownMenuItem>
                ),
              )}
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
      <p role="status" className="text-caption text-muted-foreground">
        {action}
      </p>
    </div>
  );
};

export default SearchableExample;
