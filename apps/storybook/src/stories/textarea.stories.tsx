import { TextareaField } from "../examples/upstream/textarea-field";
import { TextareaButton } from "../examples/upstream/textarea-button";
import ExampleTextareaDisabled from "../examples/textarea-disabled";
import type { Meta, StoryObj } from "@storybook/tanstack-react";
import { Textarea } from "@erbium/ui/components/textarea";
import Demo from "../examples/textarea-demo";

const meta = {
  title: "UI/Textarea",
  component: Textarea,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          'Displays a form textarea or a component that looks like a textarea.\n\n**Import:** `@erbium/ui/components/textarea`  \n\n**shadcn/ui page:** [Textarea](https://ui.shadcn.com/docs/components/base/textarea)\n\n### Usage\n\n```tsx\nimport { Textarea } from "@erbium/ui/components/textarea"\n```\n\n```tsx\n<Textarea />\n```',
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Playground: StoryObj<typeof Textarea> = {
  args: { placeholder: "Type here", disabled: false, rows: 3, className: "" },
  argTypes: {
    disabled: { control: "boolean" },
    rows: { control: { type: "number", min: 1, max: 12 } },
  },
  render: (args) => <Textarea {...args} className={`w-72 ${args.className ?? ""}`} />,
};

export const Overview: Story = {
  parameters: {
    docs: {
      source: {
        code: 'import { Textarea } from "@erbium/ui/components/textarea";\n\nexport default function TextareaDemo() {\n  return <Textarea placeholder="Type your message here." />;\n}\n',
      },
    },
  },
  render: () => (
    <div className="w-full min-w-72 max-w-2xl p-4">
      <Demo />
    </div>
  ),
};

export const DisabledControl: Story = {
  parameters: {
    docs: {
      description: { story: "Disable a textarea when its value cannot be changed." },
    },
  },

  render: () => <Textarea disabled placeholder="Unavailable" />,
};
export const Invalid: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Use the `aria-invalid` prop to mark the textarea as invalid. To style the invalid state, add the `data-invalid` attribute to the `Field` component.",
      },
    },
  },

  render: () => <Textarea aria-invalid placeholder="Tell us more" />,
};

export const Disabled: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Use the `disabled` prop to disable the textarea. To style the disabled state, add the `data-disabled` attribute to the `Field` component.",
      },

      source: {
        code: 'import { Textarea } from "@erbium/ui/components/textarea"\n\nexport default function TextareaDisabled() {\n  return <Textarea placeholder="Type your message here." disabled />\n}\n',
      },
    },
  },
  render: () => (
    <div className="w-full min-w-72 max-w-2xl p-4">
      <ExampleTextareaDisabled />
    </div>
  ),
};

export const Field: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Use `Field`, `FieldLabel`, and `FieldDescription` to create a textarea with a label and description.",
      },
      source: {
        code: 'import { Field, FieldDescription, FieldLabel } from "@erbium/ui/components/field";\nimport { Textarea } from "@erbium/ui/components/textarea";\n\nexport function TextareaField() {\n  return (\n    <Field>\n      <FieldLabel htmlFor="textarea-message">Message</FieldLabel>\n      <FieldDescription>Enter your message below.</FieldDescription>\n      <Textarea id="textarea-message" placeholder="Type your message here." />\n    </Field>\n  );\n}\n',
      },
    },
  },
  render: () => <TextareaField />,
};
export const Button: Story = {
  parameters: {
    docs: {
      description: { story: "Pair with `Button` to create a textarea with a submit button." },
      source: {
        code: 'import { Button } from "@erbium/ui/components/button";\nimport { Textarea } from "@erbium/ui/components/textarea";\n\nexport function TextareaButton() {\n  return (\n    <div className="grid w-full gap-2">\n      <Textarea placeholder="Type your message here." />\n      <Button>Send message</Button>\n    </div>\n  );\n}\n',
      },
    },
  },
  render: () => <TextareaButton />,
};
