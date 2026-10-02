import { RadioGroupDescription } from "../examples/upstream/radio-group-description";
import { RadioGroupChoiceCard } from "../examples/upstream/radio-group-choice-card";
import { RadioGroupFieldset } from "../examples/upstream/radio-group-fieldset";
import { RadioGroupDisabled } from "../examples/upstream/radio-group-disabled";
import { RadioGroupInvalid } from "../examples/upstream/radio-group-invalid";
import { Field, FieldLabel } from "@erbium/ui/components/field";
import type { Meta, StoryObj } from "@storybook/tanstack-react";
import { RadioGroup, RadioGroupItem } from "@erbium/ui/components/radio-group";
import Demo from "../examples/radio-group-demo";
import ExampleRadioGroupControlled from "../examples/radio-group-controlled";
import ExampleRadioGroupForm from "../examples/radio-group-form";
import ExampleRadioGroupReadOnly from "../examples/radio-group-read-only";

const meta = {
  title: "UI/Radio Group",
  component: RadioGroup,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          'A set of checkable buttons—known as radio buttons—where no more than one of the buttons can be checked at a time.\n\n**Import:** `@erbium/ui/components/radio-group`  \n\n**shadcn/ui page:** [Radio Group](https://ui.shadcn.com/docs/components/base/radio-group)\n\n### Usage\n\n```tsx\nimport { Field, FieldLabel } from "@erbium/ui/components/field"\nimport { RadioGroup, RadioGroupItem } from "@erbium/ui/components/radio-group"\n```\n\n```tsx\n<RadioGroup defaultValue="option-one">\n  <Field orientation="horizontal">\n    <RadioGroupItem value="option-one" id="option-one" />\n    <FieldLabel htmlFor="option-one">Option One</FieldLabel>\n  </Field>\n  <Field orientation="horizontal">\n    <RadioGroupItem value="option-two" id="option-two" />\n    <FieldLabel htmlFor="option-two">Option Two</FieldLabel>\n  </Field>\n</RadioGroup>\n```\n\n### Composition\n\nUse the following composition to build a `RadioGroup`:\n\n```text\nRadioGroup\n├── RadioGroupItem\n└── RadioGroupItem\n```',
      },
    },
  },
} satisfies Meta<typeof RadioGroup>;

export default meta;
type Story = StoryObj;

export const Playground: StoryObj<typeof RadioGroup> = {
  args: { defaultValue: "one", disabled: false, readOnly: false, required: false },
  argTypes: {
    defaultValue: {
      control: "select",
      options: ["one", "two", "three"],
      description: "Initially selected value (uncontrolled).",
    },
    disabled: { control: "boolean", description: "Disables every item in the group." },
    readOnly: { control: "boolean", description: "Focusable, but the selection cannot change." },
    required: { control: "boolean", description: "A value must be chosen before submitting." },
    onValueChange: { action: "onValueChange" },
  },
  render: (args) => (
    <RadioGroup key={String(args.defaultValue)} {...args}>
      {["one", "two", "three"].map((value) => (
        <Field orientation="horizontal" key={value}>
          <RadioGroupItem value={value} id={`playground-${value}`} />
          <FieldLabel htmlFor={`playground-${value}`}>Option {value}</FieldLabel>
        </Field>
      ))}
    </RadioGroup>
  ),
};

export const Overview: Story = {
  parameters: {
    docs: {
      source: {
        code: 'import { Field, FieldItem, FieldLabel } from "@erbium/ui/components/field";\nimport { RadioGroup, RadioGroupItem } from "@erbium/ui/components/radio-group";\n\nexport default function RadioGroupDemo() {\n  return (\n    <Field>\n      <RadioGroup defaultValue="comfortable">\n        <FieldItem orientation="horizontal">\n          <RadioGroupItem value="default" />\n          <FieldLabel>Default</FieldLabel>\n        </FieldItem>\n        <FieldItem orientation="horizontal">\n          <RadioGroupItem value="comfortable" />\n          <FieldLabel>Comfortable</FieldLabel>\n        </FieldItem>\n        <FieldItem orientation="horizontal">\n          <RadioGroupItem value="compact" />\n          <FieldLabel>Compact</FieldLabel>\n        </FieldItem>\n      </RadioGroup>\n    </Field>\n  );\n}\n',
      },
    },
  },
  render: () => (
    <div className="w-full min-w-72 max-w-2xl p-4">
      <Demo />
    </div>
  ),
};

export const Controlled: Story = {
  parameters: {
    docs: {
      description: {
        story: "Pair `value` with `onValueChange` to own the selection in React state.",
      },
      source: {
        code: 'import { Field, FieldItem, FieldLabel } from "@erbium/ui/components/field";\nimport { RadioGroup, RadioGroupItem } from "@erbium/ui/components/radio-group";\nimport { useState } from "react";\n\nconst options = [\n  { value: "light", label: "Light" },\n  { value: "dark", label: "Dark" },\n  { value: "system", label: "System" },\n];\n\nexport default function RadioGroupControlled() {\n  const [value, setValue] = useState("system");\n\n  return (\n    <div className="flex flex-col gap-4">\n      <Field>\n        <RadioGroup value={value} onValueChange={setValue}>\n          {options.map((option) => (\n            <FieldItem orientation="horizontal" key={option.value}>\n              <RadioGroupItem value={option.value} />\n              <FieldLabel>{option.label}</FieldLabel>\n            </FieldItem>\n          ))}\n        </RadioGroup>\n      </Field>\n      <p className="text-sm text-muted-foreground">\n        value: <code>{value}</code>\n      </p>\n    </div>\n  );\n}\n',
      },
    },
  },
  render: () => <ExampleRadioGroupControlled />,
};

