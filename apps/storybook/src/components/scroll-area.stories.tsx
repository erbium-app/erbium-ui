import type { Meta, StoryObj } from "@storybook/tanstack-react";
import { ScrollArea } from "@erbium/ui/components/scroll-area";
import Demo from "./examples/scroll-area-demo";

const meta = {
  title: "UI/Scroll Area",
  component: ScrollArea,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          'Augments native scroll functionality for custom, cross-browser styling.\n\n**Import:** `@erbium/ui/components/scroll-area`  \n\n**shadcn/ui page:** [Scroll Area](https://ui.shadcn.com/docs/components/base/scroll-area)\n\n### Usage\n\n```tsx\nimport { ScrollArea, ScrollBar } from "@erbium/ui/components/scroll-area"\n```\n\n```tsx\n<ScrollArea className="h-[200px] w-[350px] rounded-md border p-4">\n  Your scrollable content here.\n</ScrollArea>\n```\n\n### Composition\n\nUse the following composition to build a `ScrollArea`:\n\n```text\nScrollArea\n└── ScrollBar\n```\n\n### Horizontal\n\nUse `ScrollBar` with `orientation="horizontal"` for horizontal scrolling.',
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
        code: 'import * as React from "react";\n\nimport { ScrollArea } from "@erbium/ui/components/scroll-area";\nimport { Separator } from "@erbium/ui/components/separator";\n\nconst tags = Array.from({ length: 50 }).map((_, i, a) => `v1.2.0-beta.${a.length - i}`);\n\nexport default function ScrollAreaDemo() {\n  return (\n    <ScrollArea className="h-72 w-48 rounded-md border">\n      <div className="p-4">\n        <h4 className="mb-4 text-sm leading-none font-medium">Tags</h4>\n        {tags.map((tag) => (\n          <React.Fragment key={tag}>\n            <div className="text-sm">{tag}</div>\n            <Separator className="my-2" />\n          </React.Fragment>\n        ))}\n      </div>\n    </ScrollArea>\n  );\n}\n',
      },
    },
  },
  render: () => (
    <div className="w-full min-w-72 max-w-2xl p-4">
      <Demo />
    </div>
  ),
};
