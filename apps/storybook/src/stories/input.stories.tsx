import { InputBasic } from "../examples/upstream/input-basic";
import { InputField } from "../examples/upstream/input-field";
import { InputFieldgroup } from "../examples/upstream/input-fieldgroup";
import { InputInline } from "../examples/upstream/input-inline";
import { InputGrid } from "../examples/upstream/input-grid";
import { InputRequired } from "../examples/upstream/input-required";
import { InputBadge } from "../examples/upstream/input-badge";
import { InputInputGroup } from "../examples/upstream/input-input-group";
import { InputButtonGroup } from "../examples/upstream/input-button-group";
import { InputForm } from "../examples/upstream/input-form";
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
          'A text input component for forms and user data entry with built-in styling and accessibility features.\n\n**Import:** `@erbium/ui/components/input`  \n\n**shadcn/ui page:** [Input](https://ui.shadcn.com/docs/components/base/input)\n\n### Usage\n\n```tsx\nimport { Input } from "@erbium/ui/components/input"\n```\n\n```tsx\n<Input />\n```',
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Playground: StoryObj<typeof Input> = {
  args: { type: "text", placeholder: "Type here", disabled: false, className: "" },
  argTypes: {
    type: {
      control: "select",
      options: ["text", "email", "password", "number", "search", "date", "file"],
    },
    disabled: { control: "boolean" },
  },
  render: (args) => <Input {...args} className={`w-72 ${args.className ?? ""}`} />,
};

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
  parameters: {
    docs: {
      description: { story: "Disable an input when its value cannot be changed." },
    },
  },

  render: () => <Input disabled placeholder="Unavailable" />,
};
export const Invalid: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Use the `aria-invalid` prop to mark the input as invalid. To style the invalid state, add the `data-invalid` attribute to the `Field` component.",
      },
    },
  },
  render: () => <Input aria-invalid placeholder="Invalid email" />,
};
export const FileControl: Story = {
  parameters: {
    docs: {
      description: { story: "Use a file input to select a local file." },
    },
  },
  render: () => <Input type="file" aria-label="Upload file" />,
};

export const Disabled: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Use the `disabled` prop to disable the input. To style the disabled state, add the `data-disabled` attribute to the `Field` component.",
      },

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
      description: { story: 'Use the `type="file"` prop to create a file input.' },

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