export const ReadOnly: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "`readOnly` keeps the group focusable and announced (`aria-readonly`) while blocking changes.",
      },
      source: {
        code: 'import { Field, FieldItem, FieldLabel } from "@erbium/ui/components/field";\nimport { RadioGroup, RadioGroupItem } from "@erbium/ui/components/radio-group";\n\nexport default function RadioGroupReadOnly() {\n  return (\n    <Field>\n      <RadioGroup readOnly defaultValue="pro">\n        <FieldItem orientation="horizontal">\n          <RadioGroupItem value="free" />\n          <FieldLabel>Free</FieldLabel>\n        </FieldItem>\n        <FieldItem orientation="horizontal">\n          <RadioGroupItem value="pro" />\n          <FieldLabel>Pro (current plan)</FieldLabel>\n        </FieldItem>\n      </RadioGroup>\n    </Field>\n  );\n}\n',
      },
    },
  },
  render: () => <ExampleRadioGroupReadOnly />,
};

export const Form: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "`name` submits the selected `value` with the form; `required` blocks submission until an item is chosen.",
      },
      source: {
        code: 'import { Field, FieldItem, FieldLabel } from "@erbium/ui/components/field";\nimport { RadioGroup, RadioGroupItem } from "@erbium/ui/components/radio-group";\nimport { StatefulButton } from "@erbium/ui/components/stateful-button";\nimport { useState } from "react";\n\nexport default function RadioGroupForm() {\n  const [submitted, setSubmitted] = useState<string>();\n\n  return (\n    <form\n      className="flex w-72 flex-col gap-4"\n      onSubmit={(event) => {\n        event.preventDefault();\n        const data = Object.fromEntries(new FormData(event.currentTarget));\n        setSubmitted(JSON.stringify(data, null, 2));\n      }}\n    >\n      <Field>\n        <RadioGroup name="shipping" required>\n          <FieldItem orientation="horizontal">\n            <RadioGroupItem value="standard" />\n            <FieldLabel>Standard (5–7 days)</FieldLabel>\n          </FieldItem>\n          <FieldItem orientation="horizontal">\n            <RadioGroupItem value="express" />\n            <FieldLabel>Express (1–2 days)</FieldLabel>\n          </FieldItem>\n        </RadioGroup>\n      </Field>\n      <StatefulButton className="self-start" type="submit">\n        Submit\n      </StatefulButton>\n      {submitted ? <pre className="rounded-md bg-muted p-3 text-xs">{submitted}</pre> : null}\n    </form>\n  );\n}\n',
      },
    },
  },
  render: () => <ExampleRadioGroupForm />,
};

