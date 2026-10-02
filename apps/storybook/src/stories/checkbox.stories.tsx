import checkboxFormSource from "../examples/checkbox-form.tsx?raw";
import checkboxIndeterminateSource from "../examples/checkbox-indeterminate.tsx?raw";
import checkboxGroupSource from "../examples/upstream/checkbox-group.tsx?raw";
import { CheckboxInvalid } from "../examples/upstream/checkbox-invalid";
import { CheckboxBasic } from "../examples/upstream/checkbox-basic";
import { CheckboxDescription } from "../examples/upstream/checkbox-description";
import { CheckboxGroupFieldset } from "../examples/upstream/checkbox-group";
import { CheckboxInTable } from "../examples/upstream/checkbox-table";
import checkboxTableSource from "../examples/upstream/checkbox-table.tsx?raw";
import ExampleCheckboxControlled from "../examples/checkbox-controlled";
import ExampleCheckboxDisabled from "../examples/checkbox-disabled";
import ExampleCheckboxForm from "../examples/checkbox-form";
import ExampleCheckboxIndeterminate from "../examples/checkbox-indeterminate";
import ExampleCheckboxReadOnly from "../examples/checkbox-read-only";
import type { Meta, StoryObj } from "@storybook/tanstack-react";
import { Checkbox } from "@erbium/ui/components/checkbox";
import { Label } from "@erbium/ui/components/label";
import Demo from "../examples/checkbox-demo";

const meta = {
  title: "UI/Checkbox",
  component: Checkbox,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          'A control that allows the user to toggle between checked and not checked.\n\n**Import:** `@erbium/ui/components/checkbox`  \n\n**shadcn/ui page:** [Checkbox](https://ui.shadcn.com/docs/components/base/checkbox)\n\n### Usage\n\n```tsx\nimport { Checkbox } from "@erbium/ui/components/checkbox"\n```\n\n```tsx\n<Checkbox />\n```',
      },
    },
  },
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj;

export const Playground: StoryObj<typeof Checkbox> = {
  args: {
    defaultChecked: false,
    indeterminate: false,
    disabled: false,
    readOnly: false,
    required: false,
  },
  argTypes: {
    defaultChecked: { control: "boolean", description: "Initial checked state (uncontrolled)." },
    indeterminate: { control: "boolean", description: "Mixed state; shows a minus icon." },
    disabled: { control: "boolean", description: "Ignores interaction and dims the control." },
    readOnly: { control: "boolean", description: "Focusable, but the state cannot change." },
    required: { control: "boolean", description: "Must be checked before the form submits." },
    onCheckedChange: { action: "onCheckedChange" },
  },
  render: (args) => (
    <div className="flex items-center gap-2">
      <Checkbox key={String(args.defaultChecked)} {...args} id="playground-checkbox" />
      <Label htmlFor="playground-checkbox">Accept terms</Label>
    </div>
  ),
};

export const Overview: Story = {
  parameters: {
    docs: {
      source: {
        code: 'import { Checkbox } from "@erbium/ui/components/checkbox";\nimport { Label } from "@erbium/ui/components/label";\n\nexport default function CheckboxDemo() {\n  return (\n    <div className="flex flex-col gap-6">\n      <div className="flex items-center gap-3">\n        <Checkbox id="terms" />\n        <Label htmlFor="terms">Accept terms and conditions</Label>\n      </div>\n      <div className="flex items-start gap-3">\n        <Checkbox id="terms-2" defaultChecked />\n        <div className="grid gap-2">\n          <Label htmlFor="terms-2">Accept terms and conditions</Label>\n          <p className="text-sm text-muted-foreground">\n            By clicking this checkbox, you agree to the terms and conditions.\n          </p>\n        </div>\n      </div>\n      <div className="flex items-start gap-3">\n        <Checkbox id="toggle" disabled />\n        <Label htmlFor="toggle">Enable notifications</Label>\n      </div>\n      <Label className="flex items-start gap-3 rounded-lg border p-3 hover:bg-accent/50 has-[[aria-checked=true]]:border-primary has-[[aria-checked=true]]:bg-accent">\n        <Checkbox\n          id="toggle-2"\n          defaultChecked\n          className="data-checked:border-primary data-checked:bg-primary data-checked:text-primary-foreground"\n        />\n        <div className="grid gap-1.5 font-normal">\n          <p className="text-sm leading-none font-medium">Enable notifications</p>\n          <p className="text-sm text-muted-foreground">\n            You can enable or disable notifications at any time.\n          </p>\n        </div>\n      </Label>\n    </div>\n  );\n}\n',
      },
    },
  },
  render: () => (
    <div className="w-full min-w-72 max-w-2xl p-4">
      <Demo />
    </div>
  ),
};

