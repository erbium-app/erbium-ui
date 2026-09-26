import {
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@erbium/ui/components/select";
import { SelectAlignItem } from "../examples/upstream/select-align-item";
import { SelectGroups } from "../examples/upstream/select-groups";
import { SelectDisabled } from "../examples/upstream/select-disabled";
import { SelectInvalid } from "../examples/upstream/select-invalid";
import ExampleSelectScrollable from "../examples/select-scrollable";
import type { Meta, StoryObj } from "@storybook/tanstack-react";
import { Select } from "@erbium/ui/components/select";
import Demo from "../examples/select-demo";

const meta = {
  title: "UI/Select",
  component: Select,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          'Displays a list of options for the user to pick from—triggered by a button.\n\n**Import:** `@erbium/ui/components/select`  \n\n**shadcn/ui page:** [Select](https://ui.shadcn.com/docs/components/base/select)\n\n### Usage\n\n```tsx\nimport {\n  Select,\n  SelectContent,\n  SelectGroup,\n  SelectItem,\n  SelectTrigger,\n  SelectValue,\n} from "@erbium/ui/components/select"\n```\n\n```tsx\nconst items = [\n  { label: "Light", value: "light" },\n  { label: "Dark", value: "dark" },\n  { label: "System", value: "system" },\n]\n\n<Select items={items}>\n  <SelectTrigger className="w-[180px]">\n    <SelectValue placeholder="Theme" />\n  </SelectTrigger>\n  <SelectContent>\n    <SelectGroup>\n      {items.map((item) => (\n        <SelectItem key={item.value} value={item.value}>\n          {item.label}\n        </SelectItem>\n      ))}\n    </SelectGroup>\n  </SelectContent>\n</Select>\n```\n\n### Composition\n\nUse the following composition to build a `Select`:\n\n```text\nSelect\n├── SelectTrigger\n│   └── SelectValue\n└── SelectContent\n    ├── SelectGroup\n    │   ├── SelectLabel\n    │   ├── SelectItem\n    │   └── SelectItem\n    ├── SelectSeparator\n    └── SelectGroup\n        ├── SelectLabel\n        ├── SelectItem\n        └── SelectItem\n```',
      },
    },
  },
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj;

export const Playground: StoryObj<{
  size: "default" | "sm";
  disabled: boolean;
  placeholder: string;
  side: "top" | "right" | "bottom" | "left";
  align: "start" | "center" | "end";
}> = {
  args: {
    size: "default",
    disabled: false,
    placeholder: "Select a fruit",
    side: "bottom",
    align: "start",
  },
  argTypes: {
    size: { control: "select", options: ["default", "sm"] },
    disabled: { control: "boolean" },
    placeholder: { control: "text" },
    side: { control: "select", options: ["top", "right", "bottom", "left"] },
    align: { control: "select", options: ["start", "center", "end"] },
  },
  render: (args) => (
    <Select>
      <SelectTrigger size={args.size} disabled={args.disabled} className="w-48">
        <SelectValue placeholder={args.placeholder} />
      </SelectTrigger>
      <SelectContent side={args.side} align={args.align}>
        <SelectItem value="apple">Apple</SelectItem>
        <SelectItem value="banana">Banana</SelectItem>
      </SelectContent>
    </Select>
  ),
};

export const Overview: Story = {
  parameters: {
    docs: {
      source: {
        code: 'import * as React from "react";\n\nimport {\n  Select,\n  SelectContent,\n  SelectGroup,\n  SelectItem,\n  SelectLabel,\n  SelectTrigger,\n  SelectValue,\n} from "@erbium/ui/components/select";\n\nexport default function SelectDemo() {\n  return (\n    <Select>\n      <SelectTrigger className="w-[180px]">\n        <SelectValue placeholder="Select a fruit" />\n      </SelectTrigger>\n      <SelectContent>\n        <SelectGroup>\n          <SelectLabel>Fruits</SelectLabel>\n          <SelectItem value="apple">Apple</SelectItem>\n          <SelectItem value="banana">Banana</SelectItem>\n          <SelectItem value="blueberry">Blueberry</SelectItem>\n          <SelectItem value="grapes">Grapes</SelectItem>\n          <SelectItem value="pineapple">Pineapple</SelectItem>\n        </SelectGroup>\n      </SelectContent>\n    </Select>\n  );\n}\n',
      },
    },
  },
  render: () => (
    <div className="w-full min-w-72 max-w-2xl p-4">
      <Demo />
    </div>
  ),
};

