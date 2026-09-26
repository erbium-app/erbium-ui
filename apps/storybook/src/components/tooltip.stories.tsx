import type { Meta, StoryObj } from "@storybook/tanstack-react";
import { Tooltip } from "@erbium/ui/components/tooltip";
import Demo from "./examples/tooltip-demo";

const meta = {
  title: "UI/Tooltip",
  component: Tooltip,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          'A popup that displays information related to an element when the element receives keyboard focus or the mouse hovers over it.\n\n**Import:** `@erbium/ui/components/tooltip`  \n\n**shadcn/ui page:** [Tooltip](https://ui.shadcn.com/docs/components/base/tooltip)\n\n### Usage\n\n```tsx\nimport {\n  Tooltip,\n  TooltipContent,\n  TooltipTrigger,\n} from "@erbium/ui/components/tooltip"\n```\n\n```tsx\n<Tooltip>\n  <TooltipTrigger>Hover</TooltipTrigger>\n  <TooltipContent>\n    <p>Add to library</p>\n  </TooltipContent>\n</Tooltip>\n```\n\n### Composition\n\nUse the following composition to build a `Tooltip`:\n\n```text\nTooltip\n├── TooltipTrigger\n└── TooltipContent\n```\n\n### Side\n\nUse the `side` prop to change the position of the tooltip.\n\n### With Keyboard Shortcut\n\n### Disabled Button\n\nShow a tooltip on a disabled button by wrapping it with a span.',
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
        code: 'import { Button } from "@erbium/ui/components/button";\nimport { Tooltip, TooltipContent, TooltipTrigger } from "@erbium/ui/components/tooltip";\n\nexport default function TooltipDemo() {\n  return (\n    <Tooltip>\n      <TooltipTrigger render={<Button variant="outline">Hover</Button>} />\n      <TooltipContent>\n        <p>Add to library</p>\n      </TooltipContent>\n    </Tooltip>\n  );\n}\n',
      },
    },
  },
  render: () => (
    <div className="w-full min-w-72 max-w-2xl p-4">
      <Demo />
    </div>
  ),
};
