import ExampleSelectScrollable from "./examples/select-scrollable";
import type { Meta, StoryObj } from "@storybook/tanstack-react";
import { Select } from "@erbium/ui/components/select";
import Demo from "./examples/select-demo";

const meta = {
  title: "UI/Select",
  component: Select,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          'Displays a list of options for the user to pick from—triggered by a button.\n\n**Import:** `@erbium/ui/components/select`  \n\n**shadcn/ui page:** [Select](https://ui.shadcn.com/docs/components/base/select)\n\n### Usage\n\n```tsx\nimport {\n  Select,\n  SelectContent,\n  SelectGroup,\n  SelectItem,\n  SelectTrigger,\n  SelectValue,\n} from "@erbium/ui/components/select"\n```\n\n```tsx\nconst items = [\n  { label: "Light", value: "light" },\n  { label: "Dark", value: "dark" },\n  { label: "System", value: "system" },\n]\n\n<Select items={items}>\n  <SelectTrigger className="w-[180px]">\n    <SelectValue placeholder="Theme" />\n  </SelectTrigger>\n  <SelectContent>\n    <SelectGroup>\n      {items.map((item) => (\n        <SelectItem key={item.value} value={item.value}>\n          {item.label}\n        </SelectItem>\n      ))}\n    </SelectGroup>\n  </SelectContent>\n</Select>\n```\n\n### Composition\n\nUse the following composition to build a `Select`:\n\n```text\nSelect\n├── SelectTrigger\n│   └── SelectValue\n└── SelectContent\n    ├── SelectGroup\n    │   ├── SelectLabel\n    │   ├── SelectItem\n    │   └── SelectItem\n    ├── SelectSeparator\n    └── SelectGroup\n        ├── SelectLabel\n        ├── SelectItem\n        └── SelectItem\n```\n\n### Align Item With Trigger\n\nUse `alignItemWithTrigger` on `SelectContent` to control whether the selected item aligns with the trigger. When `true` (default), the popup positions so the selected item appears over the trigger. When `false`, the popup aligns to the trigger edge.\n\n### Groups\n\nUse `SelectGroup`, `SelectLabel`, and `SelectSeparator` to organize items.\n\n### Scrollable\n\nA select with many items that scrolls.\n\n### Disabled\n\n### Invalid\n\nAdd the `data-invalid` attribute to the `Field` component and the `aria-invalid` attribute to the `SelectTrigger` component to show an error state.\n\n```tsx\n<Field data-invalid>\n  <FieldLabel>Fruit</FieldLabel>\n  <SelectTrigger aria-invalid>\n    <SelectValue />\n  </SelectTrigger>\n</Field>\n```',
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
