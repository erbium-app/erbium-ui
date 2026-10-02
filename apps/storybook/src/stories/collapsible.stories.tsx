import { CollapsibleTrigger, CollapsibleContent } from "@erbium/ui/components/collapsible";
import { Card } from "@erbium/ui/components/card";

import { CollapsibleSettings } from "../examples/upstream/collapsible-settings";
import { CollapsibleBasic } from "../examples/upstream/collapsible-basic";
import { CollapsibleFileTree } from "../examples/upstream/collapsible-file-tree";
import type { Meta, StoryObj } from "@storybook/tanstack-react";
import { Collapsible } from "@erbium/ui/components/collapsible";
import { RotatingChevron } from "@erbium/ui/components/stateful-icon";
import { Separator } from "@erbium/ui/components/separator";
import Demo from "../examples/collapsible-demo";

const meta = {
  title: "UI/Collapsible",
  component: Collapsible,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          'An interactive component which expands/collapses a panel.\n\n**Import:** `@erbium/ui/components/collapsible`  \n\n**shadcn/ui page:** [Collapsible](https://ui.shadcn.com/docs/components/base/collapsible)\n\n### Usage\n\n```tsx\nimport {\n  Collapsible,\n  CollapsibleContent,\n  CollapsibleTrigger,\n} from "@erbium/ui/components/collapsible"\n```\n\n```tsx\n<Collapsible>\n  <CollapsibleTrigger>Can I use this in my project?</CollapsibleTrigger>\n  <CollapsibleContent>\n    Yes. Free to use for personal and commercial projects. No attribution\n    required.\n  </CollapsibleContent>\n</Collapsible>\n```\n\n### Composition\n\nUse the following composition to build a `Collapsible`:\n\n```text\nCollapsible\n├── CollapsibleTrigger\n└── CollapsibleContent\n```',
      },
    },
  },
} satisfies Meta<typeof Collapsible>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: StoryObj<typeof Collapsible> = {
  args: { defaultOpen: true, disabled: false },
  argTypes: { defaultOpen: { control: "boolean" }, disabled: { control: "boolean" } },
  render: (args) => (
    <Card className="w-72 gap-0 p-0" size="sm">
      <Collapsible key={String(args.defaultOpen)} {...args}>
        <CollapsibleTrigger className="group group/playground flex w-full items-center rounded-xl px-3 py-2 text-start text-sm font-medium outline-none hover:bg-accent data-panel-open:rounded-b-none [&:has(+_[data-slot=collapsible-content]:not([hidden]))]:rounded-b-none focus-visible:ring-2 focus-visible:ring-ring/40">
          Show details
          <RotatingChevron direction="right" className="ms-auto size-4 text-muted-foreground" />
        </CollapsibleTrigger>
        <CollapsibleContent>
          <Separator />
          <div className="px-3 pt-2 pb-3 text-sm text-muted-foreground">
            More information is available here.
          </div>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  ),
};

export const Overview: Story = {
  parameters: {
    docs: {
      source: {
        code: 'import * as React from "react";\nimport { HugeiconsIcon } from "@hugeicons/react";\nimport { RotatingChevron } from "@erbium/ui/components/stateful-icon";\nimport FileTextIcon from "@hugeicons/core-free-icons/FileTextIcon";\nimport Folder01Icon from "@hugeicons/core-free-icons/Folder01Icon";\n\nimport { Card } from "@erbium/ui/components/card";\nimport {\n  Collapsible,\n  CollapsibleContent,\n  CollapsibleTrigger,\n} from "@erbium/ui/components/collapsible";\nimport { Separator } from "@erbium/ui/components/separator";\n\nconst files = ["README.md", "package.json", "tsconfig.json"];\n\nexport default function CollapsibleDemo() {\n  const [isOpen, setIsOpen] = React.useState(false);\n\n  return (\n    <Card className="w-[350px] gap-0 p-0" size="sm">\n      <Collapsible open={isOpen} onOpenChange={setIsOpen}>\n        <CollapsibleTrigger className="group group/files flex w-full items-center gap-2 rounded-xl px-3 py-2 text-start outline-none hover:bg-accent data-panel-open:rounded-b-none [&:has(+_[data-slot=collapsible-content]:not([hidden]))]:rounded-b-none focus-visible:ring-2 focus-visible:ring-ring/40">\n          <HugeiconsIcon icon={Folder01Icon} aria-hidden="true" className="size-4 shrink-0 text-muted-foreground" />\n          <span className="min-w-0 flex-1">\n            <span className="block text-sm font-medium">Project files</span>\n            <span className="block text-xs text-muted-foreground">3 files in this workspace</span>\n          </span>\n          <RotatingChevron direction="right" className="size-4 shrink-0 text-muted-foreground" />\n        </CollapsibleTrigger>\n        <CollapsibleContent>\n          <Separator />\n          <div className="space-y-1 px-3 pt-2 pb-3">\n            {files.map((file) => (\n              <div key={file} className="flex items-center gap-2 py-1 text-sm">\n                <HugeiconsIcon icon={FileTextIcon} aria-hidden="true" className="size-4 text-muted-foreground" />\n                {file}\n              </div>\n            ))}\n          </div>\n        </CollapsibleContent>\n      </Collapsible>\n    </Card>\n  );\n}\n',
      },
    },
  },
  render: () => (
    <div className="w-full min-w-72 max-w-2xl p-4">
      <Demo />
    </div>
  ),
};

