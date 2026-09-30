import { ToggleSizes } from "../examples/upstream/toggle-sizes";
import { ToggleText } from "../examples/upstream/toggle-text";
import ExampleToggleOutline from "../examples/toggle-outline";
import ExampleToggleDisabled from "../examples/toggle-disabled";
import type { Meta, StoryObj } from "@storybook/tanstack-react";
import { Toggle } from "@erbium/ui/components/toggle";
import Demo from "../examples/toggle-demo";

const meta = {
  title: "UI/Toggle",
  component: Toggle,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          'A two-state button that can be either on or off.\n\n**Import:** `@erbium/ui/components/toggle`  \n\n**shadcn/ui page:** [Toggle](https://ui.shadcn.com/docs/components/base/toggle)\n\n### Usage\n\n```tsx\nimport { Toggle } from "@erbium/ui/components/toggle"\n```\n\n```tsx\n<Toggle>Toggle</Toggle>\n```',
      },
    },
  },
} satisfies Meta<typeof Toggle>;

export default meta;
type Story = StoryObj;

export const Playground: StoryObj<typeof Toggle> = {
  args: { variant: "default", size: "default", defaultPressed: false, className: "" },
  argTypes: {
    variant: { control: "select", options: ["default", "outline"] },
    size: { control: "select", options: ["default", "sm", "lg"] },
    defaultPressed: { control: "boolean" },
  },
  render: (args) => <Toggle {...args}>Toggle</Toggle>,
};

export const Overview: Story = {
  parameters: {
    docs: {
      source: {
        code: 'import { HugeiconsIcon } from "@hugeicons/react";\nimport Bookmark01Icon from "@hugeicons/core-free-icons/Bookmark01Icon";\n\n\nimport { Toggle } from "@erbium/ui/components/toggle";\n\nexport default function ToggleDemo() {\n  return (\n    <Toggle\n      aria-label="Toggle bookmark"\n      size="sm"\n      variant="outline"\n      className="data-[state=on]:bg-transparent data-[state=on]:*:[svg]:fill-info data-[state=on]:*:[svg]:stroke-info"\n    >\n      <HugeiconsIcon icon={Bookmark01Icon} />\n      Bookmark\n    </Toggle>\n  );\n}\n',
      },
    },
  },
  render: () => (
    <div className="w-full min-w-72 max-w-2xl p-4">
      <Demo />
    </div>
  ),
};

export const Pressed: Story = {
  parameters: {
    docs: {
      description: { story: "Start a toggle in the pressed state." },
    },
  },

  render: () => (
    <Toggle defaultPressed aria-label="Bold">
      Bold
    </Toggle>
  ),
};
export const DisabledControl: Story = {
  parameters: {
    docs: {
      description: { story: "Disable a toggle to prevent interaction." },
    },
  },

  render: () => (
    <Toggle disabled aria-label="Unavailable">
      Disabled
    </Toggle>
  ),
};

export const Outline: Story = {
  parameters: {
    docs: {
      description: { story: 'Use `variant="outline"` for an outline style.' },

      source: {
        code: 'import { HugeiconsIcon } from "@hugeicons/react";\nimport ItalicIcon from "@hugeicons/core-free-icons/ItalicIcon";\n\n\nimport { Toggle } from "@erbium/ui/components/toggle"\n\nexport default function ToggleOutline() {\n  return (\n    <Toggle variant="outline" aria-label="Toggle italic">\n      <HugeiconsIcon icon={ItalicIcon} />\n    </Toggle>\n  )\n}\n',
      },
    },
  },
  render: () => (
    <div className="w-full min-w-72 max-w-2xl p-4">
      <ExampleToggleOutline />
    </div>
  ),
};
export const Disabled: Story = {
  parameters: {
    docs: {
      description: { story: "Show a disabled toggle." },

      source: {
        code: 'import { HugeiconsIcon } from "@hugeicons/react";\nimport UnderlineIcon from "@hugeicons/core-free-icons/UnderlineIcon";\n\n\nimport { Toggle } from "@erbium/ui/components/toggle"\n\nexport default function ToggleDisabled() {\n  return (\n    <Toggle aria-label="Toggle italic" disabled>\n      <HugeiconsIcon icon={UnderlineIcon} className="h-4 w-4" />\n    </Toggle>\n  )\n}\n',
      },
    },
  },
  render: () => (
    <div className="w-full min-w-72 max-w-2xl p-4">
      <ExampleToggleDisabled />
    </div>
  ),
};

export const WithText: Story = {
  parameters: {
    docs: {
      description: { story: "Pair a toggle icon with a text label." },

      source: {
        code: 'import { HugeiconsIcon } from "@hugeicons/react";\nimport ItalicIcon from "@hugeicons/core-free-icons/ItalicIcon";\n\n\nimport { Toggle } from "@erbium/ui/components/toggle";\n\nexport function ToggleText() {\n  return (\n    <Toggle aria-label="Toggle italic">\n      <HugeiconsIcon icon={ItalicIcon} />\n      Italic\n    </Toggle>\n  );\n}\n',
      },
    },
  },
  render: () => <ToggleText />,
};

export const Size: Story = {
  parameters: {
    docs: {
      description: { story: "Use the `size` prop to change the size of the toggle." },
      source: {
        code: 'import { Toggle } from "@erbium/ui/components/toggle";\n\nexport function ToggleSizes() {\n  return (\n    <div className="flex flex-wrap items-center gap-2">\n      <Toggle variant="outline" aria-label="Toggle small" size="sm">\n        Small\n      </Toggle>\n      <Toggle variant="outline" aria-label="Toggle default" size="default">\n        Default\n      </Toggle>\n      <Toggle variant="outline" aria-label="Toggle large" size="lg">\n        Large\n      </Toggle>\n    </div>\n  );\n}\n',
      },
    },
  },
  render: () => <ToggleSizes />,
};
