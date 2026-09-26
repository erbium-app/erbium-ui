import ExampleInputDisabled from "../examples/input-disabled";
import ExampleInputFile from "../examples/input-file";
import type { Meta, StoryObj } from "@storybook/tanstack-react";
import { Input } from "@erbium/ui/components/input";
import Demo from "../examples/input-demo";

const meta = {
  title: "UI/Input",
  component: Input,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          'A text input component for forms and user data entry with built-in styling and accessibility features.\n\n**Import:** `@erbium/ui/components/input`  \n\n**shadcn/ui page:** [Input](https://ui.shadcn.com/docs/components/base/input)\n\n### Usage\n\n```tsx\nimport { Input } from "@erbium/ui/components/input"\n```\n\n```tsx\n<Input />\n```\n\n### Basic\n\nstyleName="base-nova"\n\nname="input-basic"\n\npreviewClassName="*:max-w-xs"\n\n/>\n\n### Field\n\nUse `Field`, `FieldLabel`, and `FieldDescription` to create an input with a\n\nlabel and description.\n\nstyleName="base-nova"\n\nname="input-field"\n\npreviewClassName="*:max-w-xs"\n\n/>\n\n### Field Group\n\nUse `FieldGroup` to show multiple `Field` blocks and to build forms.\n\nstyleName="base-nova"\n\nname="input-fieldgroup"\n\npreviewClassName="*:max-w-xs"\n\n/>\n\n### Disabled\n\nUse the `disabled` prop to disable the input. To style the disabled state, add the `data-disabled` attribute to the `Field` component.\n\nstyleName="base-nova"\n\nname="input-disabled"\n\npreviewClassName="*:max-w-xs"\n\n/>\n\n### Invalid\n\nUse the `aria-invalid` prop to mark the input as invalid. To style the invalid state, add the `data-invalid` attribute to the `Field` component.\n\nstyleName="base-nova"\n\nname="input-invalid"\n\npreviewClassName="*:max-w-xs"\n\n/>\n\n### File\n\nUse the `type="file"` prop to create a file input.\n\nstyleName="base-nova"\n\nname="input-file"\n\npreviewClassName="*:max-w-xs"\n\n/>\n\n### Inline\n\nUse `Field` with `orientation="horizontal"` to create an inline input.\n\nPair with `Button` to create a search input with a button.\n\nstyleName="base-nova"\n\nname="input-inline"\n\npreviewClassName="*:max-w-xs"\n\n/>\n\n### Grid\n\nUse a grid layout to place multiple inputs side by side.\n\nstyleName="base-nova"\n\nname="input-grid"\n\npreviewClassName="p-6"\n\n/>\n\n### Required\n\nUse the `required` attribute to indicate required inputs.\n\nstyleName="base-nova"\n\nname="input-required"\n\npreviewClassName="*:max-w-xs"\n\n/>\n\n### Badge\n\nUse `Badge` in the label to highlight a recommended field.\n\nstyleName="base-nova"\n\nname="input-badge"\n\npreviewClassName="*:max-w-xs"\n\n/>\n\n### Input Group\n\nTo add icons, text, or buttons inside an input, use the `InputGroup` component. See the [Input Group](https://ui.shadcn.com/docs/components/input-group) component for more examples.\n\nstyleName="base-nova"\n\nname="input-input-group"\n\npreviewClassName="*:max-w-xs"\n\n/>\n\n### Button Group\n\nTo add buttons to an input, use the `ButtonGroup` component. See the [Button Group](https://ui.shadcn.com/docs/components/button-group) component for more examples.\n\nstyleName="base-nova"\n\nname="input-button-group"\n\npreviewClassName="*:max-w-xs"\n\n/>\n\n### Form\n\nA full form example with multiple inputs, a select, and a button.\n\nstyleName="base-nova"\n\nname="input-form"\n\npreviewClassName="h-[32rem]"\n\n/>',
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
        code: 'import { Input } from "@erbium/ui/components/input";\n\nexport default function InputDemo() {\n  return <Input type="email" placeholder="Email" />;\n}\n',
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
  render: () => <Input disabled placeholder="Unavailable" />,
};
export const Invalid: Story = { render: () => <Input aria-invalid placeholder="Invalid email" /> };
export const FileControl: Story = { render: () => <Input type="file" aria-label="Upload file" /> };

export const Disabled: Story = {
  parameters: {
    docs: {
      source: {
        code: 'import { Input } from "@erbium/ui/components/input"\n\nexport default function InputDisabled() {\n  return <Input disabled type="email" placeholder="Email" />\n}\n',
      },
    },
  },
  render: () => (
    <div className="w-full min-w-72 max-w-2xl p-4">
      <ExampleInputDisabled />
    </div>
  ),
};
export const File: Story = {
  parameters: {
    docs: {
      source: {
        code: 'import { Input } from "@erbium/ui/components/input"\nimport { Label } from "@erbium/ui/components/label"\n\nexport default function InputFile() {\n  return (\n    <div className="grid w-full max-w-sm items-center gap-3">\n      <Label htmlFor="picture">Picture</Label>\n      <Input id="picture" type="file" />\n    </div>\n  )\n}\n',
      },
    },
  },
  render: () => (
    <div className="w-full min-w-72 max-w-2xl p-4">
      <ExampleInputFile />
    </div>
  ),
};