export const FileTree: Story = {
  parameters: {
    docs: {
      description: { story: "Use nested collapsibles to build a file tree." },
      source: {
        code: 'import { HugeiconsIcon } from "@hugeicons/react";\nimport { RotatingChevron } from "@erbium/ui/components/stateful-icon";\nimport File01Icon from "@hugeicons/core-free-icons/File01Icon";\nimport Folder01Icon from "@hugeicons/core-free-icons/Folder01Icon";\n\n\nimport { Button } from "@erbium/ui/components/button";\nimport { Card, CardContent, CardHeader } from "@erbium/ui/components/card";\nimport {\n  Collapsible,\n  CollapsibleContent,\n  CollapsibleTrigger,\n} from "@erbium/ui/components/collapsible";\nimport { Tabs, TabsList, TabsTrigger } from "@erbium/ui/components/tabs";\n\ntype FileTreeItem = { name: string } | { name: string; items: FileTreeItem[] };\n\nexport function CollapsibleFileTree() {\n  const fileTree: FileTreeItem[] = [\n    {\n      name: "components",\n      items: [\n        {\n          name: "ui",\n          items: [\n            { name: "button.tsx" },\n            { name: "card.tsx" },\n            { name: "dialog.tsx" },\n            { name: "input.tsx" },\n            { name: "select.tsx" },\n            { name: "table.tsx" },\n          ],\n        },\n        { name: "login-form.tsx" },\n        { name: "register-form.tsx" },\n      ],\n    },\n    {\n      name: "lib",\n      items: [{ name: "utils.ts" }, { name: "cn.ts" }, { name: "api.ts" }],\n    },\n    {\n      name: "hooks",\n      items: [\n        { name: "use-media-query.ts" },\n        { name: "use-debounce.ts" },\n        { name: "use-local-storage.ts" },\n      ],\n    },\n    {\n      name: "types",\n      items: [{ name: "index.d.ts" }, { name: "api.d.ts" }],\n    },\n    {\n      name: "public",\n      items: [{ name: "favicon.ico" }, { name: "logo.svg" }, { name: "images" }],\n    },\n    { name: "app.tsx" },\n    { name: "layout.tsx" },\n    { name: "globals.css" },\n    { name: "package.json" },\n    { name: "tsconfig.json" },\n    { name: "README.md" },\n    { name: ".gitignore" },\n  ];\n\n  const renderItem = (fileItem: FileTreeItem) => {\n    if ("items" in fileItem) {\n      return (\n        <Collapsible key={fileItem.name}>\n          <CollapsibleTrigger\n            render={\n              <Button\n                variant="ghost"\n                size="sm"\n                className="group w-full justify-start transition-none hover:bg-accent hover:text-accent-foreground"\n              />\n            }\n          >\n            <RotatingChevron direction="right" className="" />\n            <HugeiconsIcon icon={Folder01Icon} />\n            {fileItem.name}\n          </CollapsibleTrigger>\n          <CollapsibleContent>\n            <div className="mt-1 ms-5 flex flex-col gap-1 style-lyra:ms-4">\n              {fileItem.items.map((child) => renderItem(child))}\n            </div>\n          </CollapsibleContent>\n        </Collapsible>\n      );\n    }\n    return (\n      <Button\n        key={fileItem.name}\n        variant="link"\n        size="sm"\n        className="w-full justify-start gap-2 text-foreground"\n      >\n        <HugeiconsIcon icon={File01Icon} />\n        <span>{fileItem.name}</span>\n      </Button>\n    );\n  };\n\n  return (\n    <Card className="mx-auto w-full max-w-[16rem] gap-2" size="sm">\n      <CardHeader>\n        <Tabs defaultValue="explorer">\n          <TabsList className="w-full">\n            <TabsTrigger value="explorer">Explorer</TabsTrigger>\n            <TabsTrigger value="settings">Outline</TabsTrigger>\n          </TabsList>\n        </Tabs>\n      </CardHeader>\n      <CardContent>\n        <div className="flex flex-col gap-1">{fileTree.map((item) => renderItem(item))}</div>\n      </CardContent>\n    </Card>\n  );\n}\n',
      },
    },
  },
  render: () => <CollapsibleFileTree />,
};

