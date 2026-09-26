import { PopoverForm } from "../examples/upstream/popover-form";
import { PopoverAlignments } from "../examples/upstream/popover-alignments";
import { PopoverBasic } from "../examples/upstream/popover-basic";
import type { Meta, StoryObj } from "@storybook/tanstack-react";
import { Popover } from "@erbium/ui/components/popover";
import Demo from "../examples/popover-demo";

const meta = {
  title: "UI/Popover",
  component: Popover,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          'Displays rich content in a portal, triggered by a button.\n\n**Import:** `@erbium/ui/components/popover`  \n\n**shadcn/ui page:** [Popover](https://ui.shadcn.com/docs/components/base/popover)\n\n### Usage\n\n```tsx\nimport {\n  Popover,\n  PopoverContent,\n  PopoverDescription,\n  PopoverHeader,\n  PopoverTitle,\n  PopoverTrigger,\n} from "@erbium/ui/components/popover"\n```\n\n```tsx\n<Popover>\n  <PopoverTrigger render={<Button variant="outline" />}>\n    Open Popover\n  </PopoverTrigger>\n  <PopoverContent>\n    <PopoverHeader>\n      <PopoverTitle>Title</PopoverTitle>\n      <PopoverDescription>Description text here.</PopoverDescription>\n    </PopoverHeader>\n  </PopoverContent>\n</Popover>\n```\n\n### Composition\n\nUse the following composition to build a `Popover`:\n\n```text\nPopover\n├── PopoverTrigger\n└── PopoverContent\n```',
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

export const Basic: Story = {
  parameters: {
    docs: {
      description: { story: "A simple popover with a header, title, and description." },
      source: {
        code: 'import { Button } from "@erbium/ui/components/button";\nimport {\n  Popover,\n  PopoverContent,\n  PopoverDescription,\n  PopoverHeader,\n  PopoverTitle,\n  PopoverTrigger,\n} from "@erbium/ui/components/popover";\n\nexport function PopoverBasic() {\n  return (\n    <>\n      <Popover>\n        <PopoverTrigger render={<Button variant="outline" className="w-fit" />}>\n          Open Popover\n        </PopoverTrigger>\n        <PopoverContent align="start">\n          <PopoverHeader>\n            <PopoverTitle>Dimensions</PopoverTitle>\n            <PopoverDescription>Set the dimensions for the layer.</PopoverDescription>\n          </PopoverHeader>\n        </PopoverContent>\n      </Popover>\n    </>\n  );\n}\n',
      },
    },
  },
  render: () => <PopoverBasic />,
};

export const Align: Story = {
  parameters: {
    docs: {
      description: {
        story: "Use the `align` prop on `PopoverContent` to control the horizontal alignment.",
      },
      source: {
        code: 'import { Button } from "@erbium/ui/components/button";\nimport { Popover, PopoverContent, PopoverTrigger } from "@erbium/ui/components/popover";\n\nexport function PopoverAlignments() {\n  return (\n    <>\n      <div className="flex gap-6">\n        <Popover>\n          <PopoverTrigger render={<Button variant="outline" size="sm" />}>Start</PopoverTrigger>\n          <PopoverContent align="start" className="w-40">\n            Aligned to start\n          </PopoverContent>\n        </Popover>\n        <Popover>\n          <PopoverTrigger render={<Button variant="outline" size="sm" />}>Center</PopoverTrigger>\n          <PopoverContent align="center" className="w-40">\n            Aligned to center\n          </PopoverContent>\n        </Popover>\n        <Popover>\n          <PopoverTrigger render={<Button variant="outline" size="sm" />}>End</PopoverTrigger>\n          <PopoverContent align="end" className="w-40">\n            Aligned to end\n          </PopoverContent>\n        </Popover>\n      </div>\n    </>\n  );\n}\n',
      },
    },
  },
  render: () => <PopoverAlignments />,
};

export const WithForm: Story = {
  parameters: {
    docs: {
      description: { story: "A popover with form fields inside." },
      source: {
        code: 'import { Button } from "@erbium/ui/components/button";\nimport { Field, FieldGroup, FieldLabel } from "@erbium/ui/components/field";\nimport { Input } from "@erbium/ui/components/input";\nimport {\n  Popover,\n  PopoverContent,\n  PopoverDescription,\n  PopoverHeader,\n  PopoverTitle,\n  PopoverTrigger,\n} from "@erbium/ui/components/popover";\n\nexport function PopoverForm() {\n  return (\n    <>\n      <Popover>\n        <PopoverTrigger render={<Button variant="outline" />}>Open Popover</PopoverTrigger>\n        <PopoverContent className="w-64" align="start">\n          <PopoverHeader>\n            <PopoverTitle>Dimensions</PopoverTitle>\n            <PopoverDescription>Set the dimensions for the layer.</PopoverDescription>\n          </PopoverHeader>\n          <FieldGroup className="gap-4">\n            <Field orientation="horizontal">\n              <FieldLabel htmlFor="width" className="w-1/2">\n                Width\n              </FieldLabel>\n              <Input id="width" defaultValue="100%" />\n            </Field>\n            <Field orientation="horizontal">\n              <FieldLabel htmlFor="height" className="w-1/2">\n                Height\n              </FieldLabel>\n              <Input id="height" defaultValue="25px" />\n            </Field>\n          </FieldGroup>\n        </PopoverContent>\n      </Popover>\n    </>\n  );\n}\n',
      },
    },
  },
  render: () => <PopoverForm />,
};
