import ExampleTextareaDisabled from "./examples/textarea-disabled";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Textarea } from "@erbium/ui/components/textarea";
import Demo from "./examples/textarea-demo";

const meta = {
  title: "UI/Textarea",
  component: Textarea,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          'Displays a form textarea or a component that looks like a textarea.\n\n**Import:** `@erbium/ui/components/textarea`  \n\n**shadcn/ui page:** [Textarea](https://ui.shadcn.com/docs/components/base/textarea)\n\n### Usage\n\n```tsx\nimport { Textarea } from "@erbium/ui/components/textarea"\n```\n\n```tsx\n<Textarea />\n```\n\n### Field\n\nUse `Field`, `FieldLabel`, and `FieldDescription` to create a textarea with a label and description.\n\nstyleName="base-nova"\n\nname="textarea-field"\n\npreviewClassName="*:max-w-xs"\n\n/>\n\n### Disabled\n\nUse the `disabled` prop to disable the textarea. To style the disabled state, add the `data-disabled` attribute to the `Field` component.\n\nstyleName="base-nova"\n\nname="textarea-disabled"\n\npreviewClassName="*:max-w-xs"\n\n/>\n\n### Invalid\n\nUse the `aria-invalid` prop to mark the textarea as invalid. To style the invalid state, add the `data-invalid` attribute to the `Field` component.\n\nstyleName="base-nova"\n\nname="textarea-invalid"\n\npreviewClassName="*:max-w-xs"\n\n/>\n\n### Button\n\nPair with `Button` to create a textarea with a submit button.\n\nstyleName="base-nova"\n\nname="textarea-button"\n\npreviewClassName="*:max-w-xs"\n\n/>',
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
  render: () => <Textarea disabled placeholder="Unavailable" />,
};
export const Invalid: Story = {
  render: () => <Textarea aria-invalid placeholder="Tell us more" />,
};

export const Disabled: Story = {
  parameters: {
    docs: {
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
