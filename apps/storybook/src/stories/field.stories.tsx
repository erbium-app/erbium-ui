import { FieldDescription } from "@erbium/ui/components/field";
import FieldGroupExample from "../examples/upstream/field-group";
import { FieldResponsive } from "../examples/upstream/field-responsive";
import ExampleFieldInput from "../examples/field-input";
import ExampleFieldTextarea from "../examples/field-textarea";
import ExampleFieldSelect from "../examples/field-select";
import ExampleFieldSlider from "../examples/field-slider";
import ExampleFieldFieldset from "../examples/field-fieldset";
import ExampleFieldCheckbox from "../examples/field-checkbox";
import ExampleFieldRadio from "../examples/field-radio";
import ExampleFieldSwitch from "../examples/field-switch";
import ExampleFieldChoiceCard from "../examples/field-choice-card";
import ExampleFieldGroup from "../examples/field-group";
import ExampleFieldResponsive from "../examples/field-responsive";
import type { Meta, StoryObj } from "@storybook/tanstack-react";
import { Field, FieldError, FieldLabel, FieldLegend, FieldSet } from "@erbium/ui/components/field";
import { Input as UIInput } from "@erbium/ui/components/input";
import Demo from "../examples/field-demo";

const meta = {
  title: "UI/Field",
  component: Field,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          'Combine labels, controls, and help text to compose accessible form fields and grouped inputs.\n\n**Import:** `@erbium/ui/components/field`  \n\n**shadcn/ui page:** [Field](https://ui.shadcn.com/docs/components/base/field)\n\n### Usage\n\n```tsx\nimport {\n  Field,\n  FieldContent,\n  FieldDescription,\n  FieldError,\n  FieldGroup,\n  FieldLabel,\n  FieldLegend,\n  FieldSeparator,\n  FieldSet,\n} from "@erbium/ui/components/field"\n```\n\n```tsx\n<FieldSet>\n  <FieldLegend>Profile</FieldLegend>\n  <FieldDescription>This appears on invoices and emails.</FieldDescription>\n  <FieldGroup>\n    <Field>\n      <FieldLabel htmlFor="name">Full name</FieldLabel>\n      <Input id="name" autoComplete="off" placeholder="Evil Rabbit" />\n      <FieldDescription>This appears on invoices and emails.</FieldDescription>\n    </Field>\n    <Field>\n      <FieldLabel htmlFor="username">Username</FieldLabel>\n      <Input id="username" autoComplete="off" aria-invalid />\n      <FieldError>Choose another username.</FieldError>\n    </Field>\n    <Field orientation="horizontal">\n      <Switch id="newsletter" />\n      <FieldLabel htmlFor="newsletter">Subscribe to the newsletter</FieldLabel>\n    </Field>\n  </FieldGroup>\n</FieldSet>\n```\n\n### Composition\n\nA single control with label, helper text, and validation.\n\nRelated fields in one group. Use `FieldSeparator` between sections when needed.\n\nSemantic grouping with a legend and description, usually containing a `FieldGroup`.\n\n```text\nField\n├── FieldLabel\n├── Input / Textarea / Switch / Select\n├── FieldDescription\n└── FieldError\n```\n\n```text\nFieldGroup\n├── Field\n│   ├── FieldLabel\n│   ├── Input / Textarea / Switch / Select\n│   ├── FieldDescription\n│   └── FieldError\n├── FieldSeparator\n└── Field\n    ├── FieldLabel\n    └── Input / Textarea / Switch / Select\n```\n\n```text\nFieldSet\n├── FieldLegend\n├── FieldDescription\n└── FieldGroup\n    ├── Field\n    │   ├── FieldLabel\n    │   ├── Input / Textarea / Switch / Select\n    │   ├── FieldDescription\n    │   └── FieldError\n    └── Field\n        ├── FieldLabel\n        └── Input / Textarea / Switch / Select\n```\n\n### Anatomy\n\nThe `Field` family is designed for composing accessible forms. A typical field is structured as follows:\n\n- `Field` is the core wrapper for a single field.\n\n- `FieldContent` is a flex column that groups label and description. Not required if you have no description.\n\n- Wrap related fields with `FieldGroup`, and use `FieldSet` with `FieldLegend` for semantic grouping.\n\n```tsx\n<Field>\n  <FieldLabel htmlFor="input-id">Label</FieldLabel>\n  {/* Input, Select, Switch, etc. */}\n  <FieldDescription>Optional helper text.</FieldDescription>\n  <FieldError>Validation message.</FieldError>\n</Field>\n```\n\n### Form\n\nSee the [Form](https://ui.shadcn.com/docs/forms) documentation for building forms with the `Field` component and [React Hook Form](https://ui.shadcn.com/docs/forms/react-hook-form), [Tanstack Form](https://ui.shadcn.com/docs/forms/tanstack-form), or [Formisch](https://ui.shadcn.com/docs/forms/formisch).\n\n### Accessibility\n\n- `FieldSet` and `FieldLegend` keep related controls grouped for keyboard and assistive tech users.\n\n- `Field` outputs `role="group"` so nested controls inherit labeling from `FieldLabel` and `FieldLegend` when combined.\n\n- Apply `FieldSeparator` sparingly to ensure screen readers encounter clear section boundaries.',
      },
    },
  },
} satisfies Meta<typeof Field>;

