import type { Meta, StoryObj } from "@storybook/tanstack-react";
import { Switch } from "@erbium/ui/components/switch";
import Demo from "../examples/switch-demo";

const meta = {
  title: "UI/Switch",
  component: Switch,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          'A control that allows the user to toggle between checked and not checked.\n\n**Import:** `@erbium/ui/components/switch`  \n\n**shadcn/ui page:** [Switch](https://ui.shadcn.com/docs/components/base/switch)\n\n### Usage\n\n```tsx\nimport { Switch } from "@erbium/ui/components/switch"\n```\n\n```tsx\n<Switch />\n```\n\n### Description\n\n### Choice Card\n\nCard-style selection where `FieldLabel` wraps the entire `Field` for a clickable card pattern.\n\n### Disabled\n\nAdd the `disabled` prop to the `Switch` component to disable the switch. Add the `data-disabled` prop to the `Field` component for styling.\n\n### Invalid\n\nAdd the `aria-invalid` prop to the `Switch` component to indicate an invalid state. Add the `data-invalid` prop to the `Field` component for styling.\n\n### Size\n\nUse the `size` prop to change the size of the switch.',
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
        code: 'import { Label } from "@erbium/ui/components/label";\nimport { Switch } from "@erbium/ui/components/switch";\n\nexport default function SwitchDemo() {\n  return (\n    <div className="flex items-center space-x-2">\n      <Switch id="airplane-mode" />\n      <Label htmlFor="airplane-mode">Airplane Mode</Label>\n    </div>\n  );\n}\n',
      },
    },
  },
  render: () => (
    <div className="w-full min-w-72 max-w-2xl p-4">
      <Demo />
    </div>
  ),
};

export const On: Story = { render: () => <Switch defaultChecked aria-label="Notifications" /> };
export const Disabled: Story = { render: () => <Switch disabled aria-label="Unavailable" /> };
