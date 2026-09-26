import ExampleToggleOutline from "./examples/toggle-outline";
import ExampleToggleDisabled from "./examples/toggle-disabled";
import type { Meta, StoryObj } from "@storybook/tanstack-react";
import { Toggle } from "@erbium/ui/components/toggle";
import Demo from "./examples/toggle-demo";

const meta = {
  title: "UI/Toggle",
  component: Toggle,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          'A two-state button that can be either on or off.\n\n**Import:** `@erbium/ui/components/toggle`  \n\n**shadcn/ui page:** [Toggle](https://ui.shadcn.com/docs/components/base/toggle)\n\n### Usage\n\n```tsx\nimport { Toggle } from "@erbium/ui/components/toggle"\n```\n\n```tsx\n<Toggle>Toggle</Toggle>\n```\n\n### Outline\n\nUse `variant="outline"` for an outline style.\n\n### With Text\n\n### Size\n\nUse the `size` prop to change the size of the toggle.\n\n### Disabled',
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
        code: 'import { BookmarkIcon } from "lucide-react";\n\nimport { Toggle } from "@erbium/ui/components/toggle";\n\nexport default function ToggleDemo() {\n  return (\n    <Toggle\n      aria-label="Toggle bookmark"\n      size="sm"\n      variant="outline"\n      className="data-[state=on]:bg-transparent data-[state=on]:*:[svg]:fill-blue-500 data-[state=on]:*:[svg]:stroke-blue-500"\n    >\n      <BookmarkIcon />\n      Bookmark\n    </Toggle>\n  );\n}\n',
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
  render: () => (
    <Toggle defaultPressed aria-label="Bold">
      Bold
    </Toggle>
  ),
};
export const DisabledControl: Story = {
  render: () => (
    <Toggle disabled aria-label="Unavailable">
      Disabled
    </Toggle>
  ),
};

export const Outline: Story = {
  parameters: {
    docs: {
      source: {
        code: 'import { Italic } from "lucide-react"\n\nimport { Toggle } from "@erbium/ui/components/toggle"\n\nexport default function ToggleOutline() {\n  return (\n    <Toggle variant="outline" aria-label="Toggle italic">\n      <Italic />\n    </Toggle>\n  )\n}\n',
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
      source: {
        code: 'import { Underline } from "lucide-react"\n\nimport { Toggle } from "@erbium/ui/components/toggle"\n\nexport default function ToggleDisabled() {\n  return (\n    <Toggle aria-label="Toggle italic" disabled>\n      <Underline className="h-4 w-4" />\n    </Toggle>\n  )\n}\n',
      },
    },
  },
  render: () => (
    <div className="w-full min-w-72 max-w-2xl p-4">
      <ExampleToggleDisabled />
    </div>
  ),
};
