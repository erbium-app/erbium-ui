import { Icon } from "@erbium/ui/components/icon";

import { RotatingChevron } from "@erbium/ui/components/stateful-icon";
import { Button } from "@erbium/ui/components/button";
import { Card, CardContent, CardHeader } from "@erbium/ui/components/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@erbium/ui/components/collapsible";
import { Tabs, TabsList, TabsTrigger } from "@erbium/ui/components/tabs";

type FileTreeItem = { name: string } | { name: string; items: FileTreeItem[] };

export default function CollapsibleFileTreeExample() {
  const fileTree: FileTreeItem[] = [
    {
      items: [
        {
          items: [
            { name: "button.tsx" },
            { name: "card.tsx" },
            { name: "dialog.tsx" },
            { name: "input.tsx" },
            { name: "select.tsx" },
            { name: "table.tsx" },
          ],
          name: "ui",
        },
        { name: "login-form.tsx" },
        { name: "register-form.tsx" },
      ],
      name: "components",
    },
    {
      items: [{ name: "utils.ts" }, { name: "cn.ts" }, { name: "api.ts" }],
      name: "lib",
    },
    {
      items: [
        { name: "use-media-query.ts" },
        { name: "use-debounce.ts" },
        { name: "use-local-storage.ts" },
      ],
      name: "hooks",
    },
    {
      items: [{ name: "index.d.ts" }, { name: "api.d.ts" }],
      name: "types",
    },
    {
      items: [{ name: "favicon.ico" }, { name: "logo.svg" }, { name: "images" }],
      name: "public",
    },
    { name: "app.tsx" },
    { name: "layout.tsx" },
    { name: "globals.css" },
    { name: "package.json" },
    { name: "tsconfig.json" },
    { name: "README.md" },
    { name: ".gitignore" },
  ];

  const renderItem = (fileItem: FileTreeItem) => {
    if ("items" in fileItem) {
      return (
        <Collapsible key={fileItem.name}>
          <CollapsibleTrigger
            render={
              <Button
                variant="ghost"
                size="sm"
                className="group w-full justify-start transition-none hover:bg-accent hover:text-accent-foreground"
              />
            }
          >
            <RotatingChevron scope="collapsible" />
            <Icon name="folder-01" />
            {fileItem.name}
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div className="mt-1 ms-5 flex flex-col gap-1">
              {fileItem.items.map((child) => renderItem(child))}
            </div>
          </CollapsibleContent>
        </Collapsible>
      );
    }

    return (
      <Button
        key={fileItem.name}
        variant="link"
        size="sm"
        className="w-full justify-start text-foreground"
      >
        <Icon name="file-01" />
        <span>{fileItem.name}</span>
      </Button>
    );
  };

  return (
    <Card className="mx-auto w-full max-w-[16rem] gap-related" size="sm">
      <CardHeader>
        <Tabs defaultValue="explorer">
          <TabsList className="w-full">
            <TabsTrigger value="explorer">Explorer</TabsTrigger>
            <TabsTrigger value="settings">Outline</TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-1">{fileTree.map((item) => renderItem(item))}</div>
      </CardContent>
    </Card>
  );
}