export const Basic: Story = {
  parameters: {
    docs: {
      description: { story: "Expand and collapse additional content." },

      source: {
        code: 'import { HugeiconsIcon } from "@hugeicons/react";\nimport { RotatingChevron } from "@erbium/ui/components/stateful-icon";\n\nimport { Button } from "@erbium/ui/components/button";\nimport { Card } from "@erbium/ui/components/card";\nimport {\n  Collapsible,\n  CollapsibleContent,\n  CollapsibleTrigger,\n} from "@erbium/ui/components/collapsible";\nimport { Separator } from "@erbium/ui/components/separator";\n\nexport function CollapsibleBasic() {\n  return (\n    <Card className="mx-auto w-64 gap-0 p-0" size="sm">\n      <Collapsible>\n        <CollapsibleTrigger className="group group/details flex w-full items-center rounded-xl px-3 py-2 text-start text-sm font-medium outline-none hover:bg-accent data-panel-open:rounded-b-none [&:has(+_[data-slot=collapsible-content]:not([hidden]))]:rounded-b-none focus-visible:ring-2 focus-visible:ring-ring/40">\n          Product details\n          <RotatingChevron direction="right" className="ms-auto size-4 text-muted-foreground" />\n        </CollapsibleTrigger>\n        <CollapsibleContent>\n          <Separator />\n          <div className="flex flex-col items-start gap-2 px-3 pt-2 pb-3 text-sm text-muted-foreground">\n            <div>This panel can be expanded or collapsed to reveal additional content.</div>\n            <Button size="xs">Learn More</Button>\n          </div>\n        </CollapsibleContent>\n      </Collapsible>\n    </Card>\n  );\n}\n',
      },
    },
  },
  render: () => <CollapsibleBasic />,
};

