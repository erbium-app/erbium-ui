import { CollapsibleTrigger, CollapsibleContent } from "@erbium/ui/components/collapsible";
import { CollapsibleSettings } from "../examples/upstream/collapsible-settings";
import { CollapsibleBasic } from "../examples/upstream/collapsible-basic";
import { CollapsibleFileTree } from "../examples/upstream/collapsible-file-tree";
import type { Meta, StoryObj } from "@storybook/tanstack-react";
import { Collapsible } from "@erbium/ui/components/collapsible";
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
    <Collapsible key={String(args.defaultOpen)} {...args} className="w-72">
      <CollapsibleTrigger className="rounded border p-2">Show details</CollapsibleTrigger>
      <CollapsibleContent className="p-2">More information is available here.</CollapsibleContent>
    </Collapsible>
  ),
};

export const Overview: Story = {
  parameters: {
    docs: {
      source: {
        code: 'import * as React from "react";\nimport { ChevronsUpDown } from "lucide-react";\n\nimport { Button } from "@erbium/ui/components/button";\nimport {\n  Collapsible,\n  CollapsibleContent,\n  CollapsibleTrigger,\n} from "@erbium/ui/components/collapsible";\n\nexport default function CollapsibleDemo() {\n  const [isOpen, setIsOpen] = React.useState(false);\n\n  return (\n    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="flex w-[350px] flex-col gap-2">\n      <div className="flex items-center justify-between gap-4 px-4">\n        <h4 className="text-sm font-semibold">@peduarte starred 3 repositories</h4>\n        <CollapsibleTrigger\n          render={\n            <Button variant="ghost" size="icon" className="size-8">\n              <ChevronsUpDown />\n              <span className="sr-only">Toggle</span>\n            </Button>\n          }\n        />\n      </div>\n      <div className="rounded-md border px-4 py-2 font-mono text-sm">@radix-ui/primitives</div>\n      <CollapsibleContent className="flex flex-col gap-2">\n        <div className="rounded-md border px-4 py-2 font-mono text-sm">@radix-ui/colors</div>\n        <div className="rounded-md border px-4 py-2 font-mono text-sm">@stitches/react</div>\n      </CollapsibleContent>\n    </Collapsible>\n  );\n}\n',
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
        code: 'import { ChevronRightIcon, FileIcon, FolderIcon } from "lucide-react";\n\nimport { Button } from "@erbium/ui/components/button";\nimport { Card, CardContent, CardHeader } from "@erbium/ui/components/card";\nimport {\n  Collapsible,\n  CollapsibleContent,\n  CollapsibleTrigger,\n} from "@erbium/ui/components/collapsible";\nimport { Tabs, TabsList, TabsTrigger } from "@erbium/ui/components/tabs";\n\ntype FileTreeItem = { name: string } | { name: string; items: FileTreeItem[] };\n\nexport function CollapsibleFileTree() {\n  const fileTree: FileTreeItem[] = [\n    {\n      name: "components",\n      items: [\n        {\n          name: "ui",\n          items: [\n            { name: "button.tsx" },\n            { name: "card.tsx" },\n            { name: "dialog.tsx" },\n            { name: "input.tsx" },\n            { name: "select.tsx" },\n            { name: "table.tsx" },\n          ],\n        },\n        { name: "login-form.tsx" },\n        { name: "register-form.tsx" },\n      ],\n    },\n    {\n      name: "lib",\n      items: [{ name: "utils.ts" }, { name: "cn.ts" }, { name: "api.ts" }],\n    },\n    {\n      name: "hooks",\n      items: [\n        { name: "use-media-query.ts" },\n        { name: "use-debounce.ts" },\n        { name: "use-local-storage.ts" },\n      ],\n    },\n    {\n      name: "types",\n      items: [{ name: "index.d.ts" }, { name: "api.d.ts" }],\n    },\n    {\n      name: "public",\n      items: [{ name: "favicon.ico" }, { name: "logo.svg" }, { name: "images" }],\n    },\n    { name: "app.tsx" },\n    { name: "layout.tsx" },\n    { name: "globals.css" },\n    { name: "package.json" },\n    { name: "tsconfig.json" },\n    { name: "README.md" },\n    { name: ".gitignore" },\n  ];\n\n  const renderItem = (fileItem: FileTreeItem) => {\n    if ("items" in fileItem) {\n      return (\n        <Collapsible key={fileItem.name}>\n          <CollapsibleTrigger\n            render={\n              <Button\n                variant="ghost"\n                size="sm"\n                className="group w-full justify-start transition-none hover:bg-accent hover:text-accent-foreground"\n              />\n            }\n          >\n            <ChevronRightIcon className="transition-transform duration-200 ease-in-out group-data-open:rotate-90" />\n            <FolderIcon />\n            {fileItem.name}\n          </CollapsibleTrigger>\n          <CollapsibleContent className="mt-1 ml-5 style-lyra:ml-4">\n            <div className="flex flex-col gap-1">\n              {fileItem.items.map((child) => renderItem(child))}\n            </div>\n          </CollapsibleContent>\n        </Collapsible>\n      );\n    }\n    return (\n      <Button\n        key={fileItem.name}\n        variant="link"\n        size="sm"\n        className="w-full justify-start gap-2 text-foreground"\n      >\n        <FileIcon />\n        <span>{fileItem.name}</span>\n      </Button>\n    );\n  };\n\n  return (\n    <Card className="mx-auto w-full max-w-[16rem] gap-2" size="sm">\n      <CardHeader>\n        <Tabs defaultValue="explorer">\n          <TabsList className="w-full">\n            <TabsTrigger value="explorer">Explorer</TabsTrigger>\n            <TabsTrigger value="settings">Outline</TabsTrigger>\n          </TabsList>\n        </Tabs>\n      </CardHeader>\n      <CardContent>\n        <div className="flex flex-col gap-1">{fileTree.map((item) => renderItem(item))}</div>\n      </CardContent>\n    </Card>\n  );\n}\n',
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
        code: 'import { ChevronDownIcon } from "lucide-react";\nimport { Button } from "@erbium/ui/components/button";\nimport { Card, CardContent } from "@erbium/ui/components/card";\nimport {\n  Collapsible,\n  CollapsibleContent,\n  CollapsibleTrigger,\n} from "@erbium/ui/components/collapsible";\n\nexport function CollapsibleBasic() {\n  return (\n    <Card className="mx-auto w-full max-w-sm">\n      <CardContent>\n        <Collapsible className="rounded-md data-open:bg-muted">\n          <CollapsibleTrigger render={<Button variant="ghost" className="w-full" />}>\n            Product details\n            <ChevronDownIcon className="ml-auto group-data-panel-open/button:rotate-180" />\n          </CollapsibleTrigger>\n          <CollapsibleContent className="flex flex-col items-start gap-2 p-2.5 pt-0 text-sm">\n            <div>This panel can be expanded or collapsed to reveal additional content.</div>\n            <Button size="xs">Learn More</Button>\n          </CollapsibleContent>\n        </Collapsible>\n      </CardContent>\n    </Card>\n  );\n}\n',
      },
    },
  },
  render: () => <CollapsibleBasic />,
};

