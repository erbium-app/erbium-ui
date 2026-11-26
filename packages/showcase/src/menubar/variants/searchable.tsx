import { useState } from "react";
import { CopyButton } from "@erbium/ui/blocks/copy-button";

import {
  Menubar,
  MenubarMenu,
  MenubarTrigger,
  MenubarContent,
  MenubarSearch,
  MenubarList,
  MenubarEmpty,
  MenubarGroup,
  MenubarLabel,
  MenubarItem,
} from "@erbium/ui/components/menubar";

export default function SearchableExample() {
  const [action, setAction] = useState("No action selected.");

  return (
    <div className="grid gap-related">
      <Menubar>
        <MenubarMenu searchable>
          <MenubarTrigger>Project</MenubarTrigger>
          <MenubarContent className="w-72">
            <MenubarSearch aria-label="Search project actions" />
            <MenubarEmpty>No project actions found.</MenubarEmpty>
            <MenubarList>
              <MenubarGroup>
                <MenubarLabel>Project</MenubarLabel>
                {["Open project", "Rename project", "Duplicate project"].map((label) => (
                  <MenubarItem
                    key={label}
                    label={label}
                    onClick={() => {
                      setAction(label);
                    }}
                  >
                    {label}
                  </MenubarItem>
                ))}
                <CopyButton
                  value="https://erbium.dev/projects/erbium"
                  render={<MenubarItem label="Copy project link" />}
                  onClick={() => {
                    setAction("Copy project link");
                  }}
                >
                  Copy project link
                </CopyButton>
              </MenubarGroup>

              <MenubarGroup>
                <MenubarLabel>Export</MenubarLabel>
                {["Export PDF", "Export Markdown", "Export CSV", "Download archive"].map(
                  (label) => (
                    <MenubarItem
                      key={label}
                      label={label}
                      onClick={() => {
                        setAction(label);
                      }}
                    >
                      {label}
                    </MenubarItem>
                  ),
                )}
              </MenubarGroup>
            </MenubarList>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>
      <output className="text-caption text-muted-foreground">{action}</output>
    </div>
  );
}
