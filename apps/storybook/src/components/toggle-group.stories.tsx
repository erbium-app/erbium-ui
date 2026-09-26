import ExampleToggleGroupOutline from "./examples/toggle-group-outline";
import ExampleToggleGroupSpacing from "./examples/toggle-group-spacing";
import ExampleToggleGroupDisabled from "./examples/toggle-group-disabled";
import type { Meta, StoryObj } from "@storybook/tanstack-react";
import { ToggleGroup } from "@erbium/ui/components/toggle-group";
import Demo from "./examples/toggle-group-demo";

const meta = {
  title: "UI/Toggle Group",
  component: ToggleGroup,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          'A set of two-state buttons that can be toggled on or off.\n\n**Import:** `@erbium/ui/components/toggle-group`  \n\n**shadcn/ui page:** [Toggle Group](https://ui.shadcn.com/docs/components/base/toggle-group)\n\n### Usage\n\n```tsx\nimport { ToggleGroup, ToggleGroupItem } from "@erbium/ui/components/toggle-group"\n```\n\n```tsx\n<ToggleGroup type="single">\n  <ToggleGroupItem value="a">A</ToggleGroupItem>\n  <ToggleGroupItem value="b">B</ToggleGroupItem>\n  <ToggleGroupItem value="c">C</ToggleGroupItem>\n</ToggleGroup>\n```\n\n### Composition\n\nUse the following composition to build a `ToggleGroup`:\n\n```text\nToggleGroup\n├── ToggleGroupItem\n└── ToggleGroupItem\n```\n\n### Outline\n\nUse `variant="outline"` for an outline style.\n\n### Size\n\nUse the `size` prop to change the size of the toggle group.\n\n### Spacing\n\nUse `spacing` to add spacing between toggle group items.\n\n### Vertical\n\nUse `orientation="vertical"` for vertical toggle groups.\n\n### Disabled\n\n### Custom\n\nA custom toggle group example.\n\nstyleName="base-nova"\n\nname="toggle-group-font-weight-selector"\n\npreviewClassName="*:data-[slot=field]:max-w-xs"\n\n/>\n\n### Changelog\n\nChanged the default `spacing` from `0` to `2` so toggle groups render with space between items by default. Use `spacing={0}` for connected items.',
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