export const SettingsPanel: Story = {
  parameters: {
    docs: {
      description: { story: "Use a trigger button to reveal additional settings." },
      source: {
        code: 'import * as React from "react";\nimport { MaximizeIcon, MinimizeIcon } from "lucide-react";\n\nimport { Button } from "@erbium/ui/components/button";\nimport {\n  Card,\n  CardContent,\n  CardDescription,\n  CardHeader,\n  CardTitle,\n} from "@erbium/ui/components/card";\nimport {\n  Collapsible,\n  CollapsibleContent,\n  CollapsibleTrigger,\n} from "@erbium/ui/components/collapsible";\nimport { Field, FieldGroup, FieldLabel } from "@erbium/ui/components/field";\nimport { Input } from "@erbium/ui/components/input";\n\nexport function CollapsibleSettings() {\n  const [isOpen, setIsOpen] = React.useState(false);\n\n  return (\n    <Card className="mx-auto w-full max-w-xs" size="sm">\n      <CardHeader>\n        <CardTitle>Radius</CardTitle>\n        <CardDescription>Set the corner radius of the element.</CardDescription>\n      </CardHeader>\n      <CardContent>\n        <Collapsible open={isOpen} onOpenChange={setIsOpen} className="flex items-start gap-2">\n          <FieldGroup className="grid w-full grid-cols-2 gap-2">\n            <Field>\n              <FieldLabel htmlFor="radius-x" className="sr-only">\n                Radius X\n              </FieldLabel>\n              <Input id="radius" placeholder="0" defaultValue={0} />\n            </Field>\n            <Field>\n              <FieldLabel htmlFor="radius-y" className="sr-only">\n                Radius Y\n              </FieldLabel>\n              <Input id="radius" placeholder="0" defaultValue={0} />\n            </Field>\n            <CollapsibleContent className="col-span-full grid grid-cols-subgrid gap-2">\n              <Field>\n                <FieldLabel htmlFor="radius-x" className="sr-only">\n                  Radius X\n                </FieldLabel>\n                <Input id="radius" placeholder="0" defaultValue={0} />\n              </Field>\n              <Field>\n                <FieldLabel htmlFor="radius-y" className="sr-only">\n                  Radius Y\n                </FieldLabel>\n                <Input id="radius" placeholder="0" defaultValue={0} />\n              </Field>\n            </CollapsibleContent>\n          </FieldGroup>\n          <CollapsibleTrigger render={<Button variant="outline" size="icon" />}>\n            {isOpen ? <MinimizeIcon /> : <MaximizeIcon />}\n          </CollapsibleTrigger>\n        </Collapsible>\n      </CardContent>\n    </Card>\n  );\n}\n',
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
        code: 'import * as React from "react";\nimport { ChevronsUpDown } from "lucide-react";\n\nimport { Button } from "@erbium/ui/components/button";\nimport {\n  Collapsible,\n  CollapsibleContent,\n  CollapsibleTrigger,\n} from "@erbium/ui/components/collapsible";\n\nexport default function CollapsibleDemo() {\n  const [isOpen, setIsOpen] = React.useState(false);\n\n  return (\n    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="flex w-[350px] flex-col gap-2">\n      <div className="flex items-center justify-between gap-4 px-4">\n        <h4 className="text-sm font-semibold">@peduarte starred 3 repositories</h4>\n        <CollapsibleTrigger\n          render={\n            <Button variant="ghost" size="icon" className="size-8">\n              <ChevronsUpDown />\n              <span className="sr-only">Toggle</span>\n            </Button>\n          }\n        />\n      </div>\n      <div className="rounded-md border px-4 py-2 font-mono text-sm">@radix-ui/primitives</div>\n      <CollapsibleContent className="flex flex-col gap-2">\n        <div className="rounded-md border px-4 py-2 font-mono text-sm">@radix-ui/colors</div>\n        <div className="rounded-md border px-4 py-2 font-mono text-sm">@stitches/react</div>\n      </CollapsibleContent>\n    </Collapsible>\n  );\n}\n',
      },
    },
  },
  render: () => <Demo />,
};
