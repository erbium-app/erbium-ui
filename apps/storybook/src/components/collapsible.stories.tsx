import type { Meta, StoryObj } from "@storybook/react-vite";
import { Collapsible } from "@erbium/ui/components/collapsible";
import Demo from "./examples/collapsible-demo";

const meta = {
  title: "UI/Collapsible",
  component: Collapsible,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          'An interactive component which expands/collapses a panel.\n\n**Import:** `@erbium/ui/components/collapsible`  \n\n**shadcn/ui page:** [Collapsible](https://ui.shadcn.com/docs/components/base/collapsible)\n\n### Usage\n\n```tsx\nimport {\n  Collapsible,\n  CollapsibleContent,\n  CollapsibleTrigger,\n} from "@erbium/ui/components/collapsible"\n```\n\n```tsx\n<Collapsible>\n  <CollapsibleTrigger>Can I use this in my project?</CollapsibleTrigger>\n  <CollapsibleContent>\n    Yes. Free to use for personal and commercial projects. No attribution\n    required.\n  </CollapsibleContent>\n</Collapsible>\n```\n\n### Composition\n\nUse the following composition to build a `Collapsible`:\n\n```text\nCollapsible\n├── CollapsibleTrigger\n└── CollapsibleContent\n```\n\n### Controlled State\n\nUse the `open` and `onOpenChange` props to control the state.\n\n```tsx\nimport * as React from "react"\n\nexport function Example() {\n  const [open, setOpen] = React.useState(false)\n\n  return (\n    <Collapsible open={open} onOpenChange={setOpen}>\n      <CollapsibleTrigger>Toggle</CollapsibleTrigger>\n      <CollapsibleContent>Content</CollapsibleContent>\n    </Collapsible>\n  )\n}\n```\n\n### Basic\n\nstyleName="base-nova"\n\nname="collapsible-basic"\n\nalign="start"\n\n/>\n\n### Settings Panel\n\nUse a trigger button to reveal additional settings.\n\n### File Tree\n\nUse nested collapsibles to build a file tree.\n\nstyleName="base-nova"\n\nname="collapsible-file-tree"\n\npreviewClassName="h-[36rem]"\n\n/>',
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj;

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
