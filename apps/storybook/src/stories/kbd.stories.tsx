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
          'Displays a platform-aware shortcut. Pass the stored binding to `hotkey`; TanStack Hotkeys formats it for macOS, Windows, or Linux.\n\n**Import:** `@erbium/ui/components/kbd`\n\n```tsx\n<Kbd hotkey="Mod+K" />\n```',
      },
    },
  },
} satisfies Meta<typeof Kbd>;

export default meta;
type Story = StoryObj;

export const Playground: StoryObj<typeof Kbd> = {
  args: { hotkey: "Mod+K", className: "" },
  argTypes: {},
  render: (args) => <Kbd {...args} />,
};

export const Overview: Story = {
  parameters: {
    docs: {
      source: {
        code: 'import { Kbd } from "@erbium/ui/components/kbd";\n\nexport default function KbdDemo() {\n  return (\n    <div className="flex flex-wrap items-center justify-center gap-2">\n      <Kbd hotkey="Mod+Shift+K" />\n      <Kbd hotkey="Mod+B" />\n      <Kbd hotkey="Escape" />\n    </div>\n  );\n}\n',
      },
    },
  },
  render: () => (
    <div className="w-full min-w-72 max-w-2xl p-4">
      <Demo />
    </div>
  ),
};

export const Button: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Use `ButtonShortcut` for a platform-aware key hint with button spacing and RTL support.",
      },

      source: {
        code: 'import { Button, ButtonShortcut } from "@erbium/ui/components/button";\nimport { DirectionProvider } from "@erbium/ui/components/direction";\n\nexport default function KbdButton() {\n  return (\n    <div className="flex flex-wrap items-center gap-4">\n      <Button variant="outline" size="sm">\n        Accept\n        <ButtonShortcut hotkey="Enter" />\n      </Button>\n      <Button variant="outline" size="sm">\n        Cancel\n        <ButtonShortcut hotkey="Escape" />\n      </Button>\n      <DirectionProvider direction="rtl">\n        <div dir="rtl">\n          <Button variant="outline" size="sm">\n            قبول\n            <ButtonShortcut hotkey="Enter" />\n          </Button>\n        </div>\n      </DirectionProvider>\n    </div>\n  );\n}\n',
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
        code: 'import { Button } from "@erbium/ui/components/button"\nimport { ButtonGroup } from "@erbium/ui/components/button-group"\nimport { Kbd } from "@erbium/ui/components/kbd"\nimport {\n  Tooltip,\n  TooltipContent,\n  TooltipTrigger,\n} from "@erbium/ui/components/tooltip"\n\nexport default function KbdTooltip() {\n  return (\n    <div className="flex flex-wrap gap-4">\n      <ButtonGroup>\n        <Tooltip>\n          <TooltipTrigger render={<Button size="sm" variant="outline">\n              Save\n            </Button>} />\n          <TooltipContent>\n            Save Changes <Kbd hotkey="S" />\n          </TooltipContent>\n        </Tooltip>\n        <Tooltip>\n          <TooltipTrigger render={<Button size="sm" variant="outline">\n              Print\n            </Button>} />\n          <TooltipContent>\n            Print Document{" "}\n            <Kbd hotkey="Mod+P" />\n          </TooltipContent>\n        </Tooltip>\n      </ButtonGroup>\n    </div>\n  )\n}\n',
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
        code: 'import { HugeiconsIcon } from "@hugeicons/react";\nimport Search01Icon from "@hugeicons/core-free-icons/Search01Icon";\n\n\nimport {\n  InputGroup,\n  InputGroupAddon,\n  InputGroupInput,\n} from "@erbium/ui/components/input-group"\nimport { Kbd } from "@erbium/ui/components/kbd"\n\nexport default function KbdInputGroup() {\n  return (\n    <div className="flex w-full max-w-xs flex-col gap-6">\n      <InputGroup>\n        <InputGroupInput placeholder="Search..." />\n        <InputGroupAddon>\n          <HugeiconsIcon icon={Search01Icon} />\n        </InputGroupAddon>\n        <InputGroupAddon align="inline-end">\n          <Kbd hotkey="Mod+K" />\n        </InputGroupAddon>\n      </InputGroup>\n    </div>\n  )\n}\n',
      },
    },
  },
  render: () => (
    <div className="w-full min-w-72 max-w-2xl p-4">
      <ExampleKbdInputGroup />
    </div>
  ),
};
