import {
  ComboboxInput,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxList,
  ComboboxItem,
} from "@erbium/ui/components/combobox";
import { ComboboxWithClear } from "../examples/upstream/combobox-clear";
import { ComboboxWithCustomItems } from "../examples/upstream/combobox-custom";
import ComboboxBasic from "../examples/upstream/combobox-basic";
import { ComboboxMultiple } from "../examples/upstream/combobox-multiple";
import { ComboboxWithGroupsAndSeparator } from "../examples/upstream/combobox-groups";
import { ComboboxInvalid } from "../examples/upstream/combobox-invalid";
import { ComboboxDisabled } from "../examples/upstream/combobox-disabled";
import { ComboboxAutoHighlight } from "../examples/upstream/combobox-auto-highlight";
import { ComboboxPopup } from "../examples/upstream/combobox-popup";
import { ComboxboxInputGroup } from "../examples/upstream/combobox-input-group";
import type { Meta, StoryObj } from "@storybook/tanstack-react";
import { Combobox } from "@erbium/ui/components/combobox";
import Demo from "../examples/combobox-demo";

const meta = {
  title: "UI/Combobox",
  component: Combobox,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          'Autocomplete input with a list of suggestions.\n\n**Import:** `@erbium/ui/components/combobox`  \n\n**shadcn/ui page:** [Combobox](https://ui.shadcn.com/docs/components/base/combobox)\n\n### Usage\n\n```tsx\nimport {\n  Combobox,\n  ComboboxContent,\n  ComboboxEmpty,\n  ComboboxInput,\n  ComboboxItem,\n  ComboboxList,\n} from "@erbium/ui/components/combobox"\n```\n\n```tsx\nconst frameworks = ["Next.js", "SvelteKit", "Nuxt.js", "Remix", "Astro"]\n\nexport function ExampleCombobox() {\n  return (\n    <Combobox items={frameworks}>\n      <ComboboxInput placeholder="Select a framework" />\n      <ComboboxContent>\n        <ComboboxEmpty>No items found.</ComboboxEmpty>\n        <ComboboxList>\n          {(item) => (\n            <ComboboxItem key={item} value={item}>\n              {item}\n            </ComboboxItem>\n          )}\n        </ComboboxList>\n      </ComboboxContent>\n    </Combobox>\n  )\n}\n```\n\n### Composition\n\nA single-line input and a flat list (see [Basic](#basic)).\n\nMulti-select with `multiple`, chips, and a chips input (see [Multiple](#multiple)).\n\nNested items per group using `ComboboxCollection` inside each `ComboboxGroup`, with a separator between groups (see [Groups](#groups)).\n\n```text\nCombobox\n├── ComboboxInput\n└── ComboboxContent\n    ├── ComboboxEmpty\n    └── ComboboxList\n        ├── ComboboxItem\n        └── ComboboxItem\n```\n\n```text\nCombobox\n├── ComboboxChips\n│   ├── ComboboxValue\n│   │   └── ComboboxChip\n│   └── ComboboxChipsInput\n└── ComboboxContent\n    ├── ComboboxEmpty\n    └── ComboboxList\n        ├── ComboboxItem\n        └── ComboboxItem\n```\n\n```text\nCombobox\n├── ComboboxInput\n└── ComboboxContent\n    ├── ComboboxEmpty\n    └── ComboboxList\n        ├── ComboboxGroup\n        │   ├── ComboboxLabel\n        │   └── ComboboxCollection\n        │       ├── ComboboxItem\n        │       └── ComboboxItem\n        ├── ComboboxSeparator\n        └── ComboboxGroup\n            ├── ComboboxLabel\n            └── ComboboxCollection\n                ├── ComboboxItem\n                └── ComboboxItem\n```',
      },
    },
  },
} satisfies Meta<typeof Combobox>;

export default meta;
type Story = StoryObj;

