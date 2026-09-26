import type { Meta, StoryObj } from "@storybook/react-vite";
import { RadioGroup } from "@erbium/ui/components/radio-group";
import Demo from "./examples/radio-group-demo";

const meta = {
  title: "UI/Radio Group",
  component: RadioGroup,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          'A set of checkable buttons—known as radio buttons—where no more than one of the buttons can be checked at a time.\n\n**Import:** `@erbium/ui/components/radio-group`  \n\n**shadcn/ui page:** [Radio Group](https://ui.shadcn.com/docs/components/base/radio-group)\n\n### Usage\n\n```tsx\nimport { Label } from "@erbium/ui/components/label"\nimport { RadioGroup, RadioGroupItem } from "@erbium/ui/components/radio-group"\n```\n\n```tsx\n<RadioGroup defaultValue="option-one">\n  <div className="flex items-center gap-3">\n    <RadioGroupItem value="option-one" id="option-one" />\n    <Label htmlFor="option-one">Option One</Label>\n  </div>\n  <div className="flex items-center gap-3">\n    <RadioGroupItem value="option-two" id="option-two" />\n    <Label htmlFor="option-two">Option Two</Label>\n  </div>\n</RadioGroup>\n```\n\n### Composition\n\nUse the following composition to build a `RadioGroup`:\n\n```text\nRadioGroup\n├── RadioGroupItem\n└── RadioGroupItem\n```\n\n### Description\n\nRadio group items with a description using the `Field` component.\n\n### Choice Card\n\nUse `FieldLabel` to wrap the entire `Field` for a clickable card-style selection.\n\n### Fieldset\n\nUse `FieldSet` and `FieldLegend` to group radio items with a label and description.\n\n### Disabled\n\nUse the `disabled` prop on `RadioGroup` to disable all items.\n\n### Invalid\n\nUse `aria-invalid` on `RadioGroupItem` and `data-invalid` on `Field` to show validation errors.',
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