export default meta;
type Story = StoryObj;

export const Playground: StoryObj<{
  orientation: "vertical" | "horizontal" | "responsive";
  invalid: boolean;
  error: string;
  className: string;
  legendVariant: "legend" | "label";
}> = {
  args: {
    orientation: "vertical",
    invalid: false,
    error: "Enter a valid email.",
    className: "",
    legendVariant: "legend",
  },
  argTypes: {
    orientation: { control: "select", options: ["vertical", "horizontal", "responsive"] },
    invalid: { control: "boolean" },
    error: { control: "text" },
    className: { control: "text" },
    legendVariant: { control: "select", options: ["legend", "label"] },
  },
  render: (args) => (
    <FieldSet>
      <FieldLegend variant={args.legendVariant}>Contact details</FieldLegend>
      <Field
        orientation={args.orientation}
        invalid={args.invalid}
        className={`w-80 ${args.className}`}
      >
        <FieldLabel htmlFor="playground-field">Email</FieldLabel>
        <UIInput id="playground-field" placeholder="name@example.com" />
        <FieldDescription>We will use this to contact you.</FieldDescription>
        <FieldError errors={args.invalid ? [{ message: args.error }] : []} />
      </Field>
    </FieldSet>
  ),
};

export const Overview: Story = {
  parameters: {
    docs: {
      source: {
        code: 'import { Button } from "@erbium/ui/components/button";\nimport { Checkbox } from "@erbium/ui/components/checkbox";\nimport {\n  Field,\n  FieldDescription,\n  FieldGroup,\n  FieldLabel,\n  FieldLegend,\n  FieldSeparator,\n  FieldSet,\n} from "@erbium/ui/components/field";\nimport { Input } from "@erbium/ui/components/input";\nimport {\n  Select,\n  SelectContent,\n  SelectItem,\n  SelectTrigger,\n  SelectValue,\n} from "@erbium/ui/components/select";\nimport { Textarea } from "@erbium/ui/components/textarea";\nimport { StatefulButton } from "@erbium/ui/components/stateful-button";\n\nexport default function FieldDemo() {\n  return (\n    <div className="w-full max-w-md">\n      <form onSubmit={(event) => event.preventDefault()}>\n        <FieldGroup>\n          <FieldSet>\n            <FieldLegend>Payment Method</FieldLegend>\n            <FieldDescription>All transactions are secure and encrypted</FieldDescription>\n            <FieldGroup>\n              <Field>\n                <FieldLabel>Name on Card</FieldLabel>\n                <Input placeholder="Evil Rabbit" required />\n              </Field>\n              <Field>\n                <FieldLabel>Card Number</FieldLabel>\n                <Input placeholder="1234 5678 9012 3456" required />\n                <FieldDescription>Enter your 16-digit card number</FieldDescription>\n              </Field>\n              <div className="grid grid-cols-3 gap-4">\n                <Field>\n                  <FieldLabel htmlFor="checkout-exp-month-ts6">Month</FieldLabel>\n                  <Select defaultValue="">\n                    <SelectTrigger id="checkout-exp-month-ts6">\n                      <SelectValue placeholder="MM" />\n                    </SelectTrigger>\n                    <SelectContent>\n                      <SelectItem value="01">01</SelectItem>\n                      <SelectItem value="02">02</SelectItem>\n                      <SelectItem value="03">03</SelectItem>\n                      <SelectItem value="04">04</SelectItem>\n                      <SelectItem value="05">05</SelectItem>\n                      <SelectItem value="06">06</SelectItem>\n                      <SelectItem value="07">07</SelectItem>\n                      <SelectItem value="08">08</SelectItem>\n                      <SelectItem value="09">09</SelectItem>\n                      <SelectItem value="10">10</SelectItem>\n                      <SelectItem value="11">11</SelectItem>\n                      <SelectItem value="12">12</SelectItem>\n                    </SelectContent>\n                  </Select>\n                </Field>\n                <Field>\n                  <FieldLabel htmlFor="checkout-7j9-exp-year-f59">Year</FieldLabel>\n                  <Select defaultValue="">\n                    <SelectTrigger id="checkout-7j9-exp-year-f59">\n                      <SelectValue placeholder="YYYY" />\n                    </SelectTrigger>\n                    <SelectContent>\n                      <SelectItem value="2024">2024</SelectItem>\n                      <SelectItem value="2025">2025</SelectItem>\n                      <SelectItem value="2026">2026</SelectItem>\n                      <SelectItem value="2027">2027</SelectItem>\n                      <SelectItem value="2028">2028</SelectItem>\n                      <SelectItem value="2029">2029</SelectItem>\n                    </SelectContent>\n                  </Select>\n                </Field>\n                <Field>\n                  <FieldLabel>CVV</FieldLabel>\n                  <Input placeholder="123" required />\n                </Field>\n              </div>\n            </FieldGroup>\n          </FieldSet>\n          <FieldSeparator />\n          <FieldSet>\n            <FieldLegend>Billing Address</FieldLegend>\n            <FieldDescription>\n              The billing address associated with your payment method\n            </FieldDescription>\n            <FieldGroup>\n              <Field orientation="horizontal">\n                <Checkbox defaultChecked />\n                <FieldLabel className="font-normal">Same as shipping address</FieldLabel>\n              </Field>\n            </FieldGroup>\n          </FieldSet>\n          <FieldSet>\n            <FieldGroup>\n              <Field>\n                <FieldLabel>Comments</FieldLabel>\n                <Textarea placeholder="Add any additional comments" className="resize-none" />\n              </Field>\n            </FieldGroup>\n          </FieldSet>\n          <Field orientation="horizontal">\n            <StatefulButton type="submit">Submit</StatefulButton>\n            <Button variant="outline" type="button">\n              Cancel\n            </Button>\n          </Field>\n        </FieldGroup>\n      </form>\n    </div>\n  );\n}\n',
      },
    },
  },
  render: () => (
    <div className="w-full min-w-72 max-w-2xl p-4">
      <Demo />
    </div>
  ),
};