export const SettingsPanel: Story = {
  parameters: {
    // FieldGroup is a size container with no intrinsic width, so it needs a
    // full-width parent rather than the shrink-to-fit centered layout.
    layout: "padded",
    docs: {
      description: { story: "Use a trigger button to reveal additional settings." },
      source: {
        code: 'import * as React from "react";\n\nimport { RotatingChevron } from "@erbium/ui/components/stateful-icon";\nimport { Card } from "@erbium/ui/components/card";\nimport {\n  Collapsible,\n  CollapsibleContent,\n  CollapsibleTrigger,\n} from "@erbium/ui/components/collapsible";\nimport { Field, FieldGroup, FieldLabel } from "@erbium/ui/components/field";\nimport { Input } from "@erbium/ui/components/input";\nimport { Separator } from "@erbium/ui/components/separator";\n\nexport function CollapsibleSettings() {\n  const [isOpen, setIsOpen] = React.useState(false);\n\n  return (\n    <Card className="mx-auto w-full max-w-xs gap-0 p-0" size="sm">\n      <Collapsible open={isOpen} onOpenChange={setIsOpen}>\n        <CollapsibleTrigger className="group group/settings flex w-full items-center gap-2 rounded-xl px-3 py-2 text-start outline-none hover:bg-accent data-panel-open:rounded-b-none [&:has(+_[data-slot=collapsible-content]:not([hidden]))]:rounded-b-none focus-visible:ring-2 focus-visible:ring-ring/40">\n          <span className="min-w-0 flex-1">\n            <span className="block text-sm font-medium">Radius</span>\n            <span className="block text-xs text-muted-foreground">\n              Set the corner radius of the element.\n            </span>\n          </span>\n          <RotatingChevron scope="collapsible" className="size-4 text-muted-foreground" />\n        </CollapsibleTrigger>\n        <CollapsibleContent>\n          <Separator />\n          <div className="px-3 pt-2 pb-3">\n            <FieldGroup className="grid w-full grid-cols-2 gap-2">\n              <Field>\n                <FieldLabel className="sr-only">Radius X</FieldLabel>\n                <Input placeholder="0" defaultValue={0} />\n              </Field>\n              <Field>\n                <FieldLabel className="sr-only">Radius Y</FieldLabel>\n                <Input placeholder="0" defaultValue={0} />\n              </Field>\n            </FieldGroup>\n          </div>\n        </CollapsibleContent>\n      </Collapsible>\n    </Card>\n  );\n}\n',
      },
    },
  },
  render: () => <CollapsibleSettings />,
};
export const ControlledState: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Use the `open` and `onOpenChange` props to control the state.\n\n```tsx\nimport * as React from "react"\n\nexport function Example() {\n  const [open, setOpen] = React.useState(false)\n\n  return (\n    <Collapsible open={open} onOpenChange={setOpen}>\n      <CollapsibleTrigger>Toggle</CollapsibleTrigger>\n      <CollapsibleContent>Content</CollapsibleContent>\n    </Collapsible>\n  )\n}\n```',
      },
      source: {
        code: 'import * as React from "react";\nimport { HugeiconsIcon } from "@hugeicons/react";\nimport { RotatingChevron } from "@erbium/ui/components/stateful-icon";\nimport FileTextIcon from "@hugeicons/core-free-icons/FileTextIcon";\nimport Folder01Icon from "@hugeicons/core-free-icons/Folder01Icon";\n\nimport { Card } from "@erbium/ui/components/card";\nimport {\n  Collapsible,\n  CollapsibleContent,\n  CollapsibleTrigger,\n} from "@erbium/ui/components/collapsible";\nimport { Separator } from "@erbium/ui/components/separator";\n\nconst files = ["README.md", "package.json", "tsconfig.json"];\n\nexport default function CollapsibleDemo() {\n  const [isOpen, setIsOpen] = React.useState(false);\n\n  return (\n    <Card className="w-[350px] gap-0 p-0" size="sm">\n      <Collapsible open={isOpen} onOpenChange={setIsOpen}>\n        <CollapsibleTrigger className="group group/files flex w-full items-center gap-2 rounded-xl px-3 py-2 text-start outline-none hover:bg-accent data-panel-open:rounded-b-none [&:has(+_[data-slot=collapsible-content]:not([hidden]))]:rounded-b-none focus-visible:ring-2 focus-visible:ring-ring/40">\n          <HugeiconsIcon icon={Folder01Icon} aria-hidden="true" className="size-4 shrink-0 text-muted-foreground" />\n          <span className="min-w-0 flex-1">\n            <span className="block text-sm font-medium">Project files</span>\n            <span className="block text-xs text-muted-foreground">3 files in this workspace</span>\n          </span>\n          <RotatingChevron direction="right" className="size-4 shrink-0 text-muted-foreground" />\n        </CollapsibleTrigger>\n        <CollapsibleContent>\n          <Separator />\n          <div className="space-y-1 px-3 pt-2 pb-3">\n            {files.map((file) => (\n              <div key={file} className="flex items-center gap-2 py-1 text-sm">\n                <HugeiconsIcon icon={FileTextIcon} aria-hidden="true" className="size-4 text-muted-foreground" />\n                {file}\n              </div>\n            ))}\n          </div>\n        </CollapsibleContent>\n      </Collapsible>\n    </Card>\n  );\n}\n',
      },
    },
  },
  render: () => <Demo />,
};