export const Checked: Story = {
  name: "Checked State",
  parameters: {
    docs: {
      description: {
        story: "Use `defaultChecked` for an uncontrolled checkbox that starts ticked.",
      },
    },
  },
  render: () => <Checkbox defaultChecked aria-label="Selected" />,
};

export const Controlled: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Pass `checked` and `onCheckedChange` to own the state. The handler receives `(checked, eventDetails)`; call `eventDetails.cancel()` to reject a change in uncontrolled mode.",
      },
      source: {
        code: 'import { Checkbox } from "@erbium/ui/components/checkbox";\nimport { Label } from "@erbium/ui/components/label";\nimport { useState } from "react";\n\nexport default function CheckboxControlled() {\n  const [checked, setChecked] = useState(false);\n\n  return (\n    <div className="flex flex-col gap-4">\n      <div className="flex items-center gap-2">\n        <Checkbox id="controlled-marketing" checked={checked} onCheckedChange={setChecked} />\n        <Label htmlFor="controlled-marketing">Receive marketing emails</Label>\n      </div>\n      <p className="text-sm text-muted-foreground">\n        checked: <code>{String(checked)}</code>\n      </p>\n    </div>\n  );\n}\n',
      },
    },
  },
  render: () => <ExampleCheckboxControlled />,
};

export const Indeterminate: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Inside a `CheckboxGroup`, pass `allValues` and mark one checkbox `parent`: it turns indeterminate while only some children are checked and toggles them all. Drag across the children to select or clear several at once.",
      },
      source: {
        code: checkboxIndeterminateSource,
      },
    },
  },
  render: () => <ExampleCheckboxIndeterminate />,
};

export const ReadOnly: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Use `readOnly` to show a value the user cannot change. It stays focusable and announced, unlike `disabled`, and exposes `data-readonly`.",
      },
      source: {
        code: 'import { Checkbox } from "@erbium/ui/components/checkbox";\nimport { Label } from "@erbium/ui/components/label";\n\nexport default function CheckboxReadOnly() {\n  return (\n    <div className="flex items-center gap-2">\n      <Checkbox id="read-only-plan" readOnly defaultChecked />\n      <Label htmlFor="read-only-plan">Included in your plan</Label>\n    </div>\n  );\n}\n',
      },
    },
  },
  render: () => <ExampleCheckboxReadOnly />,
};

export const Form: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'A hidden input submits with the form. `name` sets the key, `value` the checked value (defaults to `"on"`), and `uncheckedValue` what an unticked box submits. `required` blocks submission until checked. An invalid submit shakes the visible terms row; selecting it clears the invalid state. Drag across both choices to change them together. Use `form` to associate a checkbox rendered outside its form.',
      },
      source: {
        code: checkboxFormSource,
      },
    },
  },
  render: () => <ExampleCheckboxForm />,
};

