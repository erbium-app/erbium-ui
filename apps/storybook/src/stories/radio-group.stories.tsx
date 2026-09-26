import { RadioGroupDescription } from "../examples/upstream/radio-group-description";
import { RadioGroupChoiceCard } from "../examples/upstream/radio-group-choice-card";
import { RadioGroupFieldset } from "../examples/upstream/radio-group-fieldset";
import { RadioGroupDisabled } from "../examples/upstream/radio-group-disabled";
import { RadioGroupInvalid } from "../examples/upstream/radio-group-invalid";
import type { Meta, StoryObj } from "@storybook/tanstack-react";
import { RadioGroup, RadioGroupItem } from "@erbium/ui/components/radio-group";
import Demo from "../examples/radio-group-demo";

const meta = {
  title: "UI/Radio Group",
  component: RadioGroup,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          'A set of checkable buttons—known as radio buttons—where no more than one of the buttons can be checked at a time.\n\n**Import:** `@erbium/ui/components/radio-group`  \n\n**shadcn/ui page:** [Radio Group](https://ui.shadcn.com/docs/components/base/radio-group)\n\n### Usage\n\n```tsx\nimport { Label } from "@erbium/ui/components/label"\nimport { RadioGroup, RadioGroupItem } from "@erbium/ui/components/radio-group"\n```\n\n```tsx\n<RadioGroup defaultValue="option-one">\n  <div className="flex items-center gap-3">\n    <RadioGroupItem value="option-one" id="option-one" />\n    <Label htmlFor="option-one">Option One</Label>\n  </div>\n  <div className="flex items-center gap-3">\n    <RadioGroupItem value="option-two" id="option-two" />\n    <Label htmlFor="option-two">Option Two</Label>\n  </div>\n</RadioGroup>\n```\n\n### Composition\n\nUse the following composition to build a `RadioGroup`:\n\n```text\nRadioGroup\n├── RadioGroupItem\n└── RadioGroupItem\n```',
      },
    },
  },
} satisfies Meta<typeof RadioGroup>;

export default meta;
type Story = StoryObj;

export const Playground: StoryObj<typeof RadioGroup> = {
  args: { defaultValue: "one", disabled: false },
  argTypes: {
    defaultValue: { control: "select", options: ["one", "two", "three"] },
    disabled: { control: "boolean" },
  },
  render: (args) => (
    <RadioGroup key={args.defaultValue} {...args} className="grid gap-2">
      {["one", "two", "three"].map((value) => (
        <label key={value} className="flex items-center gap-2">
          <RadioGroupItem value={value} />
          {value}
        </label>
      ))}
    </RadioGroup>
  ),
};

export const Overview: Story = {
  parameters: {
    docs: {
      source: {
        code: 'import { Label } from "@erbium/ui/components/label";\nimport { RadioGroup, RadioGroupItem } from "@erbium/ui/components/radio-group";\n\nexport default function RadioGroupDemo() {\n  return (\n    <RadioGroup defaultValue="comfortable">\n      <div className="flex items-center gap-3">\n        <RadioGroupItem value="default" id="r1" />\n        <Label htmlFor="r1">Default</Label>\n      </div>\n      <div className="flex items-center gap-3">\n        <RadioGroupItem value="comfortable" id="r2" />\n        <Label htmlFor="r2">Comfortable</Label>\n      </div>\n      <div className="flex items-center gap-3">\n        <RadioGroupItem value="compact" id="r3" />\n        <Label htmlFor="r3">Compact</Label>\n      </div>\n    </RadioGroup>\n  );\n}\n',
      },
    },
  },
  render: () => (
    <div className="w-full min-w-72 max-w-2xl p-4">
      <Demo />
    </div>
  ),
};