export const Basic: Story = {
  parameters: {
    docs: {
      description: { story: "A basic text input." },

      source: {
        code: 'import { Input } from "@erbium/ui/components/input";\n\nexport function InputBasic() {\n  return <Input placeholder="Enter text" />;\n}\n',
      },
    },
  },
  render: () => <InputBasic />,
};
export const Field: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Use `Field`, `FieldLabel`, and `FieldDescription` to create an input with a\n\nlabel and description.",
      },
      source: {
        code: 'import { Field, FieldDescription, FieldLabel } from "@erbium/ui/components/field";\nimport { Input } from "@erbium/ui/components/input";\n\nexport function InputField() {\n  return (\n    <Field>\n      <FieldLabel htmlFor="input-field-username">Username</FieldLabel>\n      <Input id="input-field-username" type="text" placeholder="Enter your username" />\n      <FieldDescription>Choose a unique username for your account.</FieldDescription>\n    </Field>\n  );\n}\n',
      },
    },
  },
  render: () => <InputField />,
};
export const Fieldgroup: Story = {
  name: "Field Group",
  parameters: {
    docs: {
      description: {
        story: "Use `FieldGroup` to show multiple `Field` blocks and to build forms.",
      },
      source: {
        code: 'import { Button } from "@erbium/ui/components/button";\nimport { Field, FieldDescription, FieldGroup, FieldLabel } from "@erbium/ui/components/field";\nimport { Input } from "@erbium/ui/components/input";\n\nexport function InputFieldgroup() {\n  return (\n    <FieldGroup>\n      <Field>\n        <FieldLabel htmlFor="fieldgroup-name">Name</FieldLabel>\n        <Input id="fieldgroup-name" placeholder="Jordan Lee" />\n      </Field>\n      <Field>\n        <FieldLabel htmlFor="fieldgroup-email">Email</FieldLabel>\n        <Input id="fieldgroup-email" type="email" placeholder="name@example.com" />\n        <FieldDescription>We&apos;ll send updates to this address.</FieldDescription>\n      </Field>\n      <Field orientation="horizontal">\n        <Button type="reset" variant="outline">\n          Reset\n        </Button>\n        <Button type="submit">Submit</Button>\n      </Field>\n    </FieldGroup>\n  );\n}\n',
      },
    },
  },
  render: () => <InputFieldgroup />,
};
export const Inline: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Use `Field` with `orientation="horizontal"` to create an inline input.\n\nPair with `Button` to create a search input with a button.',
      },
      source: {
        code: 'import { Button } from "@erbium/ui/components/button";\nimport { Field } from "@erbium/ui/components/field";\nimport { Input } from "@erbium/ui/components/input";\n\nexport function InputInline() {\n  return (\n    <Field orientation="horizontal">\n      <Input type="search" placeholder="Search..." />\n      <Button>Search</Button>\n    </Field>\n  );\n}\n',
      },
    },
  },
  render: () => <InputInline />,
};
export const Grid: Story = {
  parameters: {
    docs: {
      description: { story: "Use a grid layout to place multiple inputs side by side." },
      source: {
        code: 'import { Field, FieldGroup, FieldLabel } from "@erbium/ui/components/field";\nimport { Input } from "@erbium/ui/components/input";\n\nexport function InputGrid() {\n  return (\n    <FieldGroup className="grid max-w-sm grid-cols-2">\n      <Field>\n        <FieldLabel htmlFor="first-name">First Name</FieldLabel>\n        <Input id="first-name" placeholder="Jordan" />\n      </Field>\n      <Field>\n        <FieldLabel htmlFor="last-name">Last Name</FieldLabel>\n        <Input id="last-name" placeholder="Lee" />\n      </Field>\n    </FieldGroup>\n  );\n}\n',
      },
    },
  },
  render: () => <InputGrid />,
};
export const Required: Story = {
  parameters: {
    docs: {
      description: { story: "Use the `required` attribute to indicate required inputs." },
      source: {
        code: 'import { Field, FieldDescription, FieldLabel } from "@erbium/ui/components/field";\nimport { Input } from "@erbium/ui/components/input";\n\nexport function InputRequired() {\n  return (\n    <Field>\n      <FieldLabel htmlFor="input-required">\n        Required Field <span className="text-destructive">*</span>\n      </FieldLabel>\n      <Input id="input-required" placeholder="This field is required" required />\n      <FieldDescription>This field must be filled out.</FieldDescription>\n    </Field>\n  );\n}\n',
      },
    },
  },
  render: () => <InputRequired />,
};
export const Badge: Story = {
  parameters: {
    docs: {
      description: { story: "Use `Badge` in the label to highlight a recommended field." },
      source: {
        code: 'import { Badge } from "@erbium/ui/components/badge";\nimport { Field, FieldLabel } from "@erbium/ui/components/field";\nimport { Input } from "@erbium/ui/components/input";\n\nexport function InputBadge() {\n  return (\n    <Field>\n      <FieldLabel htmlFor="input-badge">\n        Webhook URL{" "}\n        <Badge variant="secondary" className="ml-auto">\n          Beta\n        </Badge>\n      </FieldLabel>\n      <Input id="input-badge" type="url" placeholder="https://api.example.com/webhook" />\n    </Field>\n  );\n}\n',
      },
    },
  },
  render: () => <InputBadge />,
};
export const InputGroup: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "To add icons, text, or buttons inside an input, use the `InputGroup` component. See the [Input Group](https://ui.shadcn.com/docs/components/input-group) component for more examples.",
      },
      source: {
        code: 'import { InfoIcon } from "lucide-react";\n\nimport { Field, FieldLabel } from "@erbium/ui/components/field";\nimport {\n  InputGroup,\n  InputGroupAddon,\n  InputGroupInput,\n  InputGroupText,\n} from "@erbium/ui/components/input-group";\n\nexport function InputInputGroup() {\n  return (\n    <Field>\n      <FieldLabel htmlFor="input-group-url">Website URL</FieldLabel>\n      <InputGroup>\n        <InputGroupInput id="input-group-url" placeholder="example.com" />\n        <InputGroupAddon>\n          <InputGroupText>https://</InputGroupText>\n        </InputGroupAddon>\n        <InputGroupAddon align="inline-end">\n          <InfoIcon />\n        </InputGroupAddon>\n      </InputGroup>\n    </Field>\n  );\n}\n',
      },
    },
  },
  render: () => <InputInputGroup />,
};
export const ButtonGroup: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "To add buttons to an input, use the `ButtonGroup` component. See the [Button Group](https://ui.shadcn.com/docs/components/button-group) component for more examples.",
      },
      source: {
        code: 'import { Button } from "@erbium/ui/components/button";\nimport { ButtonGroup } from "@erbium/ui/components/button-group";\nimport { Field, FieldLabel } from "@erbium/ui/components/field";\nimport { Input } from "@erbium/ui/components/input";\n\nexport function InputButtonGroup() {\n  return (\n    <Field>\n      <FieldLabel htmlFor="input-button-group">Search</FieldLabel>\n      <ButtonGroup>\n        <Input id="input-button-group" placeholder="Type to search..." />\n        <Button variant="outline">Search</Button>\n      </ButtonGroup>\n    </Field>\n  );\n}\n',
      },
    },
  },
  render: () => <InputButtonGroup />,
};
export const Form: Story = {
  parameters: {
    docs: {
      description: { story: "A full form example with multiple inputs, a select, and a button." },
      source: {
        code: 'import { Button } from "@erbium/ui/components/button";\nimport { Field, FieldDescription, FieldGroup, FieldLabel } from "@erbium/ui/components/field";\nimport { Input } from "@erbium/ui/components/input";\nimport {\n  Select,\n  SelectContent,\n  SelectGroup,\n  SelectItem,\n  SelectTrigger,\n  SelectValue,\n} from "@erbium/ui/components/select";\n\nexport function InputForm() {\n  const countries = [\n    { label: "United States", value: "us" },\n    { label: "United Kingdom", value: "uk" },\n    { label: "Canada", value: "ca" },\n  ];\n  return (\n    <form className="w-full max-w-sm">\n      <FieldGroup>\n        <Field>\n          <FieldLabel htmlFor="form-name">Name</FieldLabel>\n          <Input id="form-name" type="text" placeholder="Evil Rabbit" required />\n        </Field>\n        <Field>\n          <FieldLabel htmlFor="form-email">Email</FieldLabel>\n          <Input id="form-email" type="email" placeholder="john@example.com" />\n          <FieldDescription>We&apos;ll never share your email with anyone.</FieldDescription>\n        </Field>\n        <div className="grid grid-cols-2 gap-4">\n          <Field>\n            <FieldLabel htmlFor="form-phone">Phone</FieldLabel>\n            <Input id="form-phone" type="tel" placeholder="+1 (555) 123-4567" />\n          </Field>\n          <Field>\n            <FieldLabel htmlFor="form-country">Country</FieldLabel>\n            <Select items={countries} defaultValue="us">\n              <SelectTrigger id="form-country">\n                <SelectValue />\n              </SelectTrigger>\n              <SelectContent>\n                <SelectGroup>\n                  {countries.map((country) => (\n                    <SelectItem key={country.value} value={country.value}>\n                      {country.label}\n                    </SelectItem>\n                  ))}\n                </SelectGroup>\n              </SelectContent>\n            </Select>\n          </Field>\n        </div>\n        <Field>\n          <FieldLabel htmlFor="form-address">Address</FieldLabel>\n          <Input id="form-address" type="text" placeholder="123 Main St" />\n        </Field>\n        <Field orientation="horizontal">\n          <Button type="button" variant="outline">\n            Cancel\n          </Button>\n          <Button type="submit">Submit</Button>\n        </Field>\n      </FieldGroup>\n    </form>\n  );\n}\n',
      },
    },
  },
  render: () => <InputForm />,
};