export const Disabled: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Use the `disabled` prop to prevent interaction. The checkbox and a sibling `Label` dim through `data-disabled`; inside a `<Field>`, add `disabled` to the field for disabled styles.",
      },

      source: {
        code: 'import { Checkbox } from "@erbium/ui/components/checkbox";\nimport { Label } from "@erbium/ui/components/label";\n\nexport default function CheckboxDisabled() {\n  return (\n    <div className="flex flex-col gap-4">\n      <div className="flex items-center gap-2">\n        <Checkbox id="disabled-unchecked" disabled />\n        <Label htmlFor="disabled-unchecked">Accept terms and conditions</Label>\n      </div>\n      <div className="flex items-center gap-2">\n        <Checkbox id="disabled-checked" disabled defaultChecked />\n        <Label htmlFor="disabled-checked">Enable notifications</Label>\n      </div>\n      <div className="flex items-center gap-2">\n        <Checkbox id="disabled-indeterminate" disabled indeterminate />\n        <Label htmlFor="disabled-indeterminate">Sync some folders</Label>\n      </div>\n    </div>\n  );\n}\n',
      },
    },
  },
  render: () => (
    <div className="w-full min-w-72 max-w-2xl p-4">
      <ExampleCheckboxDisabled />
    </div>
  ),
};

export const Table: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Click a checkbox to toggle one row, or drag across rows to select or clear a range. The header checkbox reflects partial selection and selects all rows.",
      },

      source: {
        code: checkboxTableSource,
      },
    },
  },
  render: () => <CheckboxInTable />,
};

export const Basic: Story = {
  parameters: {
    docs: {
      description: {
        story: "Pair the checkbox with `Field` and `FieldLabel` for proper layout and labeling.",
      },
      source: {
        code: 'import { Checkbox } from "@erbium/ui/components/checkbox";\nimport { Field, FieldGroup, FieldLabel } from "@erbium/ui/components/field";\n\nexport function CheckboxBasic() {\n  return (\n    <FieldGroup className="mx-auto w-56">\n      <Field orientation="horizontal">\n        <Checkbox id="terms-checkbox-basic" name="terms-checkbox-basic" />\n        <FieldLabel htmlFor="terms-checkbox-basic">Accept terms and conditions</FieldLabel>\n      </Field>\n    </FieldGroup>\n  );\n}\n',
      },
    },
  },
  render: () => <CheckboxBasic />,
};
export const Description: Story = {
  parameters: {
    docs: {
      description: { story: "Use `FieldContent` and `FieldDescription` for helper text." },
      source: {
        code: 'import { Checkbox } from "@erbium/ui/components/checkbox";\nimport {\n  Field,\n  FieldContent,\n  FieldDescription,\n  FieldGroup,\n  FieldLabel,\n} from "@erbium/ui/components/field";\n\nexport function CheckboxDescription() {\n  return (\n    <FieldGroup className="mx-auto w-72">\n      <Field orientation="horizontal">\n        <Checkbox id="terms-checkbox-desc" name="terms-checkbox-desc" defaultChecked />\n        <FieldContent>\n          <FieldLabel htmlFor="terms-checkbox-desc">Accept terms and conditions</FieldLabel>\n          <FieldDescription>\n            By clicking this checkbox, you agree to the terms and conditions.\n          </FieldDescription>\n        </FieldContent>\n      </Field>\n    </FieldGroup>\n  );\n}\n',
      },
    },
  },
  render: () => <CheckboxDescription />,
};
export const Group: Story = {
  parameters: {
    docs: {
      description: {
        story:
          '`CheckboxGroup` wraps Base UI\'s checkbox group: it renders `role="group"` and holds the checked `value`s as one array. Press a checkbox or its label and drag across the others to select or clear them in one gesture.',
      },
      source: {
        code: checkboxGroupSource,
      },
    },
  },
  render: () => <CheckboxGroupFieldset />,
};

export const InvalidState: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Set `invalid` on the `Field` wrapper; the checkbox picks up `aria-invalid` automatically.",
      },
      source: {
        code: 'import { Checkbox } from "@erbium/ui/components/checkbox";\nimport { Field, FieldGroup, FieldLabel } from "@erbium/ui/components/field";\n\nexport function CheckboxInvalid() {\n  return (\n    <FieldGroup className="mx-auto w-56">\n      <Field orientation="horizontal" invalid>\n        <Checkbox id="terms-checkbox-invalid" name="terms-checkbox-invalid" />\n        <FieldLabel htmlFor="terms-checkbox-invalid">Accept terms and conditions</FieldLabel>\n      </Field>\n    </FieldGroup>\n  );\n}\n',
      },
    },
  },
  render: () => <CheckboxInvalid />,
};
