import { Input } from "@erbium/ui/components/input";
import FieldDemo from "../examples/upstream/field-demo";
import ExampleFieldDemo from "../examples/field-demo";
import type { Meta, StoryObj } from "@storybook/tanstack-react";
import { Label } from "@erbium/ui/components/label";
import Demo from "../examples/label-demo";

const meta = {
  title: "UI/Label",
  component: Label,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          'Renders an accessible label associated with controls.\n\n**Import:** `@erbium/ui/components/label`  \n\n**shadcn/ui page:** [Label](https://ui.shadcn.com/docs/components/base/label)\n\n### Usage\n\n```tsx\nimport { Label } from "@erbium/ui/components/label"\n```\n\n```tsx\n<Label htmlFor="email">Your email address</Label>\n```',
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Playground: StoryObj<typeof Label> = {
  args: { children: "Email address", htmlFor: "playground-email", className: "" },
  argTypes: {},
  render: (args) => (
    <div className="grid gap-2">
      <Label {...args} />
      <Input id="playground-email" placeholder="name@example.com" />
    </div>
  ),
};

export const Overview: Story = {
  parameters: {
    docs: {
      source: {
        code: 'import { Checkbox } from "@erbium/ui/components/checkbox";\nimport { Label } from "@erbium/ui/components/label";\n\nexport default function LabelDemo() {\n  return (\n    <div>\n      <div className="flex items-center space-x-2">\n        <Checkbox id="terms" />\n        <Label htmlFor="terms">Accept terms and conditions</Label>\n      </div>\n    </div>\n  );\n}\n',
      },
    },
  },
  render: () => (
    <div className="w-full min-w-72 max-w-2xl p-4">
      <Demo />
    </div>
  ),
};

export const LabelInField: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'For form fields, use the [Field](https://ui.shadcn.com/docs/components/base/field) component which\n\nincludes built-in `FieldLabel`, `FieldDescription`, and `FieldError` components.\n\n```tsx\n<Field>\n  <FieldLabel htmlFor="email">Your email address</FieldLabel>\n  <Input id="email" />\n</Field>\n```',
      },

      source: {
        code: 'import { Button } from "@erbium/ui/components/button"\nimport { Checkbox } from "@erbium/ui/components/checkbox"\nimport {\n  Field,\n  FieldDescription,\n  FieldGroup,\n  FieldLabel,\n  FieldLegend,\n  FieldSeparator,\n  FieldSet,\n} from "@erbium/ui/components/field"\nimport { Input } from "@erbium/ui/components/input"\nimport {\n  Select,\n  SelectContent,\n  SelectItem,\n  SelectTrigger,\n  SelectValue,\n} from "@erbium/ui/components/select"\nimport { Textarea } from "@erbium/ui/components/textarea"\n\nexport default function FieldDemo() {\n  return (\n    <div className="w-full max-w-md">\n      <form>\n        <FieldGroup>\n          <FieldSet>\n            <FieldLegend>Payment Method</FieldLegend>\n            <FieldDescription>\n              All transactions are secure and encrypted\n            </FieldDescription>\n            <FieldGroup>\n              <Field>\n                <FieldLabel htmlFor="checkout-7j9-card-name-43j">\n                  Name on Card\n                </FieldLabel>\n                <Input\n                  id="checkout-7j9-card-name-43j"\n                  placeholder="Evil Rabbit"\n                  required\n                />\n              </Field>\n              <Field>\n                <FieldLabel htmlFor="checkout-7j9-card-number-uw1">\n                  Card Number\n                </FieldLabel>\n                <Input\n                  id="checkout-7j9-card-number-uw1"\n                  placeholder="1234 5678 9012 3456"\n                  required\n                />\n                <FieldDescription>\n                  Enter your 16-digit card number\n                </FieldDescription>\n              </Field>\n              <div className="grid grid-cols-3 gap-4">\n                <Field>\n                  <FieldLabel htmlFor="checkout-exp-month-ts6">\n                    Month\n                  </FieldLabel>\n                  <Select defaultValue="">\n                    <SelectTrigger id="checkout-exp-month-ts6">\n                      <SelectValue placeholder="MM" />\n                    </SelectTrigger>\n                    <SelectContent>\n                      <SelectItem value="01">01</SelectItem>\n                      <SelectItem value="02">02</SelectItem>\n                      <SelectItem value="03">03</SelectItem>\n                      <SelectItem value="04">04</SelectItem>\n                      <SelectItem value="05">05</SelectItem>\n                      <SelectItem value="06">06</SelectItem>\n                      <SelectItem value="07">07</SelectItem>\n                      <SelectItem value="08">08</SelectItem>\n                      <SelectItem value="09">09</SelectItem>\n                      <SelectItem value="10">10</SelectItem>\n                      <SelectItem value="11">11</SelectItem>\n                      <SelectItem value="12">12</SelectItem>\n                    </SelectContent>\n                  </Select>\n                </Field>\n                <Field>\n                  <FieldLabel htmlFor="checkout-7j9-exp-year-f59">\n                    Year\n                  </FieldLabel>\n                  <Select defaultValue="">\n                    <SelectTrigger id="checkout-7j9-exp-year-f59">\n                      <SelectValue placeholder="YYYY" />\n                    </SelectTrigger>\n                    <SelectContent>\n                      <SelectItem value="2024">2024</SelectItem>\n                      <SelectItem value="2025">2025</SelectItem>\n                      <SelectItem value="2026">2026</SelectItem>\n                      <SelectItem value="2027">2027</SelectItem>\n                      <SelectItem value="2028">2028</SelectItem>\n                      <SelectItem value="2029">2029</SelectItem>\n                    </SelectContent>\n                  </Select>\n                </Field>\n                <Field>\n                  <FieldLabel htmlFor="checkout-7j9-cvv">CVV</FieldLabel>\n                  <Input id="checkout-7j9-cvv" placeholder="123" required />\n                </Field>\n              </div>\n            </FieldGroup>\n          </FieldSet>\n          <FieldSeparator />\n          <FieldSet>\n            <FieldLegend>Billing Address</FieldLegend>\n            <FieldDescription>\n              The billing address associated with your payment method\n            </FieldDescription>\n            <FieldGroup>\n              <Field orientation="horizontal">\n                <Checkbox\n                  id="checkout-7j9-same-as-shipping-wgm"\n                  defaultChecked\n                />\n                <FieldLabel\n                  htmlFor="checkout-7j9-same-as-shipping-wgm"\n                  className="font-normal"\n                >\n                  Same as shipping address\n                </FieldLabel>\n              </Field>\n            </FieldGroup>\n          </FieldSet>\n          <FieldSet>\n            <FieldGroup>\n              <Field>\n                <FieldLabel htmlFor="checkout-7j9-optional-comments">\n                  Comments\n                </FieldLabel>\n                <Textarea\n                  id="checkout-7j9-optional-comments"\n                  placeholder="Add any additional comments"\n                  className="resize-none"\n                />\n              </Field>\n            </FieldGroup>\n          </FieldSet>\n          <Field orientation="horizontal">\n            <Button type="submit">Submit</Button>\n            <Button variant="outline" type="button">\n              Cancel\n            </Button>\n          </Field>\n        </FieldGroup>\n      </form>\n    </div>\n  )\n}\n',
      },
    },
  },
  render: () => (
    <div className="w-full min-w-72 max-w-2xl p-4">
      <ExampleFieldDemo />
    </div>
  ),
};