export const Playground: StoryObj<{
  placeholder: string;
  disabled: boolean;
  showTrigger: boolean;
  showClear: boolean;
  autoHighlight: boolean;
}> = {
  args: {
    placeholder: "Select a framework",
    disabled: false,
    showTrigger: true,
    showClear: false,
    autoHighlight: false,
  },
  argTypes: {
    placeholder: { control: "text" },
    disabled: { control: "boolean" },
    showTrigger: { control: "boolean" },
    showClear: { control: "boolean" },
    autoHighlight: { control: "boolean" },
  },
  render: (args) => (
    <Combobox items={["React", "Vue", "Svelte"]} autoHighlight={args.autoHighlight}>
      <ComboboxInput
        placeholder={args.placeholder}
        disabled={args.disabled}
        showTrigger={args.showTrigger}
        showClear={args.showClear}
      />
      <ComboboxContent>
        <ComboboxEmpty>No results.</ComboboxEmpty>
        <ComboboxList>
          {(item: string) => (
            <ComboboxItem key={item} value={item}>
              {item}
            </ComboboxItem>
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  ),
};

export const Overview: Story = {
  parameters: {
    docs: {
      source: {
        code: 'import * as React from "react";\nimport { cn } from "@erbium/ui/lib/utils";\nimport { HugeiconsIcon } from "@hugeicons/react";\nimport ArrowUpDownIcon from "@hugeicons/core-free-icons/ArrowUpDownIcon";\nimport CheckIcon from "@hugeicons/core-free-icons/CheckIcon";\n\n\nimport { Button } from "@erbium/ui/components/button";\nimport {\n  Command,\n  CommandEmpty,\n  CommandGroup,\n  CommandInput,\n  CommandItem,\n  CommandList,\n} from "@erbium/ui/components/command";\nimport { Popover, PopoverContent, PopoverTrigger } from "@erbium/ui/components/popover";\n\nconst frameworks = [\n  {\n    value: "next.js",\n    label: "Next.js",\n  },\n  {\n    value: "sveltekit",\n    label: "SvelteKit",\n  },\n  {\n    value: "nuxt.js",\n    label: "Nuxt.js",\n  },\n  {\n    value: "remix",\n    label: "Remix",\n  },\n  {\n    value: "astro",\n    label: "Astro",\n  },\n];\n\nexport default function ComboboxDemo() {\n  const [open, setOpen] = React.useState(false);\n  const [value, setValue] = React.useState("");\n\n  return (\n    <Popover open={open} onOpenChange={setOpen}>\n      <PopoverTrigger\n        render={\n          <Button\n            variant="outline"\n            role="combobox"\n            aria-expanded={open}\n            className="w-[200px] justify-between"\n          >\n            {value\n              ? frameworks.find((framework) => framework.value === value)?.label\n              : "Select framework..."}\n            <HugeiconsIcon icon={ArrowUpDownIcon} className="opacity-50" />\n          </Button>\n        }\n      />\n      <PopoverContent className="w-[200px] p-0">\n        <Command>\n          <CommandInput placeholder="Search framework..." className="h-9" />\n          <CommandList>\n            <CommandEmpty>No framework found.</CommandEmpty>\n            <CommandGroup>\n              {frameworks.map((framework) => (\n                <CommandItem\n                  key={framework.value}\n                  value={framework.value}\n                  onSelect={(currentValue) => {\n                    setValue(currentValue === value ? "" : currentValue);\n                    setOpen(false);\n                  }}\n                >\n                  {framework.label}\n                  <HugeiconsIcon icon={CheckIcon}\n                    className={cn(\n                      "ml-auto",\n                      value === framework.value ? "opacity-100" : "opacity-0",\n                    )}\n                  />\n                </CommandItem>\n              ))}\n            </CommandGroup>\n          </CommandList>\n        </Command>\n      </PopoverContent>\n    </Popover>\n  );\n}\n',
      },
    },
  },
  render: () => (
    <div className="w-full min-w-72 max-w-2xl p-4">
      <Demo />
    </div>
  ),
};

export const Basic: Story = {
  parameters: {
    docs: {
      description: { story: "A simple combobox with a list of frameworks." },
      source: {
        code: 'import {\n  Combobox,\n  ComboboxContent,\n  ComboboxEmpty,\n  ComboboxInput,\n  ComboboxItem,\n  ComboboxList,\n} from "@erbium/ui/components/combobox";\n\nconst frameworks = ["Next.js", "SvelteKit", "Nuxt.js", "Remix", "Astro"] as const;\n\nexport default function ComboboxBasic() {\n  return (\n    <Combobox items={frameworks}>\n      <ComboboxInput placeholder="Select a framework" />\n      <ComboboxContent>\n        <ComboboxEmpty>No items found.</ComboboxEmpty>\n        <ComboboxList>\n          {(item) => (\n            <ComboboxItem key={item} value={item}>\n              {item}\n            </ComboboxItem>\n          )}\n        </ComboboxList>\n      </ComboboxContent>\n    </Combobox>\n  );\n}\n',
      },
    },
  },
  render: () => <ComboboxBasic />,
};
export const Multiple: Story = {
  name: "Multiple Selection",
  parameters: {
    docs: {
      description: {
        story:
          'Use `multiple` with chips for multi-select behavior.\n\n```tsx\nimport * as React from "react"\n\nimport {\n  Combobox,\n  ComboboxChip,\n  ComboboxChips,\n  ComboboxChipsInput,\n  ComboboxContent,\n  ComboboxEmpty,\n  ComboboxInput,\n  ComboboxItem,\n  ComboboxList,\n  ComboboxValue,\n} from "@erbium/ui/components/combobox"\n\nconst frameworks = ["Next.js", "SvelteKit", "Nuxt.js", "Remix", "Astro"]\n\nexport function ExampleComboboxMultiple() {\n  const [value, setValue] = React.useState<string[]>([])\n\n  return (\n    <Combobox\n      items={frameworks}\n      multiple\n      value={value}\n      onValueChange={setValue}\n    >\n      <ComboboxChips>\n        <ComboboxValue>\n          {value.map((item) => (\n            <ComboboxChip key={item}>{item}</ComboboxChip>\n          ))}\n        </ComboboxValue>\n        <ComboboxChipsInput placeholder="Add framework" />\n      </ComboboxChips>\n      <ComboboxContent>\n        <ComboboxEmpty>No items found.</ComboboxEmpty>\n        <ComboboxList>\n          {(item) => (\n            <ComboboxItem key={item} value={item}>\n              {item}\n            </ComboboxItem>\n          )}\n        </ComboboxList>\n      </ComboboxContent>\n    </Combobox>\n  )\n}\n```\n\nA combobox with multiple selection using `multiple` and `ComboboxChips`.',
      },
      source: {
        code: 'import * as React from "react";\n\nimport {\n  Combobox,\n  ComboboxChip,\n  ComboboxChips,\n  ComboboxChipsInput,\n  ComboboxContent,\n  ComboboxEmpty,\n  ComboboxItem,\n  ComboboxList,\n  ComboboxValue,\n  useComboboxAnchor,\n} from "@erbium/ui/components/combobox";\n\nconst frameworks = ["Next.js", "SvelteKit", "Nuxt.js", "Remix", "Astro"] as const;\n\nexport function ComboboxMultiple() {\n  const anchor = useComboboxAnchor();\n\n  return (\n    <Combobox multiple autoHighlight items={frameworks} defaultValue={[frameworks[0]]}>\n      <ComboboxChips ref={anchor} className="w-full max-w-xs">\n        <ComboboxValue>\n          {(values) => (\n            <React.Fragment>\n              {values.map((value: string) => (\n                <ComboboxChip key={value}>{value}</ComboboxChip>\n              ))}\n              <ComboboxChipsInput />\n            </React.Fragment>\n          )}\n        </ComboboxValue>\n      </ComboboxChips>\n      <ComboboxContent anchor={anchor}>\n        <ComboboxEmpty>No items found.</ComboboxEmpty>\n        <ComboboxList>\n          {(item) => (\n            <ComboboxItem key={item} value={item}>\n              {item}\n            </ComboboxItem>\n          )}\n        </ComboboxList>\n      </ComboboxContent>\n    </Combobox>\n  );\n}\n',
      },
    },
  },
  render: () => <ComboboxMultiple />,
};
export const Groups: Story = {
  parameters: {
    docs: {
      description: { story: "Use `ComboboxGroup` and `ComboboxSeparator` to group items." },
      source: {
        code: 'import {\n  Combobox,\n  ComboboxCollection,\n  ComboboxContent,\n  ComboboxEmpty,\n  ComboboxGroup,\n  ComboboxInput,\n  ComboboxItem,\n  ComboboxLabel,\n  ComboboxList,\n  ComboboxSeparator,\n} from "@erbium/ui/components/combobox";\n\nconst timezones = [\n  {\n    value: "Americas",\n    items: [\n      "(GMT-5) New York",\n      "(GMT-8) Los Angeles",\n      "(GMT-6) Chicago",\n      "(GMT-5) Toronto",\n      "(GMT-8) Vancouver",\n      "(GMT-3) São Paulo",\n    ],\n  },\n  {\n    value: "Europe",\n    items: [\n      "(GMT+0) London",\n      "(GMT+1) Paris",\n      "(GMT+1) Berlin",\n      "(GMT+1) Rome",\n      "(GMT+1) Madrid",\n      "(GMT+1) Amsterdam",\n    ],\n  },\n  {\n    value: "Asia/Pacific",\n    items: [\n      "(GMT+9) Tokyo",\n      "(GMT+8) Shanghai",\n      "(GMT+8) Singapore",\n      "(GMT+4) Dubai",\n      "(GMT+11) Sydney",\n      "(GMT+9) Seoul",\n    ],\n  },\n] as const;\n\nexport function ComboboxWithGroupsAndSeparator() {\n  return (\n    <Combobox items={timezones}>\n      <ComboboxInput placeholder="Select a timezone" />\n      <ComboboxContent>\n        <ComboboxEmpty>No timezones found.</ComboboxEmpty>\n        <ComboboxList>\n          {(group, index) => (\n            <ComboboxGroup key={group.value} items={group.items}>\n              <ComboboxLabel>{group.value}</ComboboxLabel>\n              <ComboboxCollection>\n                {(item) => (\n                  <ComboboxItem key={item} value={item}>\n                    {item}\n                  </ComboboxItem>\n                )}\n              </ComboboxCollection>\n              {index < timezones.length - 1 && <ComboboxSeparator />}\n            </ComboboxGroup>\n          )}\n        </ComboboxList>\n      </ComboboxContent>\n    </Combobox>\n  );\n}\n',
      },
    },
  },
  render: () => <ComboboxWithGroupsAndSeparator />,
};
export const Invalid: Story = {
  parameters: {
    docs: {
      description: { story: "Use the `aria-invalid` prop to make the combobox invalid." },
      source: {
        code: 'import {\n  Combobox,\n  ComboboxContent,\n  ComboboxEmpty,\n  ComboboxInput,\n  ComboboxItem,\n  ComboboxList,\n} from "@erbium/ui/components/combobox";\n\nconst frameworks = ["Next.js", "SvelteKit", "Nuxt.js", "Remix", "Astro"] as const;\n\nexport function ComboboxInvalid() {\n  return (\n    <Combobox items={frameworks}>\n      <ComboboxInput placeholder="Select a framework" aria-invalid="true" />\n      <ComboboxContent>\n        <ComboboxEmpty>No items found.</ComboboxEmpty>\n        <ComboboxList>\n          {(item) => (\n            <ComboboxItem key={item} value={item}>\n              {item}\n            </ComboboxItem>\n          )}\n        </ComboboxList>\n      </ComboboxContent>\n    </Combobox>\n  );\n}\n',
      },
    },
  },
  render: () => <ComboboxInvalid />,
};
export const Disabled: Story = {
  parameters: {
    docs: {
      description: { story: "Use the `disabled` prop to disable the combobox." },
      source: {
        code: 'import {\n  Combobox,\n  ComboboxContent,\n  ComboboxEmpty,\n  ComboboxInput,\n  ComboboxItem,\n  ComboboxList,\n} from "@erbium/ui/components/combobox";\n\nconst frameworks = ["Next.js", "SvelteKit", "Nuxt.js", "Remix", "Astro"] as const;\n\nexport function ComboboxDisabled() {\n  return (\n    <Combobox items={frameworks}>\n      <ComboboxInput placeholder="Select a framework" disabled />\n      <ComboboxContent>\n        <ComboboxEmpty>No items found.</ComboboxEmpty>\n        <ComboboxList>\n          {(item) => (\n            <ComboboxItem key={item} value={item}>\n              {item}\n            </ComboboxItem>\n          )}\n        </ComboboxList>\n      </ComboboxContent>\n    </Combobox>\n  );\n}\n',
      },
    },
  },
  render: () => <ComboboxDisabled />,
};
export const AutoHighlight: Story = {
  parameters: {
    docs: {
      description: {
        story: "Use the `autoHighlight` prop to automatically highlight the first item on filter.",
      },
      source: {
        code: 'import {\n  Combobox,\n  ComboboxContent,\n  ComboboxEmpty,\n  ComboboxInput,\n  ComboboxItem,\n  ComboboxList,\n} from "@erbium/ui/components/combobox";\n\nconst frameworks = ["Next.js", "SvelteKit", "Nuxt.js", "Remix", "Astro"] as const;\n\nexport function ComboboxAutoHighlight() {\n  return (\n    <Combobox items={frameworks} autoHighlight>\n      <ComboboxInput placeholder="Select a framework" />\n      <ComboboxContent>\n        <ComboboxEmpty>No items found.</ComboboxEmpty>\n        <ComboboxList>\n          {(item) => (\n            <ComboboxItem key={item} value={item}>\n              {item}\n            </ComboboxItem>\n          )}\n        </ComboboxList>\n      </ComboboxContent>\n    </Combobox>\n  );\n}\n',
      },
    },
  },
  render: () => <ComboboxAutoHighlight />,
};
export const Popup: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "You can trigger the combobox from a button or any other component by using the `render` prop. Move the `ComboboxInput` inside the `ComboboxContent`.",
      },
      source: {
        code: 'import { Button } from "@erbium/ui/components/button";\nimport {\n  Combobox,\n  ComboboxContent,\n  ComboboxEmpty,\n  ComboboxInput,\n  ComboboxItem,\n  ComboboxList,\n  ComboboxTrigger,\n  ComboboxValue,\n} from "@erbium/ui/components/combobox";\n\nconst countries = [\n  { code: "", value: "", continent: "", label: "Select country" },\n  {\n    code: "ar",\n    value: "argentina",\n    label: "Argentina",\n    continent: "South America",\n  },\n  { code: "au", value: "australia", label: "Australia", continent: "Oceania" },\n  { code: "br", value: "brazil", label: "Brazil", continent: "South America" },\n  { code: "ca", value: "canada", label: "Canada", continent: "North America" },\n  { code: "cn", value: "china", label: "China", continent: "Asia" },\n  {\n    code: "co",\n    value: "colombia",\n    label: "Colombia",\n    continent: "South America",\n  },\n  { code: "eg", value: "egypt", label: "Egypt", continent: "Africa" },\n  { code: "fr", value: "france", label: "France", continent: "Europe" },\n  { code: "de", value: "germany", label: "Germany", continent: "Europe" },\n  { code: "it", value: "italy", label: "Italy", continent: "Europe" },\n  { code: "jp", value: "japan", label: "Japan", continent: "Asia" },\n  { code: "ke", value: "kenya", label: "Kenya", continent: "Africa" },\n  { code: "mx", value: "mexico", label: "Mexico", continent: "North America" },\n  {\n    code: "nz",\n    value: "new-zealand",\n    label: "New Zealand",\n    continent: "Oceania",\n  },\n  { code: "ng", value: "nigeria", label: "Nigeria", continent: "Africa" },\n  {\n    code: "za",\n    value: "south-africa",\n    label: "South Africa",\n    continent: "Africa",\n  },\n  { code: "kr", value: "south-korea", label: "South Korea", continent: "Asia" },\n  {\n    code: "gb",\n    value: "united-kingdom",\n    label: "United Kingdom",\n    continent: "Europe",\n  },\n  {\n    code: "us",\n    value: "united-states",\n    label: "United States",\n    continent: "North America",\n  },\n];\n\nexport function ComboboxPopup() {\n  return (\n    <>\n      <Combobox items={countries} defaultValue={countries[0]}>\n        <ComboboxTrigger\n          render={<Button variant="outline" className="w-64 justify-between font-normal" />}\n        >\n          <ComboboxValue />\n        </ComboboxTrigger>\n        <ComboboxContent>\n          <ComboboxInput showTrigger={false} placeholder="Search" />\n          <ComboboxEmpty>No items found.</ComboboxEmpty>\n          <ComboboxList>\n            {(item) => (\n              <ComboboxItem key={item.code} value={item}>\n                {item.label}\n              </ComboboxItem>\n            )}\n          </ComboboxList>\n        </ComboboxContent>\n      </Combobox>\n    </>\n  );\n}\n',
      },
    },
  },
  render: () => <ComboboxPopup />,
};
export const InputGroup: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "You can add an addon to the combobox by using the `InputGroupAddon` component inside the `ComboboxInput`.",
      },
      source: {
        code: 'import { HugeiconsIcon } from "@hugeicons/react";\nimport GlobeIcon from "@hugeicons/core-free-icons/GlobeIcon";\n\n\nimport {\n  Combobox,\n  ComboboxCollection,\n  ComboboxContent,\n  ComboboxEmpty,\n  ComboboxGroup,\n  ComboboxInput,\n  ComboboxItem,\n  ComboboxLabel,\n  ComboboxList,\n} from "@erbium/ui/components/combobox";\nimport { InputGroupAddon } from "@erbium/ui/components/input-group";\n\nconst timezones = [\n  {\n    value: "Americas",\n    items: [\n      "(GMT-5) New York",\n      "(GMT-8) Los Angeles",\n      "(GMT-6) Chicago",\n      "(GMT-5) Toronto",\n      "(GMT-8) Vancouver",\n      "(GMT-3) São Paulo",\n    ],\n  },\n  {\n    value: "Europe",\n    items: [\n      "(GMT+0) London",\n      "(GMT+1) Paris",\n      "(GMT+1) Berlin",\n      "(GMT+1) Rome",\n      "(GMT+1) Madrid",\n      "(GMT+1) Amsterdam",\n    ],\n  },\n  {\n    value: "Asia/Pacific",\n    items: [\n      "(GMT+9) Tokyo",\n      "(GMT+8) Shanghai",\n      "(GMT+8) Singapore",\n      "(GMT+4) Dubai",\n      "(GMT+11) Sydney",\n      "(GMT+9) Seoul",\n    ],\n  },\n] as const;\n\nexport function ComboxboxInputGroup() {\n  return (\n    <Combobox items={timezones}>\n      <ComboboxInput placeholder="Select a timezone">\n        <InputGroupAddon>\n          <HugeiconsIcon icon={GlobeIcon} />\n        </InputGroupAddon>\n      </ComboboxInput>\n      <ComboboxContent alignOffset={-28} className="w-60">\n        <ComboboxEmpty>No timezones found.</ComboboxEmpty>\n        <ComboboxList>\n          {(group) => (\n            <ComboboxGroup key={group.value} items={group.items}>\n              <ComboboxLabel>{group.value}</ComboboxLabel>\n              <ComboboxCollection>\n                {(item) => (\n                  <ComboboxItem key={item} value={item}>\n                    {item}\n                  </ComboboxItem>\n                )}\n              </ComboboxCollection>\n            </ComboboxGroup>\n          )}\n        </ComboboxList>\n      </ComboboxContent>\n    </Combobox>\n  );\n}\n',
      },
    },
  },
  render: () => <ComboxboxInputGroup />,
};