export const Description: Story = {
  parameters: {
    docs: {
      description: { story: "Radio group items with a description using the `Field` component." },
      source: {
        code: 'import { Field, FieldContent, FieldDescription, FieldLabel } from "@erbium/ui/components/field";\nimport { RadioGroup, RadioGroupItem } from "@erbium/ui/components/radio-group";\n\nexport function RadioGroupDescription() {\n  return (\n    <RadioGroup defaultValue="comfortable" className="w-fit">\n      <Field orientation="horizontal">\n        <RadioGroupItem value="default" id="desc-r1" />\n        <FieldContent>\n          <FieldLabel htmlFor="desc-r1">Default</FieldLabel>\n          <FieldDescription>Standard spacing for most use cases.</FieldDescription>\n        </FieldContent>\n      </Field>\n      <Field orientation="horizontal">\n        <RadioGroupItem value="comfortable" id="desc-r2" />\n        <FieldContent>\n          <FieldLabel htmlFor="desc-r2">Comfortable</FieldLabel>\n          <FieldDescription>More space between elements.</FieldDescription>\n        </FieldContent>\n      </Field>\n      <Field orientation="horizontal">\n        <RadioGroupItem value="compact" id="desc-r3" />\n        <FieldContent>\n          <FieldLabel htmlFor="desc-r3">Compact</FieldLabel>\n          <FieldDescription>Minimal spacing for dense layouts.</FieldDescription>\n        </FieldContent>\n      </Field>\n    </RadioGroup>\n  );\n}\n',
      },
    },
  },
  render: () => <RadioGroupDescription />,
};
export const ChoiceCard: Story = {
  parameters: {
    docs: {
      description: {
        story: "Use `FieldLabel` to wrap the entire `Field` for a clickable card-style selection.",
      },
      source: {
        code: 'import {\n  Field,\n  FieldContent,\n  FieldDescription,\n  FieldLabel,\n  FieldTitle,\n} from "@erbium/ui/components/field";\nimport { RadioGroup, RadioGroupItem } from "@erbium/ui/components/radio-group";\n\nexport function RadioGroupChoiceCard() {\n  return (\n    <RadioGroup defaultValue="plus" className="max-w-sm">\n      <FieldLabel htmlFor="plus-plan">\n        <Field orientation="horizontal">\n          <FieldContent>\n            <FieldTitle>Plus</FieldTitle>\n            <FieldDescription>For individuals and small teams.</FieldDescription>\n          </FieldContent>\n          <RadioGroupItem value="plus" id="plus-plan" />\n        </Field>\n      </FieldLabel>\n      <FieldLabel htmlFor="pro-plan">\n        <Field orientation="horizontal">\n          <FieldContent>\n            <FieldTitle>Pro</FieldTitle>\n            <FieldDescription>For growing businesses.</FieldDescription>\n          </FieldContent>\n          <RadioGroupItem value="pro" id="pro-plan" />\n        </Field>\n      </FieldLabel>\n      <FieldLabel htmlFor="enterprise-plan">\n        <Field orientation="horizontal">\n          <FieldContent>\n            <FieldTitle>Enterprise</FieldTitle>\n            <FieldDescription>For large teams and enterprises.</FieldDescription>\n          </FieldContent>\n          <RadioGroupItem value="enterprise" id="enterprise-plan" />\n        </Field>\n      </FieldLabel>\n    </RadioGroup>\n  );\n}\n',
      },
    },
  },
  render: () => <RadioGroupChoiceCard />,
};
export const Fieldset: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Use `FieldSet` and `FieldLegend` to group radio items with a label and description.",
      },
      source: {
        code: 'import {\n  Field,\n  FieldDescription,\n  FieldLabel,\n  FieldLegend,\n  FieldSet,\n} from "@erbium/ui/components/field";\nimport { RadioGroup, RadioGroupItem } from "@erbium/ui/components/radio-group";\n\nexport function RadioGroupFieldset() {\n  return (\n    <FieldSet className="w-full max-w-xs">\n      <FieldLegend variant="label">Subscription Plan</FieldLegend>\n      <FieldDescription>Yearly and lifetime plans offer significant savings.</FieldDescription>\n      <RadioGroup defaultValue="monthly">\n        <Field orientation="horizontal">\n          <RadioGroupItem value="monthly" id="plan-monthly" />\n          <FieldLabel htmlFor="plan-monthly" className="font-normal">\n            Monthly ($9.99/month)\n          </FieldLabel>\n        </Field>\n        <Field orientation="horizontal">\n          <RadioGroupItem value="yearly" id="plan-yearly" />\n          <FieldLabel htmlFor="plan-yearly" className="font-normal">\n            Yearly ($99.99/year)\n          </FieldLabel>\n        </Field>\n        <Field orientation="horizontal">\n          <RadioGroupItem value="lifetime" id="plan-lifetime" />\n          <FieldLabel htmlFor="plan-lifetime" className="font-normal">\n            Lifetime ($299.99)\n          </FieldLabel>\n        </Field>\n      </RadioGroup>\n    </FieldSet>\n  );\n}\n',
      },
    },
  },
  render: () => <RadioGroupFieldset />,
};
export const Disabled: Story = {
  parameters: {
    docs: {
      description: { story: "Use the `disabled` prop on `RadioGroup` to disable all items." },
      source: {
        code: 'import { Field, FieldLabel } from "@erbium/ui/components/field";\nimport { RadioGroup, RadioGroupItem } from "@erbium/ui/components/radio-group";\n\nexport function RadioGroupDisabled() {\n  return (\n    <RadioGroup defaultValue="option2" className="w-fit">\n      <Field orientation="horizontal" data-disabled>\n        <RadioGroupItem value="option1" id="disabled-1" disabled />\n        <FieldLabel htmlFor="disabled-1" className="font-normal">\n          Disabled\n        </FieldLabel>\n      </Field>\n      <Field orientation="horizontal">\n        <RadioGroupItem value="option2" id="disabled-2" />\n        <FieldLabel htmlFor="disabled-2" className="font-normal">\n          Option 2\n        </FieldLabel>\n      </Field>\n      <Field orientation="horizontal">\n        <RadioGroupItem value="option3" id="disabled-3" />\n        <FieldLabel htmlFor="disabled-3" className="font-normal">\n          Option 3\n        </FieldLabel>\n      </Field>\n    </RadioGroup>\n  );\n}\n',
      },
    },
  },
  render: () => <RadioGroupDisabled />,
};
export const Invalid: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Use `aria-invalid` on `RadioGroupItem` and `data-invalid` on `Field` to show validation errors.",
      },
      source: {
        code: 'import {\n  Field,\n  FieldDescription,\n  FieldLabel,\n  FieldLegend,\n  FieldSet,\n} from "@erbium/ui/components/field";\nimport { RadioGroup, RadioGroupItem } from "@erbium/ui/components/radio-group";\n\nexport function RadioGroupInvalid() {\n  return (\n    <FieldSet className="w-full max-w-xs">\n      <FieldLegend variant="label">Notification Preferences</FieldLegend>\n      <FieldDescription>Choose how you want to receive notifications.</FieldDescription>\n      <RadioGroup defaultValue="email">\n        <Field orientation="horizontal" data-invalid>\n          <RadioGroupItem value="email" id="invalid-email" aria-invalid />\n          <FieldLabel htmlFor="invalid-email" className="font-normal">\n            Email only\n          </FieldLabel>\n        </Field>\n        <Field orientation="horizontal" data-invalid>\n          <RadioGroupItem value="sms" id="invalid-sms" aria-invalid />\n          <FieldLabel htmlFor="invalid-sms" className="font-normal">\n            SMS only\n          </FieldLabel>\n        </Field>\n        <Field orientation="horizontal" data-invalid>\n          <RadioGroupItem value="both" id="invalid-both" aria-invalid />\n          <FieldLabel htmlFor="invalid-both" className="font-normal">\n            Both Email & SMS\n          </FieldLabel>\n        </Field>\n      </RadioGroup>\n    </FieldSet>\n  );\n}\n',
      },
    },
  },
  render: () => <RadioGroupInvalid />,
};
