import { useState } from "react";

import {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuSearch,
  ContextMenuList,
  ContextMenuEmpty,
  ContextMenuGroup,
  ContextMenuLabel,
  ContextMenuItem,
} from "@erbium/ui/components/context-menu";

export default function SearchableExample() {
  const [action, setAction] = useState("No action selected.");

  return (
    <div className="grid gap-related">
      <ContextMenu searchable>
        <ContextMenuTrigger className="flex min-h-32 items-center justify-center rounded-lg border border-dashed p-panel text-control">
          Right-click for project actions
        </ContextMenuTrigger>
        <ContextMenuContent className="w-72">
          <ContextMenuSearch aria-label="Search project actions" />
          <ContextMenuEmpty>No project actions found.</ContextMenuEmpty>
          <ContextMenuList>
            <ContextMenuGroup>
              <ContextMenuLabel>Project</ContextMenuLabel>
              {["Open project", "Rename project", "Duplicate project", "Copy project link"].map(
                (label) => (
                  <ContextMenuItem
                    key={label}
                    label={label}
                    onClick={() => {
                      setAction(label);
                    }}
                  >
                    {label}
                  </ContextMenuItem>
                ),
              )}
            </ContextMenuGroup>

            <ContextMenuGroup>
              <ContextMenuLabel>Export</ContextMenuLabel>
              {["Export PDF", "Export Markdown", "Export CSV", "Download archive"].map((label) => (
                <ContextMenuItem
                  key={label}
                  label={label}
                  onClick={() => {
                    setAction(label);
                  }}
                >
                  {label}
                </ContextMenuItem>
              ))}
            </ContextMenuGroup>
          </ContextMenuList>
        </ContextMenuContent>
      </ContextMenu>
      <p role="status" className="text-caption text-muted-foreground">
        {action}
      </p>
    </div>
  );
}
