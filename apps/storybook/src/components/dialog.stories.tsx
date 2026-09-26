import ExampleDialogCloseButton from "./examples/dialog-close-button";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Dialog } from "@erbium/ui/components/dialog";
import Demo from "./examples/dialog-demo";

const meta = {
  title: "UI/Dialog",
  component: Dialog,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          'A window overlaid on either the primary window or another dialog window, rendering the content underneath inert.\n\n**Import:** `@erbium/ui/components/dialog`  \n\n**shadcn/ui page:** [Dialog](https://ui.shadcn.com/docs/components/base/dialog)\n\n### Usage\n\n```tsx\nimport {\n  Dialog,\n  DialogContent,\n  DialogDescription,\n  DialogHeader,\n  DialogTitle,\n  DialogTrigger,\n} from "@erbium/ui/components/dialog"\n```\n\n```tsx\n<Dialog>\n  <DialogTrigger>Open</DialogTrigger>\n  <DialogContent>\n    <DialogHeader>\n      <DialogTitle>Are you absolutely sure?</DialogTitle>\n      <DialogDescription>\n        This action cannot be undone. This will permanently delete your account\n        and remove your data from our servers.\n      </DialogDescription>\n    </DialogHeader>\n  </DialogContent>\n</Dialog>\n```\n\n### Composition\n\nUse the following composition to build a `Dialog`:\n\n```text\nDialog\n├── DialogTrigger\n└── DialogContent\n    ├── DialogHeader\n    │   ├── DialogTitle\n    │   └── DialogDescription\n    └── DialogFooter\n```\n\n### Custom Close Button\n\nReplace the default close control with your own button.\n\n### No Close Button\n\nUse `showCloseButton={false}` to hide the close button.\n\n### Sticky Footer\n\nKeep actions visible while the content scrolls.\n\n### Scrollable Content\n\nLong content can scroll while the header stays in view.',
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
        code: 'import { Button } from "@erbium/ui/components/button";\nimport {\n  Dialog,\n  DialogClose,\n  DialogContent,\n  DialogDescription,\n  DialogFooter,\n  DialogHeader,\n  DialogTitle,\n  DialogTrigger,\n} from "@erbium/ui/components/dialog";\nimport { Input } from "@erbium/ui/components/input";\nimport { Label } from "@erbium/ui/components/label";\n\nexport default function DialogDemo() {\n  return (\n    <Dialog>\n      <form>\n        <DialogTrigger render={<Button variant="outline">Open Dialog</Button>} />\n        <DialogContent className="sm:max-w-[425px]">\n          <DialogHeader>\n            <DialogTitle>Edit profile</DialogTitle>\n            <DialogDescription>\n              Make changes to your profile here. Click save when you&apos;re done.\n            </DialogDescription>\n          </DialogHeader>\n          <div className="grid gap-4">\n            <div className="grid gap-3">\n              <Label htmlFor="name-1">Name</Label>\n              <Input id="name-1" name="name" defaultValue="Pedro Duarte" />\n            </div>\n            <div className="grid gap-3">\n              <Label htmlFor="username-1">Username</Label>\n              <Input id="username-1" name="username" defaultValue="@peduarte" />\n            </div>\n          </div>\n          <DialogFooter>\n            <DialogClose render={<Button variant="outline">Cancel</Button>} />\n            <Button type="submit">Save changes</Button>\n          </DialogFooter>\n        </DialogContent>\n      </form>\n    </Dialog>\n  );\n}\n',
      },
    },
  },
  render: () => (
    <div className="w-full min-w-72 max-w-2xl p-4">
      <Demo />
    </div>
  ),
};

export const CustomCloseButton: Story = {
  parameters: {
    docs: {
      source: {
        code: 'import { Button } from "@erbium/ui/components/button"\nimport {\n  Dialog,\n  DialogClose,\n  DialogContent,\n  DialogDescription,\n  DialogFooter,\n  DialogHeader,\n  DialogTitle,\n  DialogTrigger,\n} from "@erbium/ui/components/dialog"\nimport { Input } from "@erbium/ui/components/input"\nimport { Label } from "@erbium/ui/components/label"\n\nexport default function DialogCloseButton() {\n  return (\n    <Dialog>\n      <DialogTrigger render={<Button variant="outline">Share</Button>} />\n      <DialogContent className="sm:max-w-md">\n        <DialogHeader>\n          <DialogTitle>Share link</DialogTitle>\n          <DialogDescription>\n            Anyone who has this link will be able to view this.\n          </DialogDescription>\n        </DialogHeader>\n        <div className="flex items-center gap-2">\n          <div className="grid flex-1 gap-2">\n            <Label htmlFor="link" className="sr-only">\n              Link\n            </Label>\n            <Input\n              id="link"\n              defaultValue="https://ui.shadcn.com/docs/installation"\n              readOnly\n            />\n          </div>\n        </div>\n        <DialogFooter className="sm:justify-start">\n          <DialogClose render={<Button type="button" variant="secondary">\n              Close\n            </Button>} />\n        </DialogFooter>\n      </DialogContent>\n    </Dialog>\n  )\n}\n',
      },
    },
  },
  render: () => (
    <div className="w-full min-w-72 max-w-2xl p-4">
      <ExampleDialogCloseButton />
    </div>
  ),
};
