import { SwitchSizes } from "../examples/upstream/switch-sizes";
import { SwitchDescription } from "../examples/upstream/switch-description";
import { SwitchChoiceCard } from "../examples/upstream/switch-choice-card";
import { SwitchInvalid } from "../examples/upstream/switch-invalid";
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
          'A control that allows the user to toggle between checked and not checked.\n\n**Import:** `@erbium/ui/components/switch`  \n\n**shadcn/ui page:** [Switch](https://ui.shadcn.com/docs/components/base/switch)\n\n### Usage\n\n```tsx\nimport { Switch } from "@erbium/ui/components/switch"\n```\n\n```tsx\n<Switch />\n```',
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Playground: StoryObj<typeof Switch> = {
  args: { defaultChecked: false, disabled: false, className: "" },
  argTypes: { defaultChecked: { control: "boolean" }, disabled: { control: "boolean" } },
  render: (args) => <Switch key={String(args.defaultChecked)} {...args} />,
};

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

export const On: Story = {
  parameters: {
    docs: {
      description: { story: "Start a switch in the checked state." },
    },
  },
  render: () => <Switch defaultChecked aria-label="Notifications" />,
};
export const Disabled: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Add the `disabled` prop to the `Switch` component to disable the switch. Add the `data-disabled` prop to the `Field` component for styling.",
      },
    },
  },
  render: () => <Switch disabled aria-label="Unavailable" />,
};

export const Description: Story = {
  parameters: {
    docs: {
      description: { story: "Pair a switch with a label and explanatory text." },

      source: {
        code: 'import { Field, FieldContent, FieldDescription, FieldLabel } from "@erbium/ui/components/field";\nimport { Switch } from "@erbium/ui/components/switch";\n\nexport function SwitchDescription() {\n  return (\n    <Field orientation="horizontal" className="max-w-sm">\n      <FieldContent>\n        <FieldLabel htmlFor="switch-focus-mode">Share across devices</FieldLabel>\n        <FieldDescription>\n          Focus is shared across devices, and turns off when you leave the app.\n        </FieldDescription>\n      </FieldContent>\n      <Switch id="switch-focus-mode" />\n    </Field>\n  );\n}\n',
      },
    },
  },
  render: () => <SwitchDescription />,
};
export const ChoiceCard: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Card-style selection where `FieldLabel` wraps the entire `Field` for a clickable card pattern.",
      },
      source: {
        code: 'import {\n  Field,\n  FieldContent,\n  FieldDescription,\n  FieldGroup,\n  FieldLabel,\n  FieldTitle,\n} from "@erbium/ui/components/field";\nimport { Switch } from "@erbium/ui/components/switch";\n\nexport function SwitchChoiceCard() {\n  return (\n    <FieldGroup className="w-full max-w-sm">\n      <FieldLabel htmlFor="switch-share">\n        <Field orientation="horizontal">\n          <FieldContent>\n            <FieldTitle>Share across devices</FieldTitle>\n            <FieldDescription>\n              Focus is shared across devices, and turns off when you leave the app.\n            </FieldDescription>\n          </FieldContent>\n          <Switch id="switch-share" />\n        </Field>\n      </FieldLabel>\n      <FieldLabel htmlFor="switch-notifications">\n        <Field orientation="horizontal">\n          <FieldContent>\n            <FieldTitle>Enable notifications</FieldTitle>\n            <FieldDescription>\n              Receive notifications when focus mode is enabled or disabled.\n            </FieldDescription>\n          </FieldContent>\n          <Switch id="switch-notifications" defaultChecked />\n        </Field>\n      </FieldLabel>\n    </FieldGroup>\n  );\n}\n',
      },
    },
  },
  render: () => <SwitchChoiceCard />,
};
export const Invalid: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Add the `aria-invalid` prop to the `Switch` component to indicate an invalid state. Add the `data-invalid` prop to the `Field` component for styling.",
      },
      source: {
        code: 'import { Field, FieldContent, FieldDescription, FieldLabel } from "@erbium/ui/components/field";\nimport { Switch } from "@erbium/ui/components/switch";\n\nexport function SwitchInvalid() {\n  return (\n    <Field orientation="horizontal" className="max-w-sm" data-invalid>\n      <FieldContent>\n        <FieldLabel htmlFor="switch-terms">Accept terms and conditions</FieldLabel>\n        <FieldDescription>You must accept the terms and conditions to continue.</FieldDescription>\n      </FieldContent>\n      <Switch id="switch-terms" aria-invalid />\n    </Field>\n  );\n}\n',
      },
    },
  },
  render: () => <SwitchInvalid />,
};

export const Size: Story = {
  parameters: {
    docs: {
      description: { story: "Use the `size` prop to change the size of the switch." },
      source: {
        code: 'import { Field, FieldGroup, FieldLabel } from "@erbium/ui/components/field";\nimport { Switch } from "@erbium/ui/components/switch";\n\nexport function SwitchSizes() {\n  return (\n    <FieldGroup className="w-full max-w-[10rem]">\n      <Field orientation="horizontal">\n        <Switch id="switch-size-sm" size="sm" />\n        <FieldLabel htmlFor="switch-size-sm">Small</FieldLabel>\n      </Field>\n      <Field orientation="horizontal">\n        <Switch id="switch-size-default" size="default" />\n        <FieldLabel htmlFor="switch-size-default">Default</FieldLabel>\n      </Field>\n    </FieldGroup>\n  );\n}\n',
      },
    },
  },
  render: () => <SwitchSizes />,
};
