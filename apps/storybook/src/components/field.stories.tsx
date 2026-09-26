import ExampleFieldInput from "./examples/field-input";
import ExampleFieldTextarea from "./examples/field-textarea";
import ExampleFieldSelect from "./examples/field-select";
import ExampleFieldSlider from "./examples/field-slider";
import ExampleFieldFieldset from "./examples/field-fieldset";
import ExampleFieldCheckbox from "./examples/field-checkbox";
import ExampleFieldRadio from "./examples/field-radio";
import ExampleFieldSwitch from "./examples/field-switch";
import ExampleFieldChoiceCard from "./examples/field-choice-card";
import ExampleFieldGroup from "./examples/field-group";
import ExampleFieldResponsive from "./examples/field-responsive";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Field } from "@erbium/ui/components/field";
import Demo from "./examples/field-demo";

const meta = {
  title: "UI/Field",
  component: Field,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          'Combine labels, controls, and help text to compose accessible form fields and grouped inputs.\n\n**Import:** `@erbium/ui/components/field`  \n\n**shadcn/ui page:** [Field](https://ui.shadcn.com/docs/components/base/field)\n\n### Usage\n\n```tsx\nimport {\n  Field,\n  FieldContent,\n  FieldDescription,\n  FieldError,\n  FieldGroup,\n  FieldLabel,\n  FieldLegend,\n  FieldSeparator,\n  FieldSet,\n  FieldTitle,\n} from "@erbium/ui/components/field"\n```\n\n```tsx\n<FieldSet>\n  <FieldLegend>Profile</FieldLegend>\n  <FieldDescription>This appears on invoices and emails.</FieldDescription>\n  <FieldGroup>\n    <Field>\n      <FieldLabel htmlFor="name">Full name</FieldLabel>\n      <Input id="name" autoComplete="off" placeholder="Evil Rabbit" />\n      <FieldDescription>This appears on invoices and emails.</FieldDescription>\n    </Field>\n    <Field>\n      <FieldLabel htmlFor="username">Username</FieldLabel>\n      <Input id="username" autoComplete="off" aria-invalid />\n      <FieldError>Choose another username.</FieldError>\n    </Field>\n    <Field orientation="horizontal">\n      <Switch id="newsletter" />\n      <FieldLabel htmlFor="newsletter">Subscribe to the newsletter</FieldLabel>\n    </Field>\n  </FieldGroup>\n</FieldSet>\n```\n\n### Composition\n\nA single control with label, helper text, and validation.\n\nRelated fields in one group. Use `FieldSeparator` between sections when needed.\n\nSemantic grouping with a legend and description, usually containing a `FieldGroup`.\n\n```text\nField\n├── FieldLabel\n├── Input / Textarea / Switch / Select\n├── FieldDescription\n└── FieldError\n```\n\n```text\nFieldGroup\n├── Field\n│   ├── FieldLabel\n│   ├── Input / Textarea / Switch / Select\n│   ├── FieldDescription\n│   └── FieldError\n├── FieldSeparator\n└── Field\n    ├── FieldLabel\n    └── Input / Textarea / Switch / Select\n```\n\n```text\nFieldSet\n├── FieldLegend\n├── FieldDescription\n└── FieldGroup\n    ├── Field\n    │   ├── FieldLabel\n    │   ├── Input / Textarea / Switch / Select\n    │   ├── FieldDescription\n    │   └── FieldError\n    └── Field\n        ├── FieldLabel\n        └── Input / Textarea / Switch / Select\n```\n\n### Anatomy\n\nThe `Field` family is designed for composing accessible forms. A typical field is structured as follows:\n\n- `Field` is the core wrapper for a single field.\n\n- `FieldContent` is a flex column that groups label and description. Not required if you have no description.\n\n- Wrap related fields with `FieldGroup`, and use `FieldSet` with `FieldLegend` for semantic grouping.\n\n```tsx\n<Field>\n  <FieldLabel htmlFor="input-id">Label</FieldLabel>\n  {/* Input, Select, Switch, etc. */}\n  <FieldDescription>Optional helper text.</FieldDescription>\n  <FieldError>Validation message.</FieldError>\n</Field>\n```\n\n### Form\n\nSee the [Form](https://ui.shadcn.com/docs/forms) documentation for building forms with the `Field` component and [React Hook Form](https://ui.shadcn.com/docs/forms/react-hook-form), [Tanstack Form](https://ui.shadcn.com/docs/forms/tanstack-form), or [Formisch](https://ui.shadcn.com/docs/forms/formisch).\n\n### Input\n\n### Textarea\n\n### Select\n\n### Slider\n\n### Fieldset\n\n### Checkbox\n\nstyleName="base-nova"\n\nname="field-checkbox"\n\npreviewClassName="h-[32rem]"\n\n/>\n\n### Radio\n\n### Switch\n\n### Choice Card\n\nWrap `Field` components inside `FieldLabel` to create selectable field groups. This works with `RadioItem`, `Checkbox` and `Switch` components.\n\n### Field Group\n\nStack `Field` components with `FieldGroup`. Add `FieldSeparator` to divide them.\n\nstyleName="base-nova"\n\nname="field-group"\n\npreviewClassName="h-96"\n\n/>\n\n### Responsive Layout\n\n- **Vertical fields:** Default orientation stacks label, control, and helper text—ideal for mobile-first layouts.\n\n- **Horizontal fields:** Set `orientation="horizontal"` on `Field` to align the label and control side-by-side. Pair with `FieldContent` to keep descriptions aligned.\n\n- **Responsive fields:** Set `orientation="responsive"` for automatic column layouts inside container-aware parents. Apply `@container/field-group` classes on `FieldGroup` to switch orientations at specific breakpoints.\n\nstyleName="base-nova"\n\nname="field-responsive"\n\npreviewClassName="h-[650px] p-6 md:h-[500px] md:p-10"\n\n/>\n\n### Validation and Errors\n\n- Add `data-invalid` to `Field` to switch the entire block into an error state.\n\n- Add `aria-invalid` on the input itself for assistive technologies.\n\n- Render `FieldError` immediately after the control or inside `FieldContent` to keep error messages aligned with the field.\n\n```tsx\n<Field data-invalid>\n  <FieldLabel htmlFor="email">Email</FieldLabel>\n  <Input id="email" type="email" aria-invalid />\n  <FieldError>Enter a valid email address.</FieldError>\n</Field>\n```\n\n### Accessibility\n\n- `FieldSet` and `FieldLegend` keep related controls grouped for keyboard and assistive tech users.\n\n- `Field` outputs `role="group"` so nested controls inherit labeling from `FieldLabel` and `FieldLegend` when combined.\n\n- Apply `FieldSeparator` sparingly to ensure screen readers encounter clear section boundaries.',
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
        code: 'import { Button } from "@erbium/ui/components/button";\nimport { Checkbox } from "@erbium/ui/components/checkbox";\nimport {\n  Field,\n  FieldDescription,\n  FieldGroup,\n  FieldLabel,\n  FieldLegend,\n  FieldSeparator,\n  FieldSet,\n} from "@erbium/ui/components/field";\nimport { Input } from "@erbium/ui/components/input";\nimport {\n  Select,\n  SelectContent,\n  SelectItem,\n  SelectTrigger,\n  SelectValue,\n} from "@erbium/ui/components/select";\nimport { Textarea } from "@erbium/ui/components/textarea";\n\nexport default function FieldDemo() {\n  return (\n    <div className="w-full max-w-md">\n      <form>\n        <FieldGroup>\n          <FieldSet>\n            <FieldLegend>Payment Method</FieldLegend>\n            <FieldDescription>All transactions are secure and encrypted</FieldDescription>\n            <FieldGroup>\n              <Field>\n                <FieldLabel htmlFor="checkout-7j9-card-name-43j">Name on Card</FieldLabel>\n                <Input id="checkout-7j9-card-name-43j" placeholder="Evil Rabbit" required />\n              </Field>\n              <Field>\n                <FieldLabel htmlFor="checkout-7j9-card-number-uw1">Card Number</FieldLabel>\n                <Input\n                  id="checkout-7j9-card-number-uw1"\n                  placeholder="1234 5678 9012 3456"\n                  required\n                />\n                <FieldDescription>Enter your 16-digit card number</FieldDescription>\n              </Field>\n              <div className="grid grid-cols-3 gap-4">\n                <Field>\n                  <FieldLabel htmlFor="checkout-exp-month-ts6">Month</FieldLabel>\n                  <Select defaultValue="">\n                    <SelectTrigger id="checkout-exp-month-ts6">\n                      <SelectValue placeholder="MM" />\n                    </SelectTrigger>\n                    <SelectContent>\n                      <SelectItem value="01">01</SelectItem>\n                      <SelectItem value="02">02</SelectItem>\n                      <SelectItem value="03">03</SelectItem>\n                      <SelectItem value="04">04</SelectItem>\n                      <SelectItem value="05">05</SelectItem>\n                      <SelectItem value="06">06</SelectItem>\n                      <SelectItem value="07">07</SelectItem>\n                      <SelectItem value="08">08</SelectItem>\n                      <SelectItem value="09">09</SelectItem>\n                      <SelectItem value="10">10</SelectItem>\n                      <SelectItem value="11">11</SelectItem>\n                      <SelectItem value="12">12</SelectItem>\n                    </SelectContent>\n                  </Select>\n                </Field>\n                <Field>\n                  <FieldLabel htmlFor="checkout-7j9-exp-year-f59">Year</FieldLabel>\n                  <Select defaultValue="">\n                    <SelectTrigger id="checkout-7j9-exp-year-f59">\n                      <SelectValue placeholder="YYYY" />\n                    </SelectTrigger>\n                    <SelectContent>\n                      <SelectItem value="2024">2024</SelectItem>\n                      <SelectItem value="2025">2025</SelectItem>\n                      <SelectItem value="2026">2026</SelectItem>\n                      <SelectItem value="2027">2027</SelectItem>\n                      <SelectItem value="2028">2028</SelectItem>\n                      <SelectItem value="2029">2029</SelectItem>\n                    </SelectContent>\n                  </Select>\n                </Field>\n                <Field>\n                  <FieldLabel htmlFor="checkout-7j9-cvv">CVV</FieldLabel>\n                  <Input id="checkout-7j9-cvv" placeholder="123" required />\n                </Field>\n              </div>\n            </FieldGroup>\n          </FieldSet>\n          <FieldSeparator />\n          <FieldSet>\n            <FieldLegend>Billing Address</FieldLegend>\n            <FieldDescription>\n              The billing address associated with your payment method\n            </FieldDescription>\n            <FieldGroup>\n              <Field orientation="horizontal">\n                <Checkbox id="checkout-7j9-same-as-shipping-wgm" defaultChecked />\n                <FieldLabel htmlFor="checkout-7j9-same-as-shipping-wgm" className="font-normal">\n                  Same as shipping address\n                </FieldLabel>\n              </Field>\n            </FieldGroup>\n          </FieldSet>\n          <FieldSet>\n            <FieldGroup>\n              <Field>\n                <FieldLabel htmlFor="checkout-7j9-optional-comments">Comments</FieldLabel>\n                <Textarea\n                  id="checkout-7j9-optional-comments"\n                  placeholder="Add any additional comments"\n                  className="resize-none"\n                />\n              </Field>\n            </FieldGroup>\n          </FieldSet>\n          <Field orientation="horizontal">\n            <Button type="submit">Submit</Button>\n            <Button variant="outline" type="button">\n              Cancel\n            </Button>\n          </Field>\n        </FieldGroup>\n      </form>\n    </div>\n  );\n}\n',
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
      source: {
        code: 'import {\n  Field,\n  FieldDescription,\n  FieldGroup,\n  FieldLabel,\n  FieldSet,\n} from "@erbium/ui/components/field"\nimport { Input } from "@erbium/ui/components/input"\n\nexport default function FieldInput() {\n  return (\n    <div className="w-full max-w-md">\n      <FieldSet>\n        <FieldGroup>\n          <Field>\n            <FieldLabel htmlFor="username">Username</FieldLabel>\n            <Input id="username" type="text" placeholder="Max Leiter" />\n            <FieldDescription>\n              Choose a unique username for your account.\n            </FieldDescription>\n          </Field>\n          <Field>\n            <FieldLabel htmlFor="password">Password</FieldLabel>\n            <FieldDescription>\n              Must be at least 8 characters long.\n            </FieldDescription>\n            <Input id="password" type="password" placeholder="••••••••" />\n          </Field>\n        </FieldGroup>\n      </FieldSet>\n    </div>\n  )\n}\n',
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
      source: {
        code: 'import {\n  Field,\n  FieldDescription,\n  FieldGroup,\n  FieldLabel,\n  FieldSet,\n} from "@erbium/ui/components/field"\nimport { Textarea } from "@erbium/ui/components/textarea"\n\nexport default function FieldTextarea() {\n  return (\n    <div className="w-full max-w-md">\n      <FieldSet>\n        <FieldGroup>\n          <Field>\n            <FieldLabel htmlFor="feedback">Feedback</FieldLabel>\n            <Textarea\n              id="feedback"\n              placeholder="Your feedback helps us improve..."\n              rows={4}\n            />\n            <FieldDescription>\n              Share your thoughts about our service.\n            </FieldDescription>\n          </Field>\n        </FieldGroup>\n      </FieldSet>\n    </div>\n  )\n}\n',
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
      source: {
        code: '\nimport { useState } from "react"\n\nimport {\n  Field,\n  FieldDescription,\n  FieldTitle,\n} from "@erbium/ui/components/field"\nimport { Slider } from "@erbium/ui/components/slider"\n\nexport default function FieldSlider() {\n  const [value, setValue] = useState([200, 800])\n  return (\n    <div className="w-full max-w-md">\n      <Field>\n        <FieldTitle>Price Range</FieldTitle>\n        <FieldDescription>\n          Set your budget range ($\n          <span className="font-medium tabular-nums">{value[0]}</span> -{" "}\n          <span className="font-medium tabular-nums">{value[1]}</span>).\n        </FieldDescription>\n        <Slider\n          value={value}\n          onValueChange={setValue}\n          max={1000}\n          min={0}\n          step={10}\n          className="mt-2 w-full"\n          aria-label="Price Range"\n        />\n      </Field>\n    </div>\n  )\n}\n',
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
      source: {
        code: 'import {\n  Field,\n  FieldDescription,\n  FieldGroup,\n  FieldLabel,\n  FieldLegend,\n  FieldSet,\n} from "@erbium/ui/components/field"\nimport { Input } from "@erbium/ui/components/input"\n\nexport default function FieldFieldset() {\n  return (\n    <div className="w-full max-w-md space-y-6">\n      <FieldSet>\n        <FieldLegend>Address Information</FieldLegend>\n        <FieldDescription>\n          We need your address to deliver your order.\n        </FieldDescription>\n        <FieldGroup>\n          <Field>\n            <FieldLabel htmlFor="street">Street Address</FieldLabel>\n            <Input id="street" type="text" placeholder="123 Main St" />\n          </Field>\n          <div className="grid grid-cols-2 gap-4">\n            <Field>\n              <FieldLabel htmlFor="city">City</FieldLabel>\n              <Input id="city" type="text" placeholder="New York" />\n            </Field>\n            <Field>\n              <FieldLabel htmlFor="zip">Postal Code</FieldLabel>\n              <Input id="zip" type="text" placeholder="90502" />\n            </Field>\n          </div>\n        </FieldGroup>\n      </FieldSet>\n    </div>\n  )\n}\n',
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
      source: {
        code: 'import { Checkbox } from "@erbium/ui/components/checkbox"\nimport {\n  Field,\n  FieldContent,\n  FieldDescription,\n  FieldGroup,\n  FieldLabel,\n  FieldLegend,\n  FieldSeparator,\n  FieldSet,\n} from "@erbium/ui/components/field"\n\nexport default function FieldCheckbox() {\n  return (\n    <div className="w-full max-w-md">\n      <FieldGroup>\n        <FieldSet>\n          <FieldLegend variant="label">\n            Show these items on the desktop\n          </FieldLegend>\n          <FieldDescription>\n            Select the items you want to show on the desktop.\n          </FieldDescription>\n          <FieldGroup className="gap-3">\n            <Field orientation="horizontal">\n              <Checkbox id="finder-pref-9k2-hard-disks-ljj" />\n              <FieldLabel\n                htmlFor="finder-pref-9k2-hard-disks-ljj"\n                className="font-normal"\n                defaultChecked\n              >\n                Hard disks\n              </FieldLabel>\n            </Field>\n            <Field orientation="horizontal">\n              <Checkbox id="finder-pref-9k2-external-disks-1yg" />\n              <FieldLabel\n                htmlFor="finder-pref-9k2-external-disks-1yg"\n                className="font-normal"\n              >\n                External disks\n              </FieldLabel>\n            </Field>\n            <Field orientation="horizontal">\n              <Checkbox id="finder-pref-9k2-cds-dvds-fzt" />\n              <FieldLabel\n                htmlFor="finder-pref-9k2-cds-dvds-fzt"\n                className="font-normal"\n              >\n                CDs, DVDs, and iPods\n              </FieldLabel>\n            </Field>\n            <Field orientation="horizontal">\n              <Checkbox id="finder-pref-9k2-connected-servers-6l2" />\n              <FieldLabel\n                htmlFor="finder-pref-9k2-connected-servers-6l2"\n                className="font-normal"\n              >\n                Connected servers\n              </FieldLabel>\n            </Field>\n          </FieldGroup>\n        </FieldSet>\n        <FieldSeparator />\n        <Field orientation="horizontal">\n          <Checkbox id="finder-pref-9k2-sync-folders-nep" defaultChecked />\n          <FieldContent>\n            <FieldLabel htmlFor="finder-pref-9k2-sync-folders-nep">\n              Sync Desktop & Documents folders\n            </FieldLabel>\n            <FieldDescription>\n              Your Desktop & Documents folders are being synced with iCloud\n              Drive. You can access them from other devices.\n            </FieldDescription>\n          </FieldContent>\n        </Field>\n      </FieldGroup>\n    </div>\n  )\n}\n',
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
      source: {
        code: 'import {\n  Field,\n  FieldDescription,\n  FieldLabel,\n  FieldSet,\n} from "@erbium/ui/components/field"\nimport {\n  RadioGroup,\n  RadioGroupItem,\n} from "@erbium/ui/components/radio-group"\n\nexport default function FieldRadio() {\n  return (\n    <div className="w-full max-w-md">\n      <FieldSet>\n        <FieldLabel>Subscription Plan</FieldLabel>\n        <FieldDescription>\n          Yearly and lifetime plans offer significant savings.\n        </FieldDescription>\n        <RadioGroup defaultValue="monthly">\n          <Field orientation="horizontal">\n            <RadioGroupItem value="monthly" id="plan-monthly" />\n            <FieldLabel htmlFor="plan-monthly" className="font-normal">\n              Monthly ($9.99/month)\n            </FieldLabel>\n          </Field>\n          <Field orientation="horizontal">\n            <RadioGroupItem value="yearly" id="plan-yearly" />\n            <FieldLabel htmlFor="plan-yearly" className="font-normal">\n              Yearly ($99.99/year)\n            </FieldLabel>\n          </Field>\n          <Field orientation="horizontal">\n            <RadioGroupItem value="lifetime" id="plan-lifetime" />\n            <FieldLabel htmlFor="plan-lifetime" className="font-normal">\n              Lifetime ($299.99)\n            </FieldLabel>\n          </Field>\n        </RadioGroup>\n      </FieldSet>\n    </div>\n  )\n}\n',
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
      source: {
        code: 'import {\n  Field,\n  FieldContent,\n  FieldDescription,\n  FieldLabel,\n} from "@erbium/ui/components/field"\nimport { Switch } from "@erbium/ui/components/switch"\n\nexport default function FieldSwitch() {\n  return (\n    <div className="w-full max-w-md">\n      <Field orientation="horizontal">\n        <FieldContent>\n          <FieldLabel htmlFor="2fa">Multi-factor authentication</FieldLabel>\n          <FieldDescription>\n            Enable multi-factor authentication. If you do not have a two-factor\n            device, you can use a one-time code sent to your email.\n          </FieldDescription>\n        </FieldContent>\n        <Switch id="2fa" />\n      </Field>\n    </div>\n  )\n}\n',
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
      source: {
        code: 'import {\n  Field,\n  FieldContent,\n  FieldDescription,\n  FieldGroup,\n  FieldLabel,\n  FieldSet,\n  FieldTitle,\n} from "@erbium/ui/components/field"\nimport {\n  RadioGroup,\n  RadioGroupItem,\n} from "@erbium/ui/components/radio-group"\n\nexport default function FieldChoiceCard() {\n  return (\n    <div className="w-full max-w-md">\n      <FieldGroup>\n        <FieldSet>\n          <FieldLabel htmlFor="compute-environment-p8w">\n            Compute Environment\n          </FieldLabel>\n          <FieldDescription>\n            Select the compute environment for your cluster.\n          </FieldDescription>\n          <RadioGroup defaultValue="kubernetes">\n            <FieldLabel htmlFor="kubernetes-r2h">\n              <Field orientation="horizontal">\n                <FieldContent>\n                  <FieldTitle>Kubernetes</FieldTitle>\n                  <FieldDescription>\n                    Run GPU workloads on a K8s configured cluster.\n                  </FieldDescription>\n                </FieldContent>\n                <RadioGroupItem value="kubernetes" id="kubernetes-r2h" />\n              </Field>\n            </FieldLabel>\n            <FieldLabel htmlFor="vm-z4k">\n              <Field orientation="horizontal">\n                <FieldContent>\n                  <FieldTitle>Virtual Machine</FieldTitle>\n                  <FieldDescription>\n                    Access a VM configured cluster to run GPU workloads.\n                  </FieldDescription>\n                </FieldContent>\n                <RadioGroupItem value="vm" id="vm-z4k" />\n              </Field>\n            </FieldLabel>\n          </RadioGroup>\n        </FieldSet>\n      </FieldGroup>\n    </div>\n  )\n}\n',
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
      source: {
        code: 'import { Checkbox } from "@erbium/ui/components/checkbox"\nimport {\n  Field,\n  FieldDescription,\n  FieldGroup,\n  FieldLabel,\n  FieldSeparator,\n  FieldSet,\n} from "@erbium/ui/components/field"\n\nexport default function FieldGroupExample() {\n  return (\n    <div className="w-full max-w-md">\n      <FieldGroup>\n        <FieldSet>\n          <FieldLabel>Responses</FieldLabel>\n          <FieldDescription>\n            Get notified when ChatGPT responds to requests that take time, like\n            research or image generation.\n          </FieldDescription>\n          <FieldGroup data-slot="checkbox-group">\n            <Field orientation="horizontal">\n              <Checkbox id="push" defaultChecked disabled />\n              <FieldLabel htmlFor="push" className="font-normal">\n                Push notifications\n              </FieldLabel>\n            </Field>\n          </FieldGroup>\n        </FieldSet>\n        <FieldSeparator />\n        <FieldSet>\n          <FieldLabel>Tasks</FieldLabel>\n          <FieldDescription>\n            Get notified when tasks you&apos;ve created have updates.{" "}\n            <a href="#">Manage tasks</a>\n          </FieldDescription>\n          <FieldGroup data-slot="checkbox-group">\n            <Field orientation="horizontal">\n              <Checkbox id="push-tasks" />\n              <FieldLabel htmlFor="push-tasks" className="font-normal">\n                Push notifications\n              </FieldLabel>\n            </Field>\n            <Field orientation="horizontal">\n              <Checkbox id="email-tasks" />\n              <FieldLabel htmlFor="email-tasks" className="font-normal">\n                Email notifications\n              </FieldLabel>\n            </Field>\n          </FieldGroup>\n        </FieldSet>\n      </FieldGroup>\n    </div>\n  )\n}\n',
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
      source: {
        code: 'import { Button } from "@erbium/ui/components/button"\nimport {\n  Field,\n  FieldContent,\n  FieldDescription,\n  FieldGroup,\n  FieldLabel,\n  FieldLegend,\n  FieldSeparator,\n  FieldSet,\n} from "@erbium/ui/components/field"\nimport { Input } from "@erbium/ui/components/input"\nimport { Textarea } from "@erbium/ui/components/textarea"\n\nexport default function FieldResponsive() {\n  return (\n    <div className="w-full max-w-4xl">\n      <form>\n        <FieldSet>\n          <FieldLegend>Profile</FieldLegend>\n          <FieldDescription>Fill in your profile information.</FieldDescription>\n          <FieldSeparator />\n          <FieldGroup>\n            <Field orientation="responsive">\n              <FieldContent>\n                <FieldLabel htmlFor="name">Name</FieldLabel>\n                <FieldDescription>\n                  Provide your full name for identification\n                </FieldDescription>\n              </FieldContent>\n              <Input id="name" placeholder="Evil Rabbit" required />\n            </Field>\n            <FieldSeparator />\n            <Field orientation="responsive">\n              <FieldContent>\n                <FieldLabel htmlFor="lastName">Message</FieldLabel>\n                <FieldDescription>\n                  You can write your message here. Keep it short, preferably\n                  under 100 characters.\n                </FieldDescription>\n              </FieldContent>\n              <Textarea\n                id="message"\n                placeholder="Hello, world!"\n                required\n                className="min-h-[100px] resize-none sm:min-w-[300px]"\n              />\n            </Field>\n            <FieldSeparator />\n            <Field orientation="responsive">\n              <Button type="submit">Submit</Button>\n              <Button type="button" variant="outline">\n                Cancel\n              </Button>\n            </Field>\n          </FieldGroup>\n        </FieldSet>\n      </form>\n    </div>\n  )\n}\n',
      },
    },
  },
  render: () => (
    <div className="w-full min-w-72 max-w-2xl p-4">
      <ExampleFieldResponsive />
    </div>
  ),
};