export const CustomItems: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Use `itemToStringValue` when your items are objects.\n\n```tsx\nimport * as React from "react"\n\nimport {\n  Combobox,\n  ComboboxContent,\n  ComboboxEmpty,\n  ComboboxInput,\n  ComboboxItem,\n  ComboboxList,\n} from "@erbium/ui/components/combobox"\n\ntype Framework = {\n  label: string\n  value: string\n}\n\nconst frameworks: Framework[] = [\n  { label: "Next.js", value: "next" },\n  { label: "SvelteKit", value: "sveltekit" },\n  { label: "Nuxt", value: "nuxt" },\n]\n\nexport function ExampleComboboxCustomItems() {\n  return (\n    <Combobox\n      items={frameworks}\n      itemToStringValue={(framework) => framework.label}\n    >\n      <ComboboxInput placeholder="Select a framework" />\n      <ComboboxContent>\n        <ComboboxEmpty>No items found.</ComboboxEmpty>\n        <ComboboxList>\n          {(framework) => (\n            <ComboboxItem key={framework.value} value={framework}>\n              {framework.label}\n            </ComboboxItem>\n          )}\n        </ComboboxList>\n      </ComboboxContent>\n    </Combobox>\n  )\n}\n```\n\nYou can render a custom component inside `ComboboxItem`.',
      },
      source: {
        code: 'import {\n  Combobox,\n  ComboboxContent,\n  ComboboxEmpty,\n  ComboboxInput,\n  ComboboxItem,\n  ComboboxList,\n} from "@erbium/ui/components/combobox";\nimport { Item, ItemContent, ItemDescription, ItemTitle } from "@erbium/ui/components/item";\n\nconst countries = [\n  { code: "", value: "", continent: "", label: "Select country" },\n  {\n    code: "ar",\n    value: "argentina",\n    label: "Argentina",\n    continent: "South America",\n  },\n  { code: "au", value: "australia", label: "Australia", continent: "Oceania" },\n  { code: "br", value: "brazil", label: "Brazil", continent: "South America" },\n  { code: "ca", value: "canada", label: "Canada", continent: "North America" },\n  { code: "cn", value: "china", label: "China", continent: "Asia" },\n  {\n    code: "co",\n    value: "colombia",\n    label: "Colombia",\n    continent: "South America",\n  },\n  { code: "eg", value: "egypt", label: "Egypt", continent: "Africa" },\n  { code: "fr", value: "france", label: "France", continent: "Europe" },\n  { code: "de", value: "germany", label: "Germany", continent: "Europe" },\n  { code: "it", value: "italy", label: "Italy", continent: "Europe" },\n  { code: "jp", value: "japan", label: "Japan", continent: "Asia" },\n  { code: "ke", value: "kenya", label: "Kenya", continent: "Africa" },\n  { code: "mx", value: "mexico", label: "Mexico", continent: "North America" },\n  {\n    code: "nz",\n    value: "new-zealand",\n    label: "New Zealand",\n    continent: "Oceania",\n  },\n  { code: "ng", value: "nigeria", label: "Nigeria", continent: "Africa" },\n  {\n    code: "za",\n    value: "south-africa",\n    label: "South Africa",\n    continent: "Africa",\n  },\n  { code: "kr", value: "south-korea", label: "South Korea", continent: "Asia" },\n  {\n    code: "gb",\n    value: "united-kingdom",\n    label: "United Kingdom",\n    continent: "Europe",\n  },\n  {\n    code: "us",\n    value: "united-states",\n    label: "United States",\n    continent: "North America",\n  },\n];\n\nexport function ComboboxWithCustomItems() {\n  return (\n    <Combobox\n      items={countries.filter((country) => country.code !== "")}\n      itemToStringValue={(country: (typeof countries)[number]) => country.label}\n    >\n      <ComboboxInput placeholder="Search countries..." />\n      <ComboboxContent>\n        <ComboboxEmpty>No countries found.</ComboboxEmpty>\n        <ComboboxList>\n          {(country) => (\n            <ComboboxItem key={country.code} value={country}>\n              <Item size="xs" className="p-0">\n                <ItemContent>\n                  <ItemTitle className="whitespace-nowrap">{country.label}</ItemTitle>\n                  <ItemDescription>\n                    {country.continent} ({country.code})\n                  </ItemDescription>\n                </ItemContent>\n              </Item>\n            </ComboboxItem>\n          )}\n        </ComboboxList>\n      </ComboboxContent>\n    </Combobox>\n  );\n}\n',
      },
    },
  },
  render: () => <ComboboxWithCustomItems />,
};

export const ClearButton: Story = {
  parameters: {
    docs: {
      description: { story: "Use the `showClear` prop to show a clear button." },
      source: {
        code: 'import {\n  Combobox,\n  ComboboxContent,\n  ComboboxEmpty,\n  ComboboxInput,\n  ComboboxItem,\n  ComboboxList,\n} from "@erbium/ui/components/combobox";\n\nconst frameworks = ["Next.js", "SvelteKit", "Nuxt.js", "Remix", "Astro"] as const;\n\nexport function ComboboxWithClear() {\n  return (\n    <Combobox items={frameworks} defaultValue={frameworks[0]}>\n      <ComboboxInput placeholder="Select a framework" showClear />\n      <ComboboxContent>\n        <ComboboxEmpty>No items found.</ComboboxEmpty>\n        <ComboboxList>\n          {(item) => (\n            <ComboboxItem key={item} value={item}>\n              {item}\n            </ComboboxItem>\n          )}\n        </ComboboxList>\n      </ComboboxContent>\n    </Combobox>\n  );\n}\n',
      },
    },
  },
  render: () => <ComboboxWithClear />,
};
