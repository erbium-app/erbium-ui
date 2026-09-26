import { ToggleGroupSizes } from "../examples/upstream/toggle-group-sizes";
import { ToggleGroupVertical } from "../examples/upstream/toggle-group-vertical";
import { ToggleGroupFontWeightSelector } from "../examples/upstream/toggle-group-font-weight-selector";
import ExampleToggleGroupOutline from "../examples/toggle-group-outline";
import ExampleToggleGroupSpacing from "../examples/toggle-group-spacing";
import ExampleToggleGroupDisabled from "../examples/toggle-group-disabled";
import type { Meta, StoryObj } from "@storybook/tanstack-react";
import { ToggleGroup, ToggleGroupItem } from "@erbium/ui/components/toggle-group";
import Demo from "../examples/toggle-group-demo";

const meta = {
  title: "UI/Toggle Group",
  component: ToggleGroup,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          'A set of two-state buttons that can be toggled on or off.\n\n**Import:** `@erbium/ui/components/toggle-group`  \n\n**shadcn/ui page:** [Toggle Group](https://ui.shadcn.com/docs/components/base/toggle-group)\n\n### Usage\n\n```tsx\nimport { ToggleGroup, ToggleGroupItem } from "@erbium/ui/components/toggle-group"\n```\n\n```tsx\n<ToggleGroup type="single">\n  <ToggleGroupItem value="a">A</ToggleGroupItem>\n  <ToggleGroupItem value="b">B</ToggleGroupItem>\n  <ToggleGroupItem value="c">C</ToggleGroupItem>\n</ToggleGroup>\n```\n\n### Composition\n\nUse the following composition to build a `ToggleGroup`:\n\n```text\nToggleGroup\n├── ToggleGroupItem\n└── ToggleGroupItem\n```\n\n### Changelog\n\nChanged the default `spacing` from `0` to `2` so toggle groups render with space between items by default. Use `spacing={0}` for connected items.',
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Playground: StoryObj<typeof ToggleGroup> = {
  args: {
    variant: "default",
    size: "default",
    spacing: 2,
    orientation: "horizontal",
    multiple: false,
  },
  argTypes: {
    variant: { control: "select", options: ["default", "outline"] },
    size: { control: "select", options: ["default", "sm", "lg"] },
    spacing: { control: { type: "range", min: 0, max: 8, step: 1 } },
    orientation: { control: "select", options: ["horizontal", "vertical"] },
    multiple: { control: "boolean" },
  },
  render: (args) => (
    <ToggleGroup {...args}>
      <ToggleGroupItem value="one">One</ToggleGroupItem>
      <ToggleGroupItem value="two">Two</ToggleGroupItem>
      <ToggleGroupItem value="three">Three</ToggleGroupItem>
    </ToggleGroup>
  ),
};

export const Overview: Story = {
  parameters: {
    docs: {
      source: {
        code: 'import { Bold, Italic, Underline } from "lucide-react";\n\nimport { ToggleGroup, ToggleGroupItem } from "@erbium/ui/components/toggle-group";\n\nexport default function ToggleGroupDemo() {\n  return (\n    <ToggleGroup variant="outline">\n      <ToggleGroupItem value="bold" aria-label="Toggle bold">\n        <Bold className="h-4 w-4" />\n      </ToggleGroupItem>\n      <ToggleGroupItem value="italic" aria-label="Toggle italic">\n        <Italic className="h-4 w-4" />\n      </ToggleGroupItem>\n      <ToggleGroupItem value="strikethrough" aria-label="Toggle strikethrough">\n        <Underline className="h-4 w-4" />\n      </ToggleGroupItem>\n    </ToggleGroup>\n  );\n}\n',
      },
    },
  },
  render: () => (
    <div className="w-full min-w-72 max-w-2xl p-4">
      <Demo />
    </div>
  ),
};

export const Outline: Story = {
  parameters: {
    docs: {
      description: { story: 'Use `variant="outline"` for an outline style.' },

      source: {
        code: 'import { Bold, Italic, Underline } from "lucide-react"\n\nimport {\n  ToggleGroup,\n  ToggleGroupItem,\n} from "@erbium/ui/components/toggle-group"\n\nexport default function ToggleGroupDemo() {\n  return (\n    <ToggleGroup type="multiple" variant="outline">\n      <ToggleGroupItem value="bold" aria-label="Toggle bold">\n        <Bold className="h-4 w-4" />\n      </ToggleGroupItem>\n      <ToggleGroupItem value="italic" aria-label="Toggle italic">\n        <Italic className="h-4 w-4" />\n      </ToggleGroupItem>\n      <ToggleGroupItem value="strikethrough" aria-label="Toggle strikethrough">\n        <Underline className="h-4 w-4" />\n      </ToggleGroupItem>\n    </ToggleGroup>\n  )\n}\n',
      },
    },
  },
  render: () => (
    <div className="w-full min-w-72 max-w-2xl p-4">
      <ExampleToggleGroupOutline />
    </div>
  ),
};
export const Spacing: Story = {
  parameters: {
    docs: {
      description: { story: "Use `spacing` to add spacing between toggle group items." },

      source: {
        code: 'import { BookmarkIcon, HeartIcon, StarIcon } from "lucide-react"\n\nimport {\n  ToggleGroup,\n  ToggleGroupItem,\n} from "@erbium/ui/components/toggle-group"\n\nexport default function ToggleGroupSpacing() {\n  return (\n    <ToggleGroup type="multiple" variant="outline" spacing={2} size="sm">\n      <ToggleGroupItem\n        value="star"\n        aria-label="Toggle star"\n        className="data-[state=on]:bg-transparent data-[state=on]:*:[svg]:fill-yellow-500 data-[state=on]:*:[svg]:stroke-yellow-500"\n      >\n        <StarIcon />\n        Star\n      </ToggleGroupItem>\n      <ToggleGroupItem\n        value="heart"\n        aria-label="Toggle heart"\n        className="data-[state=on]:bg-transparent data-[state=on]:*:[svg]:fill-red-500 data-[state=on]:*:[svg]:stroke-red-500"\n      >\n        <HeartIcon />\n        Heart\n      </ToggleGroupItem>\n      <ToggleGroupItem\n        value="bookmark"\n        aria-label="Toggle bookmark"\n        className="data-[state=on]:bg-transparent data-[state=on]:*:[svg]:fill-blue-500 data-[state=on]:*:[svg]:stroke-blue-500"\n      >\n        <BookmarkIcon />\n        Bookmark\n      </ToggleGroupItem>\n    </ToggleGroup>\n  )\n}\n',
      },
    },
  },
  render: () => (
    <div className="w-full min-w-72 max-w-2xl p-4">
      <ExampleToggleGroupSpacing />
    </div>
  ),
};
export const Disabled: Story = {
  parameters: {
    docs: {
      description: { story: "Disable a toggle group option." },

      source: {
        code: 'import { Bold, Italic, Underline } from "lucide-react"\n\nimport {\n  ToggleGroup,\n  ToggleGroupItem,\n} from "@erbium/ui/components/toggle-group"\n\nexport default function ToggleGroupDemo() {\n  return (\n    <ToggleGroup type="multiple" disabled>\n      <ToggleGroupItem value="bold" aria-label="Toggle bold">\n        <Bold className="h-4 w-4" />\n      </ToggleGroupItem>\n      <ToggleGroupItem value="italic" aria-label="Toggle italic">\n        <Italic className="h-4 w-4" />\n      </ToggleGroupItem>\n      <ToggleGroupItem value="strikethrough" aria-label="Toggle strikethrough">\n        <Underline className="h-4 w-4" />\n      </ToggleGroupItem>\n    </ToggleGroup>\n  )\n}\n',
      },
    },
  },
  render: () => (
    <div className="w-full min-w-72 max-w-2xl p-4">
      <ExampleToggleGroupDisabled />
    </div>
  ),
};

export const FontWeightSelector: Story = {
  name: "Custom",
  parameters: {
    docs: {
      description: { story: "A custom toggle group example." },
      source: {
        code: 'import * as React from "react";\n\nimport { Field, FieldDescription, FieldLabel } from "@erbium/ui/components/field";\nimport { ToggleGroup, ToggleGroupItem } from "@erbium/ui/components/toggle-group";\n\nexport function ToggleGroupFontWeightSelector() {\n  const [fontWeight, setFontWeight] = React.useState("normal");\n  return (\n    <Field>\n      <FieldLabel>Font Weight</FieldLabel>\n      <ToggleGroup\n        value={[fontWeight]}\n        onValueChange={(value) => setFontWeight(value[0])}\n        variant="outline"\n        spacing={2}\n        size="lg"\n      >\n        <ToggleGroupItem\n          value="light"\n          aria-label="Light"\n          className="flex size-16 flex-col items-center justify-center rounded-xl"\n        >\n          <span className="text-2xl leading-none font-light">Aa</span>\n          <span className="text-xs text-muted-foreground">Light</span>\n        </ToggleGroupItem>\n        <ToggleGroupItem\n          value="normal"\n          aria-label="Normal"\n          className="flex size-16 flex-col items-center justify-center rounded-xl"\n        >\n          <span className="text-2xl leading-none font-normal">Aa</span>\n          <span className="text-xs text-muted-foreground">Normal</span>\n        </ToggleGroupItem>\n        <ToggleGroupItem\n          value="medium"\n          aria-label="Medium"\n          className="flex size-16 flex-col items-center justify-center rounded-xl"\n        >\n          <span className="text-2xl leading-none font-medium">Aa</span>\n          <span className="text-xs text-muted-foreground">Medium</span>\n        </ToggleGroupItem>\n        <ToggleGroupItem\n          value="bold"\n          aria-label="Bold"\n          className="flex size-16 flex-col items-center justify-center rounded-xl"\n        >\n          <span className="text-2xl leading-none font-bold">Aa</span>\n          <span className="text-xs text-muted-foreground">Bold</span>\n        </ToggleGroupItem>\n      </ToggleGroup>\n      <FieldDescription>\n        Use <code className="rounded-md bg-muted px-1 py-0.5 font-mono">font-{fontWeight}</code> to\n        set the font weight.\n      </FieldDescription>\n    </Field>\n  );\n}\n',
      },
    },
  },
  render: () => <ToggleGroupFontWeightSelector />,
};

export const Vertical: Story = {
  parameters: {
    docs: {
      description: { story: 'Use `orientation="vertical"` for vertical toggle groups.' },
      source: {
        code: 'import { BoldIcon, ItalicIcon, UnderlineIcon } from "lucide-react";\n\nimport { ToggleGroup, ToggleGroupItem } from "@erbium/ui/components/toggle-group";\n\nexport function ToggleGroupVertical() {\n  return (\n    <ToggleGroup multiple orientation="vertical" spacing={1} defaultValue={["bold", "italic"]}>\n      <ToggleGroupItem value="bold" aria-label="Toggle bold">\n        <BoldIcon />\n      </ToggleGroupItem>\n      <ToggleGroupItem value="italic" aria-label="Toggle italic">\n        <ItalicIcon />\n      </ToggleGroupItem>\n      <ToggleGroupItem value="underline" aria-label="Toggle underline">\n        <UnderlineIcon />\n      </ToggleGroupItem>\n    </ToggleGroup>\n  );\n}\n',
      },
    },
  },
  render: () => <ToggleGroupVertical />,
};

export const Size: Story = {
  parameters: {
    docs: {
      description: { story: "Use the `size` prop to change the size of the toggle group." },
      source: {
        code: 'import { ToggleGroup, ToggleGroupItem } from "@erbium/ui/components/toggle-group";\n\nexport function ToggleGroupSizes() {\n  return (\n    <div className="flex flex-col gap-4">\n      <ToggleGroup size="sm" defaultValue={["top"]} variant="outline">\n        <ToggleGroupItem value="top" aria-label="Toggle top">\n          Top\n        </ToggleGroupItem>\n        <ToggleGroupItem value="bottom" aria-label="Toggle bottom">\n          Bottom\n        </ToggleGroupItem>\n        <ToggleGroupItem value="left" aria-label="Toggle left">\n          Left\n        </ToggleGroupItem>\n        <ToggleGroupItem value="right" aria-label="Toggle right">\n          Right\n        </ToggleGroupItem>\n      </ToggleGroup>\n      <ToggleGroup defaultValue={["top"]} variant="outline">\n        <ToggleGroupItem value="top" aria-label="Toggle top">\n          Top\n        </ToggleGroupItem>\n        <ToggleGroupItem value="bottom" aria-label="Toggle bottom">\n          Bottom\n        </ToggleGroupItem>\n        <ToggleGroupItem value="left" aria-label="Toggle left">\n          Left\n        </ToggleGroupItem>\n        <ToggleGroupItem value="right" aria-label="Toggle right">\n          Right\n        </ToggleGroupItem>\n      </ToggleGroup>\n    </div>\n  );\n}\n',
      },
    },
  },
  render: () => <ToggleGroupSizes />,
};
