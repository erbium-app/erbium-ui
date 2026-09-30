import { SwitchSizes } from "../examples/upstream/switch-sizes";
import { SwitchDescription } from "../examples/upstream/switch-description";
import { SwitchChoiceCard } from "../examples/upstream/switch-choice-card";
import { SwitchInvalid } from "../examples/upstream/switch-invalid";
import type { Meta, StoryObj } from "@storybook/tanstack-react";
import { Switch } from "@erbium/ui/components/switch";
import Demo from "../examples/switch-demo";
import ExampleSwitchControlled from "../examples/switch-controlled";
import ExampleSwitchForm from "../examples/switch-form";
import ExampleSwitchIcons from "../examples/switch-icons";
import ExampleSwitchReadOnly from "../examples/switch-read-only";
import { Label } from "@erbium/ui/components/label";

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
} satisfies Meta<typeof Switch>;

export default meta;
type Story = StoryObj;

export const Playground: StoryObj<typeof Switch> = {
  args: {
    defaultChecked: false,
    disabled: false,
    readOnly: false,
    required: false,
    size: "default",
  },
  argTypes: {
    defaultChecked: { control: "boolean", description: "Initial state (uncontrolled)." },
    disabled: { control: "boolean", description: "Ignores user interaction." },
    readOnly: { control: "boolean", description: "Focusable, but the state cannot change." },
    required: { control: "boolean", description: "Must be on before the form submits." },
    size: { control: "inline-radio", options: ["sm", "default"] },
    onCheckedChange: { action: "onCheckedChange" },
  },
  render: (args) => (
    <div className="flex items-center gap-3">
      <Switch key={String(args.defaultChecked)} id="playground-switch" {...args} />
      <Label htmlFor="playground-switch">Airplane mode</Label>
    </div>
  ),
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
    // FieldGroup is a size container with no intrinsic width, so it needs a
    // full-width parent rather than the shrink-to-fit centered layout.
    layout: "padded",
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
    // FieldGroup is a size container with no intrinsic width, so it needs a
    // full-width parent rather than the shrink-to-fit centered layout.
    layout: "padded",
    docs: {
      description: { story: "Use the `size` prop to change the size of the switch." },
      source: {
        code: 'import { Field, FieldGroup, FieldLabel } from "@erbium/ui/components/field";\nimport { Switch } from "@erbium/ui/components/switch";\n\nexport function SwitchSizes() {\n  return (\n    <FieldGroup className="w-full max-w-[10rem]">\n      <Field orientation="horizontal">\n        <Switch id="switch-size-sm" size="sm" />\n        <FieldLabel htmlFor="switch-size-sm">Small</FieldLabel>\n      </Field>\n      <Field orientation="horizontal">\n        <Switch id="switch-size-default" size="default" />\n        <FieldLabel htmlFor="switch-size-default">Default</FieldLabel>\n      </Field>\n    </FieldGroup>\n  );\n}\n',
      },
    },
  },
  render: () => <SwitchSizes />,
};

export const Icons: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Pass `startIcon` (shown while on), `endIcon` (shown while off) or `thumbIcon` (always shown). Icons scale in on the exposed side of the track.",
      },
      source: {
        code: 'import { Label } from "@erbium/ui/components/label";\nimport { Switch } from "@erbium/ui/components/switch";\nimport { CheckIcon, MoonIcon, SunIcon, XIcon } from "lucide-react";\n\nexport default function SwitchIcons() {\n  return (\n    <div className="flex flex-col gap-4">\n      <div className="flex items-center gap-3">\n        <Switch id="icons-track" startIcon={<CheckIcon />} endIcon={<XIcon />} defaultChecked />\n        <Label htmlFor="icons-track">Track icons</Label>\n      </div>\n      <div className="flex items-center gap-3">\n        <Switch id="icons-thumb" thumbIcon={<SunIcon />} />\n        <Label htmlFor="icons-thumb">Thumb icon</Label>\n      </div>\n      <div className="flex items-center gap-3">\n        <Switch id="icons-theme" startIcon={<MoonIcon />} endIcon={<SunIcon />} />\n        <Label htmlFor="icons-theme">Dark mode</Label>\n      </div>\n    </div>\n  );\n}\n',
      },
    },
  },
  render: () => <ExampleSwitchIcons />,
};

export const Controlled: Story = {
  parameters: {
    docs: {
      description: { story: "Drive the state with `checked` and `onCheckedChange`." },
      source: {
        code: 'import { Label } from "@erbium/ui/components/label";\nimport { Switch } from "@erbium/ui/components/switch";\nimport { useState } from "react";\n\nexport default function SwitchControlled() {\n  const [checked, setChecked] = useState(true);\n\n  return (\n    <div className="flex flex-col gap-4">\n      <div className="flex items-center gap-3">\n        <Switch id="controlled-wifi" checked={checked} onCheckedChange={setChecked} />\n        <Label htmlFor="controlled-wifi">Wi-Fi</Label>\n      </div>\n      <p className="text-sm text-muted-foreground">\n        checked: <code>{String(checked)}</code>\n      </p>\n    </div>\n  );\n}\n',
      },
    },
  },
  render: () => <ExampleSwitchControlled />,
};

export const ReadOnly: Story = {
  parameters: {
    docs: {
      description: {
        story: "`readOnly` keeps the switch focusable but prevents the state from changing.",
      },
      source: {
        code: 'import { Label } from "@erbium/ui/components/label";\nimport { Switch } from "@erbium/ui/components/switch";\n\nexport default function SwitchReadOnly() {\n  return (\n    <div className="flex items-center gap-3">\n      <Switch id="read-only-sync" readOnly defaultChecked />\n      <Label htmlFor="read-only-sync">Managed by your organization</Label>\n    </div>\n  );\n}\n',
      },
    },
  },
  render: () => <ExampleSwitchReadOnly />,
};

export const Form: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Set `name` to submit the switch with a form. `value` and `uncheckedValue` choose what is sent for each state, and `required` blocks submission until the switch is on.",
      },
      source: {
        code: 'import { Button } from "@erbium/ui/components/button";\nimport { Label } from "@erbium/ui/components/label";\nimport { Switch } from "@erbium/ui/components/switch";\nimport { useState } from "react";\n\nexport default function SwitchForm() {\n  const [submitted, setSubmitted] = useState<string>();\n\n  return (\n    <form\n      className="flex w-72 flex-col gap-4"\n      onSubmit={(event) => {\n        event.preventDefault();\n        const data = Object.fromEntries(new FormData(event.currentTarget));\n        setSubmitted(JSON.stringify(data, null, 2));\n      }}\n    >\n      <div className="flex items-center gap-3">\n        <Switch id="form-newsletter" name="newsletter" value="yes" uncheckedValue="no" />\n        <Label htmlFor="form-newsletter">Subscribe to the newsletter</Label>\n      </div>\n      <div className="flex items-center gap-3">\n        <Switch id="form-terms" name="terms" required />\n        <Label htmlFor="form-terms">Accept the terms (required)</Label>\n      </div>\n      <Button className="self-start" type="submit">\n        Submit\n      </Button>\n      {submitted ? <pre className="rounded-md bg-muted p-3 text-xs">{submitted}</pre> : null}\n    </form>\n  );\n}\n',
      },
    },
  },
  render: () => <ExampleSwitchForm />,
};
