import { useState } from "react";
import { CopyButton } from "@erbium/ui/blocks/copy-button";

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
              {["Open project", "Rename project", "Duplicate project"].map((label) => (
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
              <CopyButton
                value="https://erbium.dev/projects/erbium"
                render={<ContextMenuItem label="Copy project link" />}
                onClick={() => {
                  setAction("Copy project link");
                }}
              >
                Copy project link
              </CopyButton>
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
      <output className="text-caption text-muted-foreground">{action}</output>
    </div>
  );
}
