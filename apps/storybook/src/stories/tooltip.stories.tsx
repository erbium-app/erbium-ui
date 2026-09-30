import { Tooltip, TooltipTrigger, TooltipContent } from "@erbium/ui/components/tooltip";
import { Button } from "@erbium/ui/components/button";
import { TooltipDisabled } from "../examples/upstream/tooltip-disabled";
import { TooltipKeyboard } from "../examples/upstream/tooltip-keyboard";
import { TooltipSides } from "../examples/upstream/tooltip-sides";
import type { Meta, StoryObj } from "@storybook/tanstack-react";
import Demo from "../examples/tooltip-demo";

const meta = {
  title: "UI/Tooltip",
  component: Tooltip,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          'A popup that displays information related to an element when the element receives keyboard focus or the mouse hovers over it.\n\n**Import:** `@erbium/ui/components/tooltip`  \n\n**shadcn/ui page:** [Tooltip](https://ui.shadcn.com/docs/components/base/tooltip)\n\n### Usage\n\n```tsx\nimport {\n  Tooltip,\n  TooltipContent,\n  TooltipTrigger,\n} from "@erbium/ui/components/tooltip"\nimport {{ Button }} from "@erbium/ui/components/button"\n```\n\n```tsx\n<Tooltip>\n  <TooltipTrigger render={<Button variant="outline">Hover</Button>} />\n  <TooltipContent>\n    <p>Add to library</p>\n  </TooltipContent>\n</Tooltip>\n```\n\n### Composition\n\nUse the following composition to build a `Tooltip`:\n\n```text\nTooltip\n├── TooltipTrigger\n└── TooltipContent\n```',
      },
    },
  },
} satisfies Meta<typeof Tooltip>;

export default meta;
type Story = StoryObj;

export const Playground: StoryObj<{
  side: "top" | "right" | "bottom" | "left";
  align: "start" | "center" | "end";
  sideOffset: number;
  defaultOpen: boolean;
}> = {
  args: { side: "top", align: "center", sideOffset: 4, defaultOpen: false },
  argTypes: {
    side: { control: "select", options: ["top", "right", "bottom", "left"] },
    align: { control: "select", options: ["start", "center", "end"] },
    sideOffset: { control: "number" },
    defaultOpen: { control: "boolean" },
  },
  render: (args) => (
    <Tooltip key={String(args.defaultOpen)} defaultOpen={args.defaultOpen}>
      <TooltipTrigger render={<Button variant="outline">Hover for tooltip</Button>} />
      <TooltipContent side={args.side} align={args.align} sideOffset={args.sideOffset}>
        Helpful information
      </TooltipContent>
    </Tooltip>
  ),
};

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

export const Side: Story = {
  parameters: {
    docs: {
      description: { story: "Use the `side` prop to change the position of the tooltip." },
      source: {
        code: 'import { Button } from "@erbium/ui/components/button";\nimport { Tooltip, TooltipContent, TooltipTrigger } from "@erbium/ui/components/tooltip";\n\nexport function TooltipSides() {\n  return (\n    <div className="flex flex-wrap gap-2">\n      {(["left", "top", "bottom", "right"] as const).map((side) => (\n        <Tooltip key={side}>\n          <TooltipTrigger render={<Button variant="outline" className="w-fit capitalize" />}>\n            {side}\n          </TooltipTrigger>\n          <TooltipContent side={side}>\n            <p>Add to library</p>\n          </TooltipContent>\n        </Tooltip>\n      ))}\n    </div>\n  );\n}\n',
      },
    },
  },
  render: () => <TooltipSides />,
};

export const WithKeyboardShortcut: Story = {
  parameters: {
    docs: {
      description: { story: "Show a keyboard shortcut in tooltip content." },

      source: {
        code: 'import { HugeiconsIcon } from "@hugeicons/react";\nimport SaveIcon from "@hugeicons/core-free-icons/SaveIcon";\n\n\nimport { Button } from "@erbium/ui/components/button";\nimport { Kbd } from "@erbium/ui/components/kbd";\nimport { Tooltip, TooltipContent, TooltipTrigger } from "@erbium/ui/components/tooltip";\n\nexport function TooltipKeyboard() {\n  return (\n    <Tooltip>\n      <TooltipTrigger render={<Button variant="outline" size="icon-sm" />}>\n        <HugeiconsIcon icon={SaveIcon} />\n      </TooltipTrigger>\n      <TooltipContent>\n        Save Changes <Kbd hotkey="S" />\n      </TooltipContent>\n    </Tooltip>\n  );\n}\n',
      },
    },
  },
  render: () => <TooltipKeyboard />,
};

export const DisabledButton: Story = {
  parameters: {
    docs: {
      description: { story: "Show a tooltip on a disabled button by wrapping it with a span." },
      source: {
        code: 'import { Button } from "@erbium/ui/components/button";\nimport { Tooltip, TooltipContent, TooltipTrigger } from "@erbium/ui/components/tooltip";\n\nexport function TooltipDisabled() {\n  return (\n    <>\n      <Tooltip>\n        <TooltipTrigger render={<span className="inline-block w-fit" />}>\n          <Button variant="outline" disabled>\n            Disabled\n          </Button>\n        </TooltipTrigger>\n        <TooltipContent>\n          <p>This feature is currently unavailable</p>\n        </TooltipContent>\n      </Tooltip>\n    </>\n  );\n}\n',
      },
    },
  },
  render: () => <TooltipDisabled />,
};
