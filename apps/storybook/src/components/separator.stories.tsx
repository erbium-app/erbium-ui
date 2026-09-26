import type { Meta, StoryObj } from "@storybook/tanstack-react";
import { Separator } from "@erbium/ui/components/separator";
import Demo from "./examples/separator-demo";

const meta = {
  title: "UI/Separator",
  component: Separator,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          'Visually or semantically separates content.\n\n**Import:** `@erbium/ui/components/separator`  \n\n**shadcn/ui page:** [Separator](https://ui.shadcn.com/docs/components/base/separator)\n\n### Usage\n\n```tsx\nimport { Separator } from "@erbium/ui/components/separator"\n```\n\n```tsx\n<Separator />\n```\n\n### Vertical\n\nUse `orientation="vertical"` for a vertical separator.\n\n### Menu\n\nVertical separators between menu items with descriptions.\n\n### List\n\nHorizontal separators between list items.',
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
        code: 'import { Separator } from "@erbium/ui/components/separator";\n\nexport default function SeparatorDemo() {\n  return (\n    <div>\n      <div className="space-y-1">\n        <h4 className="text-sm leading-none font-medium">Radix Primitives</h4>\n        <p className="text-sm text-muted-foreground">An open-source UI component library.</p>\n      </div>\n      <Separator className="my-4" />\n      <div className="flex h-5 items-center space-x-4 text-sm">\n        <div>Blog</div>\n        <Separator orientation="vertical" />\n        <div>Docs</div>\n        <Separator orientation="vertical" />\n        <div>Source</div>\n      </div>\n    </div>\n  );\n}\n',
      },
    },
  },
  render: () => (
    <div className="w-full min-w-72 max-w-2xl p-4">
      <Demo />
    </div>
  ),
};