export const Scrollable: Story = {
  parameters: {
    docs: {
      description: { story: "A select with many items that scrolls." },

      source: {
        code: 'import * as React from "react"\n\nimport {\n  Select,\n  SelectContent,\n  SelectGroup,\n  SelectItem,\n  SelectLabel,\n  SelectTrigger,\n  SelectValue,\n} from "@erbium/ui/components/select"\n\nexport default function SelectScrollable() {\n  return (\n    <Select>\n      <SelectTrigger className="w-[280px]">\n        <SelectValue placeholder="Select a timezone" />\n      </SelectTrigger>\n      <SelectContent>\n        <SelectGroup>\n          <SelectLabel>North America</SelectLabel>\n          <SelectItem value="est">Eastern Standard Time (EST)</SelectItem>\n          <SelectItem value="cst">Central Standard Time (CST)</SelectItem>\n          <SelectItem value="mst">Mountain Standard Time (MST)</SelectItem>\n          <SelectItem value="pst">Pacific Standard Time (PST)</SelectItem>\n          <SelectItem value="akst">Alaska Standard Time (AKST)</SelectItem>\n          <SelectItem value="hst">Hawaii Standard Time (HST)</SelectItem>\n        </SelectGroup>\n        <SelectGroup>\n          <SelectLabel>Europe & Africa</SelectLabel>\n          <SelectItem value="gmt">Greenwich Mean Time (GMT)</SelectItem>\n          <SelectItem value="cet">Central European Time (CET)</SelectItem>\n          <SelectItem value="eet">Eastern European Time (EET)</SelectItem>\n          <SelectItem value="west">\n            Western European Summer Time (WEST)\n          </SelectItem>\n          <SelectItem value="cat">Central Africa Time (CAT)</SelectItem>\n          <SelectItem value="eat">East Africa Time (EAT)</SelectItem>\n        </SelectGroup>\n        <SelectGroup>\n          <SelectLabel>Asia</SelectLabel>\n          <SelectItem value="msk">Moscow Time (MSK)</SelectItem>\n          <SelectItem value="ist">India Standard Time (IST)</SelectItem>\n          <SelectItem value="cst_china">China Standard Time (CST)</SelectItem>\n          <SelectItem value="jst">Japan Standard Time (JST)</SelectItem>\n          <SelectItem value="kst">Korea Standard Time (KST)</SelectItem>\n          <SelectItem value="ist_indonesia">\n            Indonesia Central Standard Time (WITA)\n          </SelectItem>\n        </SelectGroup>\n        <SelectGroup>\n          <SelectLabel>Australia & Pacific</SelectLabel>\n          <SelectItem value="awst">\n            Australian Western Standard Time (AWST)\n          </SelectItem>\n          <SelectItem value="acst">\n            Australian Central Standard Time (ACST)\n          </SelectItem>\n          <SelectItem value="aest">\n            Australian Eastern Standard Time (AEST)\n          </SelectItem>\n          <SelectItem value="nzst">New Zealand Standard Time (NZST)</SelectItem>\n          <SelectItem value="fjt">Fiji Time (FJT)</SelectItem>\n        </SelectGroup>\n        <SelectGroup>\n          <SelectLabel>South America</SelectLabel>\n          <SelectItem value="art">Argentina Time (ART)</SelectItem>\n          <SelectItem value="bot">Bolivia Time (BOT)</SelectItem>\n          <SelectItem value="brt">Brasilia Time (BRT)</SelectItem>\n          <SelectItem value="clt">Chile Standard Time (CLT)</SelectItem>\n        </SelectGroup>\n      </SelectContent>\n    </Select>\n  )\n}\n',
      },
    },
  },
  render: () => (
    <div className="w-full min-w-72 max-w-2xl p-4">
      <ExampleSelectScrollable />
    </div>
  ),
};

