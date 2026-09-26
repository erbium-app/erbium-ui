import ExampleCheckboxDisabled from "./examples/checkbox-disabled";
import type { Meta, StoryObj } from "@storybook/tanstack-react";
import { Checkbox } from "@erbium/ui/components/checkbox";
import Demo from "./examples/checkbox-demo";

const meta = {
  title: "UI/Checkbox",
  component: Checkbox,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          'A control that allows the user to toggle between checked and not checked.\n\n**Import:** `@erbium/ui/components/checkbox`  \n\n**shadcn/ui page:** [Checkbox](https://ui.shadcn.com/docs/components/base/checkbox)\n\n### Usage\n\n```tsx\nimport { Checkbox } from "@erbium/ui/components/checkbox"\n```\n\n```tsx\n<Checkbox />\n```\n\n### Checked State\n\nUse `defaultChecked` for uncontrolled checkboxes, or `checked` and\n\n`onCheckedChange` to control the state.\n\n```tsx\nimport * as React from "react"\n\nexport function Example() {\n  const [checked, setChecked] = React.useState(false)\n\n  return <Checkbox checked={checked} onCheckedChange={setChecked} />\n}\n```\n\n### Invalid State\n\nSet `aria-invalid` on the checkbox and `data-invalid` on the field wrapper to\n\nshow the invalid styles.\n\n### Basic\n\nPair the checkbox with `Field` and `FieldLabel` for proper layout and labeling.\n\n### Description\n\nUse `FieldContent` and `FieldDescription` for helper text.\n\n### Disabled\n\nUse the `disabled` prop to prevent interaction and add the `data-disabled` attribute to the `<Field>` component for disabled styles.\n\n### Group\n\nUse multiple fields to create a checkbox list.\n\n### Table\n\nstyleName="base-nova"\n\nname="checkbox-table"\n\npreviewClassName="p-4 md:p-8"\n\n/>',
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
        code: 'import { Checkbox } from "@erbium/ui/components/checkbox";\nimport { Label } from "@erbium/ui/components/label";\n\nexport default function CheckboxDemo() {\n  return (\n    <div className="flex flex-col gap-6">\n      <div className="flex items-center gap-3">\n        <Checkbox id="terms" />\n        <Label htmlFor="terms">Accept terms and conditions</Label>\n      </div>\n      <div className="flex items-start gap-3">\n        <Checkbox id="terms-2" defaultChecked />\n        <div className="grid gap-2">\n          <Label htmlFor="terms-2">Accept terms and conditions</Label>\n          <p className="text-sm text-muted-foreground">\n            By clicking this checkbox, you agree to the terms and conditions.\n          </p>\n        </div>\n      </div>\n      <div className="flex items-start gap-3">\n        <Checkbox id="toggle" disabled />\n        <Label htmlFor="toggle">Enable notifications</Label>\n      </div>\n      <Label className="flex items-start gap-3 rounded-lg border p-3 hover:bg-accent/50 has-[[aria-checked=true]]:border-blue-600 has-[[aria-checked=true]]:bg-blue-50 dark:has-[[aria-checked=true]]:border-blue-900 dark:has-[[aria-checked=true]]:bg-blue-950">\n        <Checkbox\n          id="toggle-2"\n          defaultChecked\n          className="data-[state=checked]:border-blue-600 data-[state=checked]:bg-blue-600 data-[state=checked]:text-white dark:data-[state=checked]:border-blue-700 dark:data-[state=checked]:bg-blue-700"\n        />\n        <div className="grid gap-1.5 font-normal">\n          <p className="text-sm leading-none font-medium">Enable notifications</p>\n          <p className="text-sm text-muted-foreground">\n            You can enable or disable notifications at any time.\n          </p>\n        </div>\n      </Label>\n    </div>\n  );\n}\n',
      },
    },
  },
  render: () => (
    <div className="w-full min-w-72 max-w-2xl p-4">
      <Demo />
    </div>
  ),
};

export const Checked: Story = { render: () => <Checkbox defaultChecked aria-label="Selected" /> };
export const DisabledControl: Story = {
  render: () => <Checkbox disabled aria-label="Unavailable" />,
};

export const Disabled: Story = {
  parameters: {
    docs: {
      source: {
        code: 'import { Checkbox } from "@erbium/ui/components/checkbox"\n\nexport default function CheckboxDisabled() {\n  return (\n    <div className="flex items-center space-x-2">\n      <Checkbox id="terms2" disabled />\n      <label\n        htmlFor="terms2"\n        className="text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"\n      >\n        Accept terms and conditions\n      </label>\n    </div>\n  )\n}\n',
      },
    },
  },
  render: () => (
    <div className="w-full min-w-72 max-w-2xl p-4">
      <ExampleCheckboxDisabled />
    </div>
  ),
};
