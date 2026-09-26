import ExampleSheetSide from "../examples/sheet-side";
import type { Meta, StoryObj } from "@storybook/tanstack-react";
import { Sheet } from "@erbium/ui/components/sheet";
import Demo from "../examples/sheet-demo";

const meta = {
  title: "UI/Sheet",
  component: Sheet,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          'Extends the Dialog component to display content that complements the main content of the screen.\n\n**Import:** `@erbium/ui/components/sheet`  \n\n**shadcn/ui page:** [Sheet](https://ui.shadcn.com/docs/components/base/sheet)\n\n### Usage\n\n```tsx\nimport {\n  Sheet,\n  SheetClose,\n  SheetContent,\n  SheetDescription,\n  SheetFooter,\n  SheetHeader,\n  SheetTitle,\n  SheetTrigger,\n} from "@erbium/ui/components/sheet"\n```\n\n```tsx\n<Sheet>\n  <SheetTrigger>Open</SheetTrigger>\n  <SheetContent>\n    <SheetHeader>\n      <SheetTitle>Are you absolutely sure?</SheetTitle>\n      <SheetDescription>This action cannot be undone.</SheetDescription>\n    </SheetHeader>\n  </SheetContent>\n</Sheet>\n```\n\n### Composition\n\nUse the following composition to build a `Sheet`:\n\n```text\nSheet\n├── SheetTrigger\n└── SheetContent\n    ├── SheetHeader\n    │   ├── SheetTitle\n    │   └── SheetDescription\n    └── SheetFooter\n```\n\n### Side\n\nUse the `side` prop on `SheetContent` to set the edge of the screen where the sheet appears. Values are `top`, `right`, `bottom`, or `left`.\n\n### No Close Button\n\nUse `showCloseButton={false}` on `SheetContent` to hide the close button.',
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
        code: 'import { Button } from "@erbium/ui/components/button";\nimport { Input } from "@erbium/ui/components/input";\nimport { Label } from "@erbium/ui/components/label";\nimport {\n  Sheet,\n  SheetClose,\n  SheetContent,\n  SheetDescription,\n  SheetFooter,\n  SheetHeader,\n  SheetTitle,\n  SheetTrigger,\n} from "@erbium/ui/components/sheet";\n\nexport default function SheetDemo() {\n  return (\n    <Sheet>\n      <SheetTrigger render={<Button variant="outline">Open</Button>} />\n      <SheetContent>\n        <SheetHeader>\n          <SheetTitle>Edit profile</SheetTitle>\n          <SheetDescription>\n            Make changes to your profile here. Click save when you&apos;re done.\n          </SheetDescription>\n        </SheetHeader>\n        <div className="grid flex-1 auto-rows-min gap-6 px-4">\n          <div className="grid gap-3">\n            <Label htmlFor="sheet-demo-name">Name</Label>\n            <Input id="sheet-demo-name" defaultValue="Pedro Duarte" />\n          </div>\n          <div className="grid gap-3">\n            <Label htmlFor="sheet-demo-username">Username</Label>\n            <Input id="sheet-demo-username" defaultValue="@peduarte" />\n          </div>\n        </div>\n        <SheetFooter>\n          <Button type="submit">Save changes</Button>\n          <SheetClose render={<Button variant="outline">Close</Button>} />\n        </SheetFooter>\n      </SheetContent>\n    </Sheet>\n  );\n}\n',
      },
    },
  },
  render: () => (
    <div className="w-full min-w-72 max-w-2xl p-4">
      <Demo />
    </div>
  ),
};

export const Side: Story = {
  parameters: {
    docs: {
      source: {
        code: '\nimport { Button } from "@erbium/ui/components/button"\nimport { Input } from "@erbium/ui/components/input"\nimport { Label } from "@erbium/ui/components/label"\nimport {\n  Sheet,\n  SheetClose,\n  SheetContent,\n  SheetDescription,\n  SheetFooter,\n  SheetHeader,\n  SheetTitle,\n  SheetTrigger,\n} from "@erbium/ui/components/sheet"\n\nconst SHEET_SIDES = ["top", "right", "bottom", "left"] as const\n\ntype SheetSide = (typeof SHEET_SIDES)[number]\n\nexport default function SheetSide() {\n  return (\n    <div className="grid grid-cols-2 gap-2">\n      {SHEET_SIDES.map((side) => (\n        <Sheet key={side}>\n          <SheetTrigger render={<Button variant="outline">{side}</Button>} />\n          <SheetContent side={side}>\n            <SheetHeader>\n              <SheetTitle>Edit profile</SheetTitle>\n              <SheetDescription>\n                Make changes to your profile here. Click save when you&apos;re\n                done.\n              </SheetDescription>\n            </SheetHeader>\n            <div className="grid gap-4 py-4">\n              <div className="grid grid-cols-4 items-center gap-4">\n                <Label htmlFor="name" className="text-right">\n                  Name\n                </Label>\n                <Input id="name" value="Pedro Duarte" className="col-span-3" />\n              </div>\n              <div className="grid grid-cols-4 items-center gap-4">\n                <Label htmlFor="username" className="text-right">\n                  Username\n                </Label>\n                <Input id="username" value="@peduarte" className="col-span-3" />\n              </div>\n            </div>\n            <SheetFooter>\n              <SheetClose render={<Button type="submit">Save changes</Button>} />\n            </SheetFooter>\n          </SheetContent>\n        </Sheet>\n      ))}\n    </div>\n  )\n}\n',
      },
    },
  },
  render: () => (
    <div className="w-full min-w-72 max-w-2xl p-4">
      <ExampleSheetSide />
    </div>
  ),
};