export const Input: Story = {
  parameters: {
    docs: {
      description: { story: "Compose a field with a labeled input." },

      source: {
        code: 'import {\n  Field,\n  FieldDescription,\n  FieldGroup,\n  FieldLabel,\n  FieldSet,\n} from "@erbium/ui/components/field";\nimport { Input } from "@erbium/ui/components/input";\n\nexport default function FieldInput() {\n  return (\n    <div className="w-full max-w-md">\n      <FieldSet>\n        <FieldGroup>\n          <Field>\n            <FieldLabel>Username</FieldLabel>\n            <Input type="text" placeholder="Max Leiter" />\n            <FieldDescription>Choose a unique username for your account.</FieldDescription>\n          </Field>\n          <Field>\n            <FieldLabel>Password</FieldLabel>\n            <FieldDescription>Must be at least 8 characters long.</FieldDescription>\n            <Input type="password" placeholder="••••••••" />\n          </Field>\n        </FieldGroup>\n      </FieldSet>\n    </div>\n  );\n}\n',
      },
    },
  },
  render: () => (
    <div className="w-full min-w-72 max-w-2xl p-4">
      <ExampleFieldInput />
    </div>
  ),
};
export const Textarea: Story = {
  parameters: {
    docs: {
      description: { story: "Compose a field with a labeled textarea." },

      source: {
        code: 'import {\n  Field,\n  FieldDescription,\n  FieldGroup,\n  FieldLabel,\n  FieldSet,\n} from "@erbium/ui/components/field";\nimport { Textarea } from "@erbium/ui/components/textarea";\n\nexport default function FieldTextarea() {\n  return (\n    <div className="w-full max-w-md">\n      <FieldSet>\n        <FieldGroup>\n          <Field>\n            <FieldLabel>Feedback</FieldLabel>\n            <Textarea placeholder="Your feedback helps us improve..." rows={4} />\n            <FieldDescription>Share your thoughts about our service.</FieldDescription>\n          </Field>\n        </FieldGroup>\n      </FieldSet>\n    </div>\n  );\n}\n',
      },
    },
  },
  render: () => (
    <div className="w-full min-w-72 max-w-2xl p-4">
      <ExampleFieldTextarea />
    </div>
  ),
};
export const Select: Story = {
  parameters: {
    docs: {
      description: { story: "Compose a field with a select control." },

      source: {
        code: 'import {\n  Field,\n  FieldDescription,\n  FieldLabel,\n} from "@erbium/ui/components/field"\nimport {\n  Select,\n  SelectContent,\n  SelectItem,\n  SelectTrigger,\n  SelectValue,\n} from "@erbium/ui/components/select"\n\nexport default function FieldSelect() {\n  return (\n    <div className="w-full max-w-md">\n      <Field>\n        <FieldLabel>Department</FieldLabel>\n        <Select>\n          <SelectTrigger>\n            <SelectValue placeholder="Choose department" />\n          </SelectTrigger>\n          <SelectContent>\n            <SelectItem value="engineering">Engineering</SelectItem>\n            <SelectItem value="design">Design</SelectItem>\n            <SelectItem value="marketing">Marketing</SelectItem>\n            <SelectItem value="sales">Sales</SelectItem>\n            <SelectItem value="support">Customer Support</SelectItem>\n            <SelectItem value="hr">Human Resources</SelectItem>\n            <SelectItem value="finance">Finance</SelectItem>\n            <SelectItem value="operations">Operations</SelectItem>\n          </SelectContent>\n        </Select>\n        <FieldDescription>\n          Select your department or area of work.\n        </FieldDescription>\n      </Field>\n    </div>\n  )\n}\n',
      },
    },
  },
  render: () => (
    <div className="w-full min-w-72 max-w-2xl p-4">
      <ExampleFieldSelect />
    </div>
  ),
};
export const Slider: Story = {
  parameters: {
    docs: {
      description: { story: "Compose a field with a slider." },

      source: {
        code: 'import { useState } from "react";\n\nimport { Field, FieldDescription, FieldLabel } from "@erbium/ui/components/field";\nimport { Slider } from "@erbium/ui/components/slider";\n\nexport default function FieldSlider() {\n  const [value, setValue] = useState([200, 800]);\n  return (\n    <div className="w-full max-w-md">\n      <Field>\n        <FieldLabel>Price Range</FieldLabel>\n        <FieldDescription>\n          Set your budget range ($\n          <span className="font-medium tabular-nums">{value[0]}</span> -{" "}\n          <span className="font-medium tabular-nums">{value[1]}</span>).\n        </FieldDescription>\n        <Slider\n          value={value}\n          onValueChange={(next) => setValue(Array.isArray(next) ? [...next] : [next])}\n          max={1000}\n          min={0}\n          step={10}\n          className="mt-2 w-full"\n          aria-label="Price Range"\n        />\n      </Field>\n    </div>\n  );\n}\n',
      },
    },
  },
  render: () => (
    <div className="w-full min-w-72 max-w-2xl p-4">
      <ExampleFieldSlider />
    </div>
  ),
};
export const Fieldset: Story = {
  parameters: {
    docs: {
      description: { story: "Group related fields in a fieldset." },

      source: {
        code: 'import {\n  Field,\n  FieldDescription,\n  FieldGroup,\n  FieldLabel,\n  FieldLegend,\n  FieldSet,\n} from "@erbium/ui/components/field";\nimport { Input } from "@erbium/ui/components/input";\n\nexport default function FieldFieldset() {\n  return (\n    <div className="w-full max-w-md space-y-6">\n      <FieldSet>\n        <FieldLegend>Address Information</FieldLegend>\n        <FieldDescription>We need your address to deliver your order.</FieldDescription>\n        <FieldGroup>\n          <Field>\n            <FieldLabel>Street Address</FieldLabel>\n            <Input type="text" placeholder="123 Main St" />\n          </Field>\n          <div className="grid grid-cols-2 gap-4">\n            <Field>\n              <FieldLabel>City</FieldLabel>\n              <Input type="text" placeholder="New York" />\n            </Field>\n            <Field>\n              <FieldLabel>Postal Code</FieldLabel>\n              <Input type="text" placeholder="90502" />\n            </Field>\n          </div>\n        </FieldGroup>\n      </FieldSet>\n    </div>\n  );\n}\n',
      },
    },
  },
  render: () => (
    <div className="w-full min-w-72 max-w-2xl p-4">
      <ExampleFieldFieldset />
    </div>
  ),
};
export const Checkbox: Story = {
  parameters: {
    docs: {
      description: { story: "Compose a field with a checkbox." },

      source: {
        code: 'import { Checkbox } from "@erbium/ui/components/checkbox";\nimport {\n  Field,\n  FieldContent,\n  FieldDescription,\n  FieldGroup,\n  FieldLabel,\n  FieldLegend,\n  FieldSeparator,\n  FieldSet,\n} from "@erbium/ui/components/field";\n\nexport default function FieldCheckbox() {\n  return (\n    <div className="w-full max-w-md">\n      <FieldGroup>\n        <FieldSet>\n          <FieldLegend variant="label">Show these items on the desktop</FieldLegend>\n          <FieldDescription>Select the items you want to show on the desktop.</FieldDescription>\n          <FieldGroup className="gap-3">\n            <Field orientation="horizontal">\n              <Checkbox defaultChecked />\n              <FieldLabel className="font-normal">Hard disks</FieldLabel>\n            </Field>\n            <Field orientation="horizontal">\n              <Checkbox />\n              <FieldLabel className="font-normal">External disks</FieldLabel>\n            </Field>\n            <Field orientation="horizontal">\n              <Checkbox />\n              <FieldLabel className="font-normal">CDs, DVDs, and iPods</FieldLabel>\n            </Field>\n            <Field orientation="horizontal">\n              <Checkbox />\n              <FieldLabel className="font-normal">Connected servers</FieldLabel>\n            </Field>\n          </FieldGroup>\n        </FieldSet>\n        <FieldSeparator />\n        <Field orientation="horizontal">\n          <Checkbox defaultChecked />\n          <FieldContent>\n            <FieldLabel>Sync Desktop & Documents folders</FieldLabel>\n            <FieldDescription>\n              Your Desktop & Documents folders are being synced with iCloud Drive. You can access\n              them from other devices.\n            </FieldDescription>\n          </FieldContent>\n        </Field>\n      </FieldGroup>\n    </div>\n  );\n}\n',
      },
    },
  },
  render: () => (
    <div className="w-full min-w-72 max-w-2xl p-4">
      <ExampleFieldCheckbox />
    </div>
  ),
};
export const Radio: Story = {
  parameters: {
    docs: {
      description: { story: "Compose a field with radio options." },

      source: {
        code: 'import {\n  FieldDescription,\n  FieldItem,\n  FieldLabel,\n  FieldLegend,\n  FieldSet,\n} from "@erbium/ui/components/field";\nimport { RadioGroup, RadioGroupItem } from "@erbium/ui/components/radio-group";\n\nexport default function FieldRadio() {\n  return (\n    <div className="w-full max-w-md">\n      <FieldSet>\n        <FieldLegend variant="label">Subscription Plan</FieldLegend>\n        <FieldDescription>Yearly and lifetime plans offer significant savings.</FieldDescription>\n        <RadioGroup defaultValue="monthly">\n          <FieldItem orientation="horizontal">\n            <RadioGroupItem value="monthly" />\n            <FieldLabel className="font-normal">Monthly ($9.99/month)</FieldLabel>\n          </FieldItem>\n          <FieldItem orientation="horizontal">\n            <RadioGroupItem value="yearly" />\n            <FieldLabel className="font-normal">Yearly ($99.99/year)</FieldLabel>\n          </FieldItem>\n          <FieldItem orientation="horizontal">\n            <RadioGroupItem value="lifetime" />\n            <FieldLabel className="font-normal">Lifetime ($299.99)</FieldLabel>\n          </FieldItem>\n        </RadioGroup>\n      </FieldSet>\n    </div>\n  );\n}\n',
      },
    },
  },
  render: () => (
    <div className="w-full min-w-72 max-w-2xl p-4">
      <ExampleFieldRadio />
    </div>
  ),
};
export const Switch: Story = {
  parameters: {
    docs: {
      description: { story: "Compose a field with a switch." },

      source: {
        code: 'import { Field, FieldContent, FieldDescription, FieldLabel } from "@erbium/ui/components/field";\nimport { Switch } from "@erbium/ui/components/switch";\n\nexport default function FieldSwitch() {\n  return (\n    <div className="w-full max-w-md">\n      <Field orientation="horizontal">\n        <FieldContent>\n          <FieldLabel>Multi-factor authentication</FieldLabel>\n          <FieldDescription>\n            Enable multi-factor authentication. If you do not have a two-factor device, you can use\n            a one-time code sent to your email.\n          </FieldDescription>\n        </FieldContent>\n        <Switch />\n      </Field>\n    </div>\n  );\n}\n',
      },
    },
  },
  render: () => (
    <div className="w-full min-w-72 max-w-2xl p-4">
      <ExampleFieldSwitch />
    </div>
  ),
};
export const ChoiceCard: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Wrap `Field` components inside `FieldLabel` to create selectable field groups. This works with `RadioItem`, `Checkbox` and `Switch` components.",
      },

      source: {
        code: 'import {\n  Field,\n  FieldContent,\n  FieldDescription,\n  FieldGroup,\n  FieldItem,\n  FieldLabel,\n  FieldLegend,\n  FieldSet,\n} from "@erbium/ui/components/field";\nimport { RadioGroup, RadioGroupItem } from "@erbium/ui/components/radio-group";\n\nexport default function FieldChoiceCard() {\n  return (\n    <div className="w-full max-w-md">\n      <FieldGroup>\n        <FieldSet>\n          <FieldLegend variant="label">Compute Environment</FieldLegend>\n          <FieldDescription>Select the compute environment for your cluster.</FieldDescription>\n          <Field>\n            <RadioGroup defaultValue="kubernetes">\n              <FieldItem variant="card" orientation="horizontal">\n                <FieldContent>\n                  <FieldLabel>Kubernetes</FieldLabel>\n                  <FieldDescription>\n                    Run GPU workloads on a K8s configured cluster.\n                  </FieldDescription>\n                </FieldContent>\n                <RadioGroupItem value="kubernetes" />\n              </FieldItem>\n              <FieldItem variant="card" orientation="horizontal">\n                <FieldContent>\n                  <FieldLabel>Virtual Machine</FieldLabel>\n                  <FieldDescription>\n                    Access a VM configured cluster to run GPU workloads.\n                  </FieldDescription>\n                </FieldContent>\n                <RadioGroupItem value="vm" />\n              </FieldItem>\n            </RadioGroup>\n          </Field>\n        </FieldSet>\n      </FieldGroup>\n    </div>\n  );\n}\n',
      },
    },
  },
  render: () => (
    <div className="w-full min-w-72 max-w-2xl p-4">
      <ExampleFieldChoiceCard />
    </div>
  ),
};
export const FieldGroup: Story = {
  parameters: {
    docs: {
      description: {
        story: "Stack `Field` components with `FieldGroup`. Add `FieldSeparator` to divide them.",
      },

      source: {
        code: 'import { Checkbox } from "@erbium/ui/components/checkbox";\nimport {\n  Field,\n  FieldDescription,\n  FieldGroup,\n  FieldLabel,\n  FieldSeparator,\n  FieldSet,\n} from "@erbium/ui/components/field";\n\nexport default function FieldGroupExample() {\n  return (\n    <div className="w-full max-w-md">\n      <FieldGroup>\n        <FieldSet>\n          <FieldLabel>Responses</FieldLabel>\n          <FieldDescription>\n            Get notified when ChatGPT responds to requests that take time, like research or image\n            generation.\n          </FieldDescription>\n          <FieldGroup data-slot="checkbox-group">\n            <Field orientation="horizontal">\n              <Checkbox defaultChecked disabled />\n              <FieldLabel className="font-normal">Push notifications</FieldLabel>\n            </Field>\n          </FieldGroup>\n        </FieldSet>\n        <FieldSeparator />\n        <FieldSet>\n          <FieldLabel>Tasks</FieldLabel>\n          <FieldDescription>\n            Get notified when tasks you&apos;ve created have updates. <a href="#">Manage tasks</a>\n          </FieldDescription>\n          <FieldGroup data-slot="checkbox-group">\n            <Field orientation="horizontal">\n              <Checkbox />\n              <FieldLabel className="font-normal">Push notifications</FieldLabel>\n            </Field>\n            <Field orientation="horizontal">\n              <Checkbox />\n              <FieldLabel className="font-normal">Email notifications</FieldLabel>\n            </Field>\n          </FieldGroup>\n        </FieldSet>\n      </FieldGroup>\n    </div>\n  );\n}\n',
      },
    },
  },
  render: () => (
    <div className="w-full min-w-72 max-w-2xl p-4">
      <ExampleFieldGroup />
    </div>
  ),
};
export const ResponsiveLayout: Story = {
  parameters: {
    docs: {
      description: {
        story:
          '- **Vertical fields:** Default orientation stacks label, control, and helper text—ideal for mobile-first layouts.\n\n- **Horizontal fields:** Set `orientation="horizontal"` on `Field` to align the label and control side-by-side. Pair with `FieldContent` to keep descriptions aligned.\n\n- **Responsive fields:** Set `orientation="responsive"` for automatic column layouts inside container-aware parents. Apply `@container/field-group` classes on `FieldGroup` to switch orientations at specific breakpoints.',
      },

      source: {
        code: 'import { Button } from "@erbium/ui/components/button";\nimport {\n  Field,\n  FieldContent,\n  FieldDescription,\n  FieldGroup,\n  FieldLabel,\n  FieldLegend,\n  FieldSeparator,\n  FieldSet,\n} from "@erbium/ui/components/field";\nimport { Input } from "@erbium/ui/components/input";\nimport { Textarea } from "@erbium/ui/components/textarea";\nimport { StatefulButton } from "@erbium/ui/components/stateful-button";\n\nexport default function FieldResponsive() {\n  return (\n    <div className="w-full max-w-4xl">\n      <form onSubmit={(event) => event.preventDefault()}>\n        <FieldSet>\n          <FieldLegend>Profile</FieldLegend>\n          <FieldDescription>Fill in your profile information.</FieldDescription>\n          <FieldSeparator />\n          <FieldGroup>\n            <Field orientation="responsive">\n              <FieldContent>\n                <FieldLabel>Name</FieldLabel>\n                <FieldDescription>Provide your full name for identification</FieldDescription>\n              </FieldContent>\n              <Input placeholder="Evil Rabbit" required />\n            </Field>\n            <FieldSeparator />\n            <Field orientation="responsive">\n              <FieldContent>\n                <FieldLabel htmlFor="lastName">Message</FieldLabel>\n                <FieldDescription>\n                  You can write your message here. Keep it short, preferably under 100 characters.\n                </FieldDescription>\n              </FieldContent>\n              <Textarea\n                id="message"\n                placeholder="Hello, world!"\n                required\n                className="min-h-[100px] resize-none sm:min-w-[300px]"\n              />\n            </Field>\n            <FieldSeparator />\n            <Field orientation="responsive">\n              <StatefulButton type="submit">Submit</StatefulButton>\n              <Button type="button" variant="outline">\n                Cancel\n              </Button>\n            </Field>\n          </FieldGroup>\n        </FieldSet>\n      </form>\n    </div>\n  );\n}\n',
      },
    },
  },
  render: () => (
    <div className="w-full min-w-72 max-w-2xl p-4">
      <ExampleFieldResponsive />
    </div>
  ),
};