export const FieldExample: Story = {
  parameters: {
    docs: {
      description: { story: "Pair a label with a form field." },
      source: {
        code: 'import { Button } from "@erbium/ui/components/button";\nimport { Checkbox } from "@erbium/ui/components/checkbox";\nimport {\n  Field,\n  FieldDescription,\n  FieldGroup,\n  FieldLabel,\n  FieldLegend,\n  FieldSeparator,\n  FieldSet,\n} from "@erbium/ui/components/field";\nimport { Input } from "@erbium/ui/components/input";\nimport {\n  Select,\n  SelectContent,\n  SelectGroup,\n  SelectItem,\n  SelectTrigger,\n  SelectValue,\n} from "@erbium/ui/components/select";\nimport { Textarea } from "@erbium/ui/components/textarea";\n\nconst months = [\n  { label: "MM", value: null },\n  { label: "01", value: "01" },\n  { label: "02", value: "02" },\n  { label: "03", value: "03" },\n  { label: "04", value: "04" },\n  { label: "05", value: "05" },\n  { label: "06", value: "06" },\n  { label: "07", value: "07" },\n  { label: "08", value: "08" },\n  { label: "09", value: "09" },\n  { label: "10", value: "10" },\n  { label: "11", value: "11" },\n  { label: "12", value: "12" },\n];\n\nconst years = [\n  { label: "YYYY", value: null },\n  { label: "2024", value: "2024" },\n  { label: "2025", value: "2025" },\n  { label: "2026", value: "2026" },\n  { label: "2027", value: "2027" },\n  { label: "2028", value: "2028" },\n  { label: "2029", value: "2029" },\n];\n\nexport default function FieldDemo() {\n  return (\n    <div className="w-full max-w-md">\n      <form>\n        <FieldGroup>\n          <FieldSet>\n            <FieldLegend>Payment Method</FieldLegend>\n            <FieldDescription>All transactions are secure and encrypted</FieldDescription>\n            <FieldGroup>\n              <Field>\n                <FieldLabel htmlFor="checkout-7j9-card-name-43j">Name on Card</FieldLabel>\n                <Input id="checkout-7j9-card-name-43j" placeholder="Evil Rabbit" required />\n              </Field>\n              <Field>\n                <FieldLabel htmlFor="checkout-7j9-card-number-uw1">Card Number</FieldLabel>\n                <Input\n                  id="checkout-7j9-card-number-uw1"\n                  placeholder="1234 5678 9012 3456"\n                  required\n                />\n                <FieldDescription>Enter your 16-digit card number</FieldDescription>\n              </Field>\n              <div className="grid grid-cols-3 gap-4">\n                <Field>\n                  <FieldLabel htmlFor="checkout-exp-month-ts6">Month</FieldLabel>\n                  <Select items={months}>\n                    <SelectTrigger id="checkout-exp-month-ts6">\n                      <SelectValue />\n                    </SelectTrigger>\n                    <SelectContent>\n                      <SelectGroup>\n                        {months.map((item) => (\n                          <SelectItem key={item.value} value={item.value}>\n                            {item.label}\n                          </SelectItem>\n                        ))}\n                      </SelectGroup>\n                    </SelectContent>\n                  </Select>\n                </Field>\n                <Field>\n                  <FieldLabel htmlFor="checkout-7j9-exp-year-f59">Year</FieldLabel>\n                  <Select items={years}>\n                    <SelectTrigger id="checkout-7j9-exp-year-f59">\n                      <SelectValue />\n                    </SelectTrigger>\n                    <SelectContent>\n                      <SelectGroup>\n                        {years.map((item) => (\n                          <SelectItem key={item.value} value={item.value}>\n                            {item.label}\n                          </SelectItem>\n                        ))}\n                      </SelectGroup>\n                    </SelectContent>\n                  </Select>\n                </Field>\n                <Field>\n                  <FieldLabel htmlFor="checkout-7j9-cvv">CVV</FieldLabel>\n                  <Input id="checkout-7j9-cvv" placeholder="123" required />\n                </Field>\n              </div>\n            </FieldGroup>\n          </FieldSet>\n          <FieldSeparator />\n          <FieldSet>\n            <FieldLegend>Billing Address</FieldLegend>\n            <FieldDescription>\n              The billing address associated with your payment method\n            </FieldDescription>\n            <FieldGroup>\n              <Field orientation="horizontal">\n                <Checkbox id="checkout-7j9-same-as-shipping-wgm" defaultChecked />\n                <FieldLabel htmlFor="checkout-7j9-same-as-shipping-wgm" className="font-normal">\n                  Same as shipping address\n                </FieldLabel>\n              </Field>\n            </FieldGroup>\n          </FieldSet>\n          <FieldSet>\n            <FieldGroup>\n              <Field>\n                <FieldLabel htmlFor="checkout-7j9-optional-comments">Comments</FieldLabel>\n                <Textarea\n                  id="checkout-7j9-optional-comments"\n                  placeholder="Add any additional comments"\n                  className="resize-none"\n                />\n              </Field>\n            </FieldGroup>\n          </FieldSet>\n          <Field orientation="horizontal">\n            <Button type="submit">Submit</Button>\n            <Button variant="outline" type="button">\n              Cancel\n            </Button>\n          </Field>\n        </FieldGroup>\n      </form>\n    </div>\n  );\n}\n',
      },
    },
  },
  render: () => <FieldDemo />,
};