export const Description: Story = {
  parameters: {
    docs: {
      description: { story: "Radio group items with a description using the `Field` component." },
      source: {
        code: 'import {\n  Field,\n  FieldContent,\n  FieldDescription,\n  FieldItem,\n  FieldLabel,\n} from "@erbium/ui/components/field";\nimport { RadioGroup, RadioGroupItem } from "@erbium/ui/components/radio-group";\n\nexport function RadioGroupDescription() {\n  return (\n    <Field>\n      <RadioGroup defaultValue="comfortable" className="w-fit">\n        <FieldItem orientation="horizontal">\n          <RadioGroupItem value="default" />\n          <FieldContent>\n            <FieldLabel>Default</FieldLabel>\n            <FieldDescription>Standard spacing for most use cases.</FieldDescription>\n          </FieldContent>\n        </FieldItem>\n        <FieldItem orientation="horizontal">\n          <RadioGroupItem value="comfortable" />\n          <FieldContent>\n            <FieldLabel>Comfortable</FieldLabel>\n            <FieldDescription>More space between elements.</FieldDescription>\n          </FieldContent>\n        </FieldItem>\n        <FieldItem orientation="horizontal">\n          <RadioGroupItem value="compact" />\n          <FieldContent>\n            <FieldLabel>Compact</FieldLabel>\n            <FieldDescription>Minimal spacing for dense layouts.</FieldDescription>\n          </FieldContent>\n        </FieldItem>\n      </RadioGroup>\n    </Field>\n  );\n}\n',
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
        code: 'import {\n  Field,\n  FieldContent,\n  FieldDescription,\n  FieldItem,\n  FieldLabel,\n} from "@erbium/ui/components/field";\nimport { RadioGroup, RadioGroupItem } from "@erbium/ui/components/radio-group";\n\nexport function RadioGroupChoiceCard() {\n  return (\n    <Field className="max-w-sm">\n      <RadioGroup defaultValue="plus">\n        <FieldItem variant="card" orientation="horizontal">\n          <FieldContent>\n            <FieldLabel>Plus</FieldLabel>\n            <FieldDescription>For individuals and small teams.</FieldDescription>\n          </FieldContent>\n          <RadioGroupItem value="plus" />\n        </FieldItem>\n        <FieldItem variant="card" orientation="horizontal">\n          <FieldContent>\n            <FieldLabel>Pro</FieldLabel>\n            <FieldDescription>For growing businesses.</FieldDescription>\n          </FieldContent>\n          <RadioGroupItem value="pro" />\n        </FieldItem>\n        <FieldItem variant="card" orientation="horizontal">\n          <FieldContent>\n            <FieldLabel>Enterprise</FieldLabel>\n            <FieldDescription>For large teams and enterprises.</FieldDescription>\n          </FieldContent>\n          <RadioGroupItem value="enterprise" />\n        </FieldItem>\n      </RadioGroup>\n    </Field>\n  );\n}\n',
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
        code: 'import {\n  FieldDescription,\n  FieldItem,\n  FieldLabel,\n  FieldLegend,\n  FieldSet,\n} from "@erbium/ui/components/field";\nimport { RadioGroup, RadioGroupItem } from "@erbium/ui/components/radio-group";\n\nexport function RadioGroupFieldset() {\n  return (\n    <FieldSet className="w-full max-w-xs">\n      <FieldLegend variant="label">Subscription Plan</FieldLegend>\n      <FieldDescription>Yearly and lifetime plans offer significant savings.</FieldDescription>\n      <RadioGroup defaultValue="monthly">\n        <FieldItem orientation="horizontal">\n          <RadioGroupItem value="monthly" />\n          <FieldLabel className="font-normal">Monthly ($9.99/month)</FieldLabel>\n        </FieldItem>\n        <FieldItem orientation="horizontal">\n          <RadioGroupItem value="yearly" />\n          <FieldLabel className="font-normal">Yearly ($99.99/year)</FieldLabel>\n        </FieldItem>\n        <FieldItem orientation="horizontal">\n          <RadioGroupItem value="lifetime" />\n          <FieldLabel className="font-normal">Lifetime ($299.99)</FieldLabel>\n        </FieldItem>\n      </RadioGroup>\n    </FieldSet>\n  );\n}\n',
      },
    },
  },
  render: () => <RadioGroupFieldset />,
};
export const Disabled: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Set `disabled` on a `RadioGroupItem` to disable one option, or on `RadioGroup` to disable them all.",
      },
      source: {
        code: 'import { Field, FieldItem, FieldLabel } from "@erbium/ui/components/field";\nimport { RadioGroup, RadioGroupItem } from "@erbium/ui/components/radio-group";\n\nexport function RadioGroupDisabled() {\n  return (\n    <Field>\n      <RadioGroup defaultValue="option2" className="w-fit">\n        <FieldItem orientation="horizontal" disabled>\n          <RadioGroupItem value="option1" />\n          <FieldLabel className="font-normal">Disabled</FieldLabel>\n        </FieldItem>\n        <FieldItem orientation="horizontal">\n          <RadioGroupItem value="option2" />\n          <FieldLabel className="font-normal">Option 2</FieldLabel>\n        </FieldItem>\n        <FieldItem orientation="horizontal">\n          <RadioGroupItem value="option3" />\n          <FieldLabel className="font-normal">Option 3</FieldLabel>\n        </FieldItem>\n      </RadioGroup>\n    </Field>\n  );\n}\n',
      },
    },
  },
  render: () => <RadioGroupDisabled />,
};
export const Invalid: Story = {
  parameters: {
    docs: {
      description: {
        story: "Use `invalid` on `Field`; `RadioGroupItem` picks up `aria-invalid` automatically.",
      },
      source: {
        code: 'import {\n  FieldDescription,\n  FieldItem,\n  FieldLabel,\n  FieldLegend,\n  FieldSet,\n} from "@erbium/ui/components/field";\nimport { RadioGroup, RadioGroupItem } from "@erbium/ui/components/radio-group";\n\nexport function RadioGroupInvalid() {\n  return (\n    <FieldSet invalid className="w-full max-w-xs">\n      <FieldLegend variant="label">Notification Preferences</FieldLegend>\n      <FieldDescription>Choose how you want to receive notifications.</FieldDescription>\n      <RadioGroup defaultValue="email">\n        <FieldItem orientation="horizontal">\n          <RadioGroupItem value="email" />\n          <FieldLabel className="font-normal">Email only</FieldLabel>\n        </FieldItem>\n        <FieldItem orientation="horizontal">\n          <RadioGroupItem value="sms" />\n          <FieldLabel className="font-normal">SMS only</FieldLabel>\n        </FieldItem>\n        <FieldItem orientation="horizontal">\n          <RadioGroupItem value="both" />\n          <FieldLabel className="font-normal">Both Email & SMS</FieldLabel>\n        </FieldItem>\n      </RadioGroup>\n    </FieldSet>\n  );\n}\n',
      },
    },
  },
  render: () => <RadioGroupInvalid />,
};