export const Groups: Story = {
  parameters: {
    docs: {
      description: {
        story: "Use `SelectGroup`, `SelectLabel`, and `SelectSeparator` to organize items.",
      },
      source: {
        code: 'import {\n  Select,\n  SelectContent,\n  SelectGroup,\n  SelectItem,\n  SelectLabel,\n  SelectSeparator,\n  SelectTrigger,\n  SelectValue,\n} from "@erbium/ui/components/select";\n\nexport function SelectGroups() {\n  const fruits = [\n    { label: "Apple", value: "apple" },\n    { label: "Banana", value: "banana" },\n    { label: "Blueberry", value: "blueberry" },\n  ];\n  const vegetables = [\n    { label: "Carrot", value: "carrot" },\n    { label: "Broccoli", value: "broccoli" },\n    { label: "Spinach", value: "spinach" },\n  ];\n  const allItems = [{ label: "Select a fruit", value: null }, ...fruits, ...vegetables];\n  return (\n    <Select items={allItems}>\n      <SelectTrigger className="w-full max-w-48">\n        <SelectValue />\n      </SelectTrigger>\n      <SelectContent>\n        <SelectGroup>\n          <SelectLabel>Fruits</SelectLabel>\n          {fruits.map((item) => (\n            <SelectItem key={item.value} value={item.value}>\n              {item.label}\n            </SelectItem>\n          ))}\n        </SelectGroup>\n        <SelectSeparator />\n        <SelectGroup>\n          <SelectLabel>Vegetables</SelectLabel>\n          {vegetables.map((item) => (\n            <SelectItem key={item.value} value={item.value}>\n              {item.label}\n            </SelectItem>\n          ))}\n        </SelectGroup>\n      </SelectContent>\n    </Select>\n  );\n}\n',
      },
    },
  },
  render: () => <SelectGroups />,
};
export const Disabled: Story = {
  parameters: {
    docs: {
      description: { story: "Disable a select when its value cannot be changed." },

      source: {
        code: 'import {\n  Select,\n  SelectContent,\n  SelectGroup,\n  SelectItem,\n  SelectTrigger,\n  SelectValue,\n} from "@erbium/ui/components/select";\n\nexport function SelectDisabled() {\n  const items = [\n    { label: "Select a fruit", value: null },\n    { label: "Apple", value: "apple" },\n    { label: "Banana", value: "banana" },\n    { label: "Blueberry", value: "blueberry" },\n    { label: "Grapes", value: "grapes", disabled: true },\n    { label: "Pineapple", value: "pineapple" },\n  ];\n  return (\n    <Select items={items} disabled>\n      <SelectTrigger className="w-full max-w-48">\n        <SelectValue />\n      </SelectTrigger>\n      <SelectContent>\n        <SelectGroup>\n          {items.map((item) => (\n            <SelectItem key={item.value} value={item.value} disabled={item.disabled}>\n              {item.label}\n            </SelectItem>\n          ))}\n        </SelectGroup>\n      </SelectContent>\n    </Select>\n  );\n}\n',
      },
    },
  },
  render: () => <SelectDisabled />,
};
export const Invalid: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Add the `data-invalid` attribute to the `Field` component and the `aria-invalid` attribute to the `SelectTrigger` component to show an error state.\n\n```tsx\n<Field data-invalid>\n  <FieldLabel>Fruit</FieldLabel>\n  <SelectTrigger aria-invalid>\n    <SelectValue />\n  </SelectTrigger>\n</Field>\n```",
      },
      source: {
        code: 'import { Field, FieldError, FieldLabel } from "@erbium/ui/components/field";\nimport {\n  Select,\n  SelectContent,\n  SelectGroup,\n  SelectItem,\n  SelectTrigger,\n  SelectValue,\n} from "@erbium/ui/components/select";\n\nconst items = [\n  { label: "Select a fruit", value: null },\n  { label: "Apple", value: "apple" },\n  { label: "Banana", value: "banana" },\n  { label: "Blueberry", value: "blueberry" },\n];\n\nexport function SelectInvalid() {\n  return (\n    <Field data-invalid className="w-full max-w-48">\n      <FieldLabel>Fruit</FieldLabel>\n      <Select items={items}>\n        <SelectTrigger aria-invalid>\n          <SelectValue />\n        </SelectTrigger>\n        <SelectContent>\n          <SelectGroup>\n            {items.map((item) => (\n              <SelectItem key={item.value} value={item.value}>\n                {item.label}\n              </SelectItem>\n            ))}\n          </SelectGroup>\n        </SelectContent>\n      </Select>\n      <FieldError>Please select a fruit.</FieldError>\n    </Field>\n  );\n}\n',
      },
    },
  },
  render: () => <SelectInvalid />,
};

export const AlignItemWithTrigger: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Use `alignItemWithTrigger` on `SelectContent` to control whether the selected item aligns with the trigger. When `true` (default), the popup positions so the selected item appears over the trigger. When `false`, the popup aligns to the trigger edge.",
      },
      source: {
        code: 'import * as React from "react";\n\nimport {\n  Field,\n  FieldContent,\n  FieldDescription,\n  FieldGroup,\n  FieldLabel,\n} from "@erbium/ui/components/field";\nimport {\n  Select,\n  SelectContent,\n  SelectGroup,\n  SelectItem,\n  SelectTrigger,\n  SelectValue,\n} from "@erbium/ui/components/select";\nimport { Switch } from "@erbium/ui/components/switch";\n\nconst items = [\n  { label: "Select a fruit", value: null },\n  { label: "Apple", value: "apple" },\n  { label: "Banana", value: "banana" },\n  { label: "Blueberry", value: "blueberry" },\n  { label: "Grapes", value: "grapes" },\n  { label: "Pineapple", value: "pineapple" },\n];\n\nexport function SelectAlignItem() {\n  const [alignItemWithTrigger, setAlignItemWithTrigger] = React.useState(true);\n\n  return (\n    <FieldGroup className="w-full max-w-xs">\n      <Field orientation="horizontal">\n        <FieldContent>\n          <FieldLabel htmlFor="align-item">Align Item</FieldLabel>\n          <FieldDescription>Toggle to align the item with the trigger.</FieldDescription>\n        </FieldContent>\n        <Switch\n          id="align-item"\n          checked={alignItemWithTrigger}\n          onCheckedChange={setAlignItemWithTrigger}\n        />\n      </Field>\n      <Field>\n        <Select items={items} defaultValue="banana">\n          <SelectTrigger>\n            <SelectValue />\n          </SelectTrigger>\n          <SelectContent alignItemWithTrigger={alignItemWithTrigger}>\n            <SelectGroup>\n              {items.map((item) => (\n                <SelectItem key={item.value} value={item.value}>\n                  {item.label}\n                </SelectItem>\n              ))}\n            </SelectGroup>\n          </SelectContent>\n        </Select>\n      </Field>\n    </FieldGroup>\n  );\n}\n',
      },
    },
  },
  render: () => <SelectAlignItem />,
};