export const Group: Story = {
  parameters: {
    // FieldGroup is a size container with no intrinsic width, so it needs a
    // full-width parent rather than the shrink-to-fit centered layout.
    layout: "padded",
    docs: {
      description: { story: "Group related controls and descriptions." },
      source: {
        code: 'import { Checkbox } from "@erbium/ui/components/checkbox";\nimport {\n  Field,\n  FieldDescription,\n  FieldGroup,\n  FieldLabel,\n  FieldSeparator,\n  FieldSet,\n} from "@erbium/ui/components/field";\n\nexport default function FieldGroupExample() {\n  return (\n    <FieldGroup className="w-full max-w-xs">\n      <FieldSet>\n        <FieldLabel>Responses</FieldLabel>\n        <FieldDescription>\n          Get notified when ChatGPT responds to requests that take time, like research or image\n          generation.\n        </FieldDescription>\n        <FieldGroup data-slot="checkbox-group">\n          <Field orientation="horizontal">\n            <Checkbox defaultChecked disabled />\n            <FieldLabel className="font-normal">Push notifications</FieldLabel>\n          </Field>\n        </FieldGroup>\n      </FieldSet>\n      <FieldSeparator />\n      <FieldSet>\n        <FieldLabel>Tasks</FieldLabel>\n        <FieldDescription>\n          Get notified when tasks you&apos;ve created have updates. <a href="#">Manage tasks</a>\n        </FieldDescription>\n        <FieldGroup data-slot="checkbox-group">\n          <Field orientation="horizontal">\n            <Checkbox />\n            <FieldLabel className="font-normal">Push notifications</FieldLabel>\n          </Field>\n          <Field orientation="horizontal">\n            <Checkbox />\n            <FieldLabel className="font-normal">Email notifications</FieldLabel>\n          </Field>\n        </FieldGroup>\n      </FieldSet>\n    </FieldGroup>\n  );\n}\n',
      },
    },
  },
  render: () => <FieldGroupExample />,
};
export const Responsive: Story = {
  parameters: {
    docs: {
      description: { story: "Adapt the field layout to the available width." },
      source: {
        code: 'import { Button } from "@erbium/ui/components/button";\nimport {\n  Field,\n  FieldContent,\n  FieldDescription,\n  FieldGroup,\n  FieldLabel,\n  FieldLegend,\n  FieldSet,\n} from "@erbium/ui/components/field";\nimport { Input } from "@erbium/ui/components/input";\n\nexport function FieldResponsive() {\n  return (\n    <div className="w-full max-w-lg">\n      <form>\n        <FieldSet>\n          <FieldLegend>Profile</FieldLegend>\n          <FieldDescription>Fill in your profile information.</FieldDescription>\n          <FieldGroup>\n            <Field orientation="responsive">\n              <FieldContent>\n                <FieldLabel>Name</FieldLabel>\n                <FieldDescription>Provide your full name for identification</FieldDescription>\n              </FieldContent>\n              <Input placeholder="Evil Rabbit" required />\n            </Field>\n            <Field orientation="responsive">\n              <Button type="submit">Submit</Button>\n              <Button type="button" variant="outline">\n                Cancel\n              </Button>\n            </Field>\n          </FieldGroup>\n        </FieldSet>\n      </form>\n    </div>\n  );\n}\n',
      },
    },
  },
  render: () => <FieldResponsive />,
};
export const ValidationAndErrors: Story = {
  parameters: {
    docs: {
      description: {
        story:
          '- Add `invalid` to `Field` (Base UI `Field.Root`) to switch the entire block into an error state. Controls inside it receive `aria-invalid` and `data-invalid` automatically.\n\n- With TanStack Form, pass `invalid={!field.state.meta.isValid}` and `errors={field.state.meta.errors}` to `FieldError`.\n\n- Render `FieldError` immediately after the control or inside `FieldContent` to keep error messages aligned with the field.\n\n```tsx\n<Field invalid>\n  <FieldLabel>Email</FieldLabel>\n  <Input type="email" />\n  <FieldError match>Enter a valid email address.</FieldError>\n</Field>\n```',
      },
    },
  },

  render: () => (
    <Field className="w-80" invalid>
      <FieldLabel>Email</FieldLabel>
      <UIInput placeholder="name@example.com" type="email" />
      <FieldError match>Enter a valid email address.</FieldError>
    </Field>
  ),
};
