import type { Meta, StoryObj } from "@storybook/react-vite";
import { Popover } from "@erbium/ui/components/popover";
import Demo from "./examples/popover-demo";

const meta = {
  title: "UI/Popover",
  component: Popover,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          'Displays rich content in a portal, triggered by a button.\n\n**Import:** `@erbium/ui/components/popover`  \n\n**shadcn/ui page:** [Popover](https://ui.shadcn.com/docs/components/base/popover)\n\n### Usage\n\n```tsx\nimport {\n  Popover,\n  PopoverContent,\n  PopoverDescription,\n  PopoverHeader,\n  PopoverTitle,\n  PopoverTrigger,\n} from "@erbium/ui/components/popover"\n```\n\n```tsx\n<Popover>\n  <PopoverTrigger render={<Button variant="outline" />}>\n    Open Popover\n  </PopoverTrigger>\n  <PopoverContent>\n    <PopoverHeader>\n      <PopoverTitle>Title</PopoverTitle>\n      <PopoverDescription>Description text here.</PopoverDescription>\n    </PopoverHeader>\n  </PopoverContent>\n</Popover>\n```\n\n### Composition\n\nUse the following composition to build a `Popover`:\n\n```text\nPopover\n├── PopoverTrigger\n└── PopoverContent\n```\n\n### Basic\n\nA simple popover with a header, title, and description.\n\n### Align\n\nUse the `align` prop on `PopoverContent` to control the horizontal alignment.\n\n### With Form\n\nA popover with form fields inside.',
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
        code: 'import { Button } from "@erbium/ui/components/button";\nimport { Input } from "@erbium/ui/components/input";\nimport { Label } from "@erbium/ui/components/label";\nimport { Popover, PopoverContent, PopoverTrigger } from "@erbium/ui/components/popover";\n\nexport default function PopoverDemo() {\n  return (\n    <Popover>\n      <PopoverTrigger render={<Button variant="outline">Open popover</Button>} />\n      <PopoverContent className="w-80">\n        <div className="grid gap-4">\n          <div className="space-y-2">\n            <h4 className="leading-none font-medium">Dimensions</h4>\n            <p className="text-sm text-muted-foreground">Set the dimensions for the layer.</p>\n          </div>\n          <div className="grid gap-2">\n            <div className="grid grid-cols-3 items-center gap-4">\n              <Label htmlFor="width">Width</Label>\n              <Input id="width" defaultValue="100%" className="col-span-2 h-8" />\n            </div>\n            <div className="grid grid-cols-3 items-center gap-4">\n              <Label htmlFor="maxWidth">Max. width</Label>\n              <Input id="maxWidth" defaultValue="300px" className="col-span-2 h-8" />\n            </div>\n            <div className="grid grid-cols-3 items-center gap-4">\n              <Label htmlFor="height">Height</Label>\n              <Input id="height" defaultValue="25px" className="col-span-2 h-8" />\n            </div>\n            <div className="grid grid-cols-3 items-center gap-4">\n              <Label htmlFor="maxHeight">Max. height</Label>\n              <Input id="maxHeight" defaultValue="none" className="col-span-2 h-8" />\n            </div>\n          </div>\n        </div>\n      </PopoverContent>\n    </Popover>\n  );\n}\n',
      },
    },
  },
  render: () => (
    <div className="w-full min-w-72 max-w-2xl p-4">
      <Demo />
    </div>
  ),
};
