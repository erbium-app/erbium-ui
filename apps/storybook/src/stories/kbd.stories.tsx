import ExampleKbdGroup from "../examples/kbd-group";
import ExampleKbdButton from "../examples/kbd-button";
import ExampleKbdTooltip from "../examples/kbd-tooltip";
import ExampleKbdInputGroup from "../examples/kbd-input-group";
import type { Meta, StoryObj } from "@storybook/tanstack-react";
import { Kbd } from "@erbium/ui/components/kbd";
import Demo from "../examples/kbd-demo";

const meta = {
  title: "UI/Kbd",
  component: Kbd,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          'Used to display textual user input from keyboard.\n\n**Import:** `@erbium/ui/components/kbd`  \n\n**shadcn/ui page:** [Kbd](https://ui.shadcn.com/docs/components/base/kbd)\n\n### Usage\n\n```tsx\nimport { Kbd } from "@erbium/ui/components/kbd"\n```\n\n```tsx\n<Kbd>Ctrl</Kbd>\n```\n\n### Composition\n\nUse the following composition to build `Kbd` and `KbdGroup`:\n\n```text\nKbd\nKbdGroup\n├── Kbd\n└── Kbd\n```',
      },
    },
  },
} satisfies Meta<typeof Kbd>;

export default meta;
type Story = StoryObj;

export const Playground: StoryObj<typeof Kbd> = {
  args: { children: "⌘ K", className: "" },
  argTypes: {},
  render: (args) => <Kbd {...args} />,
};

export const Overview: Story = {
  parameters: {
    docs: {
      source: {
        code: 'import { Kbd, KbdGroup } from "@erbium/ui/components/kbd";\n\nexport default function KbdDemo() {\n  return (\n    <div className="flex flex-col items-center gap-4">\n      <KbdGroup>\n        <Kbd>⌘</Kbd>\n        <Kbd>⇧</Kbd>\n        <Kbd>⌥</Kbd>\n        <Kbd>⌃</Kbd>\n      </KbdGroup>\n      <KbdGroup>\n        <Kbd>Ctrl</Kbd>\n        <span>+</span>\n        <Kbd>B</Kbd>\n      </KbdGroup>\n    </div>\n  );\n}\n',
      },
    },
  },
  render: () => (
    <div className="w-full min-w-72 max-w-2xl p-4">
      <Demo />
    </div>
  ),
};

export const Group: Story = {
  parameters: {
    docs: {
      description: { story: "Use the `KbdGroup` component to group keyboard keys together." },

      source: {
        code: 'import { Kbd, KbdGroup } from "@erbium/ui/components/kbd"\n\nexport default function KbdGroupExample() {\n  return (\n    <div className="flex flex-col items-center gap-4">\n      <p className="text-sm text-muted-foreground">\n        Use{" "}\n        <KbdGroup>\n          <Kbd>Ctrl + B</Kbd>\n          <Kbd>Ctrl + K</Kbd>\n        </KbdGroup>{" "}\n        to open the command palette\n      </p>\n    </div>\n  )\n}\n',
      },
    },
  },
  render: () => (
    <div className="w-full min-w-72 max-w-2xl p-4">
      <ExampleKbdGroup />
    </div>
  ),
};
export const Button: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Use the `Kbd` component inside a `Button` component to display a keyboard key inside a button.",
      },

      source: {
        code: 'import { Button } from "@erbium/ui/components/button"\nimport { Kbd } from "@erbium/ui/components/kbd"\n\nexport default function KbdButton() {\n  return (\n    <div className="flex flex-wrap items-center gap-4">\n      <Button variant="outline" size="sm" className="pr-2">\n        Accept <Kbd>⏎</Kbd>\n      </Button>\n      <Button variant="outline" size="sm" className="pr-2">\n        Cancel <Kbd>Esc</Kbd>\n      </Button>\n    </div>\n  )\n}\n',
      },
    },
  },
  render: () => (
    <div className="w-full min-w-72 max-w-2xl p-4">
      <ExampleKbdButton />
    </div>
  ),
};
export const Tooltip: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "You can use the `Kbd` component inside a `Tooltip` component to display a tooltip with a keyboard key.",
      },

      source: {
        code: 'import { Button } from "@erbium/ui/components/button"\nimport { ButtonGroup } from "@erbium/ui/components/button-group"\nimport { Kbd, KbdGroup } from "@erbium/ui/components/kbd"\nimport {\n  Tooltip,\n  TooltipContent,\n  TooltipTrigger,\n} from "@erbium/ui/components/tooltip"\n\nexport default function KbdTooltip() {\n  return (\n    <div className="flex flex-wrap gap-4">\n      <ButtonGroup>\n        <Tooltip>\n          <TooltipTrigger render={<Button size="sm" variant="outline">\n              Save\n            </Button>} />\n          <TooltipContent>\n            Save Changes <Kbd>S</Kbd>\n          </TooltipContent>\n        </Tooltip>\n        <Tooltip>\n          <TooltipTrigger render={<Button size="sm" variant="outline">\n              Print\n            </Button>} />\n          <TooltipContent>\n            Print Document{" "}\n            <KbdGroup>\n              <Kbd>Ctrl</Kbd>\n              <Kbd>P</Kbd>\n            </KbdGroup>\n          </TooltipContent>\n        </Tooltip>\n      </ButtonGroup>\n    </div>\n  )\n}\n',
      },
    },
  },
  render: () => (
    <div className="w-full min-w-72 max-w-2xl p-4">
      <ExampleKbdTooltip />
    </div>
  ),
};
export const InputGroup: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "You can use the `Kbd` component inside a `InputGroupAddon` component to display a keyboard key inside an input group.",
      },

      source: {
        code: 'import { SearchIcon } from "lucide-react"\n\nimport {\n  InputGroup,\n  InputGroupAddon,\n  InputGroupInput,\n} from "@erbium/ui/components/input-group"\nimport { Kbd } from "@erbium/ui/components/kbd"\n\nexport default function KbdInputGroup() {\n  return (\n    <div className="flex w-full max-w-xs flex-col gap-6">\n      <InputGroup>\n        <InputGroupInput placeholder="Search..." />\n        <InputGroupAddon>\n          <SearchIcon />\n        </InputGroupAddon>\n        <InputGroupAddon align="inline-end">\n          <Kbd>⌘</Kbd>\n          <Kbd>K</Kbd>\n        </InputGroupAddon>\n      </InputGroup>\n    </div>\n  )\n}\n',
      },
    },
  },
  render: () => (
    <div className="w-full min-w-72 max-w-2xl p-4">
      <ExampleKbdInputGroup />
    </div>
  ),
};
