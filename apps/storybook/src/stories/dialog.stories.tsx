import {
  Dialog,
  DialogTrigger,
  DialogPanel,
  DialogHeader,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@erbium/ui/components/dialog";
import { Button } from "@erbium/ui/components/button";
import { DialogNoCloseButton } from "../examples/upstream/dialog-no-close-button";
import { DialogStickyFooter } from "../examples/upstream/dialog-sticky-footer";
import { DialogScrollableContent } from "../examples/upstream/dialog-scrollable-content";
import ExampleDialogCloseButton from "../examples/dialog-close-button";
import type { Meta, StoryObj } from "@storybook/tanstack-react";
import Demo from "../examples/dialog-demo";

const meta = {
  title: "UI/Dialog",
  component: Dialog,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          'A modal dialog for focused tasks. `DialogPanel` is the popup shell; `DialogContent` is its padded, scrollable body. Place `DialogHeader`, one required `DialogContent`, and optional `DialogFooter` directly inside `DialogPanel`, in that order. The panel owns the popup and keeps the header and footer visible while the content scrolls. Header and footer separators are built in.\n\n**Import:** `@erbium/ui/components/dialog`  \n\n**shadcn/ui page:** [Dialog](https://ui.shadcn.com/docs/components/base/dialog)\n\n### Usage\n\n```tsx\nimport {\n  Dialog,\n  DialogClose,\n  DialogPanel,\n  DialogDescription,\n  DialogFooter,\n  DialogHeader,\n  DialogContent,\n  DialogTitle,\n  DialogTrigger,\n} from "@erbium/ui/components/dialog"\nimport { Button } from "@erbium/ui/components/button"\n```\n\n```tsx\n<Dialog>\n  <DialogTrigger render={<Button variant="outline">Open</Button>} />\n  <DialogPanel>\n    <DialogHeader>\n      <DialogTitle>Edit profile</DialogTitle>\n      <DialogDescription>Update your details.</DialogDescription>\n    </DialogHeader>\n    <DialogContent>Content</DialogContent>\n    <DialogFooter>Actions</DialogFooter>\n  </DialogPanel>\n</Dialog>\n```\n\n### Composition\n\n```text\nDialog\n\u251c\u2500\u2500 DialogTrigger\n\u2514\u2500\u2500 DialogPanel\n    \u251c\u2500\u2500 DialogHeader\n    \u2502   \u251c\u2500\u2500 DialogTitle\n    \u2502   \u2514\u2500\u2500 DialogDescription\n    \u251c\u2500\u2500 DialogContent\n    \u2514\u2500\u2500 DialogFooter\n```',
      },
    },
  },
} satisfies Meta<typeof Dialog>;

export default meta;
type Story = StoryObj;

export const Playground: StoryObj<{ defaultOpen: boolean; showCloseButton: boolean }> = {
  args: { defaultOpen: false, showCloseButton: true },
  argTypes: { defaultOpen: { control: "boolean" }, showCloseButton: { control: "boolean" } },
  render: (args) => (
    <Dialog key={String(args.defaultOpen)} defaultOpen={args.defaultOpen}>
      <DialogTrigger render={<Button variant="outline">Open dialog</Button>} />
      <DialogPanel showCloseButton={args.showCloseButton}>
        <DialogHeader>
          <DialogTitle>Dialog title</DialogTitle>
          <DialogDescription>Dialog description.</DialogDescription>
        </DialogHeader>
        <DialogContent>Dialog content.</DialogContent>
      </DialogPanel>
    </Dialog>
  ),
};

export const Overview: Story = {
  parameters: {
    docs: {
      source: {
        code: 'import { Button } from "@erbium/ui/components/button";\nimport {\n  Dialog,\n  DialogClose,\n  DialogPanel,\n  DialogDescription,\n  DialogFooter,\n  DialogHeader,\n  DialogContent,\n  DialogTitle,\n  DialogTrigger,\n} from "@erbium/ui/components/dialog";\nimport { Input } from "@erbium/ui/components/input";\nimport { Label } from "@erbium/ui/components/label";\nimport { StatefulButton } from "@erbium/ui/components/stateful-button";\n\nexport default function DialogDemo() {\n  return (\n    <Dialog>\n      <DialogTrigger render={<Button variant="outline">Open Dialog</Button>} />\n      <DialogPanel\n        className="sm:max-w-[425px]"\n        render={<form onSubmit={(event) => event.preventDefault()} />}\n      >\n        <DialogHeader>\n          <DialogTitle>Edit profile</DialogTitle>\n          <DialogDescription>\n            Make changes to your profile here. Click save when you&apos;re done.\n          </DialogDescription>\n        </DialogHeader>\n        <DialogContent className="grid content-start gap-4">\n          <div className="grid gap-3">\n            <Label htmlFor="name-1">Name</Label>\n            <Input id="name-1" name="name" defaultValue="Pedro Duarte" />\n          </div>\n          <div className="grid gap-3">\n            <Label htmlFor="username-1">Username</Label>\n            <Input id="username-1" name="username" defaultValue="@peduarte" />\n          </div>\n        </DialogContent>\n        <DialogFooter>\n          <DialogClose render={<Button variant="outline">Cancel</Button>} />\n          <StatefulButton type="submit">Save changes</StatefulButton>\n        </DialogFooter>\n      </DialogPanel>\n    </Dialog>\n  );\n}\n',
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
      description: { story: "Replace the default close control with your own button." },

      source: {
        code: 'import { Button } from "@erbium/ui/components/button";\nimport {\n  Dialog,\n  DialogClose,\n  DialogPanel,\n  DialogDescription,\n  DialogFooter,\n  DialogHeader,\n  DialogContent,\n  DialogTitle,\n  DialogTrigger,\n} from "@erbium/ui/components/dialog";\nimport { Input } from "@erbium/ui/components/input";\nimport { Label } from "@erbium/ui/components/label";\n\nexport default function DialogCloseButton() {\n  return (\n    <Dialog>\n      <DialogTrigger render={<Button variant="outline">Share</Button>} />\n      <DialogPanel className="sm:max-w-md">\n        <DialogHeader>\n          <DialogTitle>Share link</DialogTitle>\n          <DialogDescription>Anyone who has this link will be able to view this.</DialogDescription>\n        </DialogHeader>\n        <DialogContent className="flex items-center gap-2">\n          <div className="grid flex-1 gap-2">\n            <Label htmlFor="link" className="sr-only">\n              Link\n            </Label>\n            <Input id="link" defaultValue="https://ui.shadcn.com/docs/installation" readOnly />\n          </div>\n        </DialogContent>\n        <DialogFooter className="sm:justify-start">\n          <DialogClose\n            render={\n              <Button type="button" variant="secondary">\n                Close\n              </Button>\n            }\n          />\n        </DialogFooter>\n      </DialogPanel>\n    </Dialog>\n  );\n}\n',
      },
    },
  },
  render: () => (
    <div className="w-full min-w-72 max-w-2xl p-4">
      <ExampleDialogCloseButton />
    </div>
  ),
};

export const NoCloseButton: Story = {
  parameters: {
    docs: {
      description: { story: "Use `showCloseButton={false}` to hide the close button." },
      source: {
        code: 'import { Button } from "@erbium/ui/components/button";\nimport {\n  Dialog,\n  DialogPanel,\n  DialogContent,\n  DialogDescription,\n  DialogHeader,\n  DialogTitle,\n  DialogTrigger,\n} from "@erbium/ui/components/dialog";\n\nexport function DialogNoCloseButton() {\n  return (\n    <Dialog>\n      <DialogTrigger render={<Button variant="outline" />}>No Close Button</DialogTrigger>\n      <DialogPanel showCloseButton={false}>\n        <DialogHeader>\n          <DialogTitle>No Close Button</DialogTitle>\n          <DialogDescription>\n            This dialog doesn&apos;t have a close button in the top-right corner.\n          </DialogDescription>\n        </DialogHeader>\n        <DialogContent>Use the escape key or click outside to close.</DialogContent>\n      </DialogPanel>\n    </Dialog>\n  );\n}\n',
      },
    },
  },
  render: () => <DialogNoCloseButton />,
};
export const StickyFooter: Story = {
  parameters: {
    docs: {
      description: { story: "Keep actions visible while the content scrolls." },
      source: {
        code: 'import { Button } from "@erbium/ui/components/button";\nimport {\n  Dialog,\n  DialogClose,\n  DialogPanel,\n  DialogDescription,\n  DialogFooter,\n  DialogHeader,\n  DialogContent,\n  DialogTitle,\n  DialogTrigger,\n} from "@erbium/ui/components/dialog";\n\nexport function DialogStickyFooter() {\n  return (\n    <Dialog>\n      <DialogTrigger render={<Button variant="outline" />}>Sticky Footer</DialogTrigger>\n      <DialogPanel>\n        <DialogHeader>\n          <DialogTitle>Sticky Footer</DialogTitle>\n          <DialogDescription>\n            This dialog has a sticky footer that stays visible while the content scrolls.\n          </DialogDescription>\n        </DialogHeader>\n        <DialogContent>\n          {Array.from({ length: 10 }).map((_, index) => (\n            <p key={index} className="mb-4 leading-normal">\n              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor\n              incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud\n              exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure\n              dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.\n              Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt\n              mollit anim id est laborum.\n            </p>\n          ))}\n        </DialogContent>\n        <DialogFooter>\n          <DialogClose render={<Button variant="outline" />}>Close</DialogClose>\n        </DialogFooter>\n      </DialogPanel>\n    </Dialog>\n  );\n}\n',
      },
    },
  },
  render: () => <DialogStickyFooter />,
};
export const ScrollableContent: Story = {
  parameters: {
    docs: {
      description: { story: "Long content can scroll while the header stays in view." },
      source: {
        code: 'import { Button } from "@erbium/ui/components/button";\nimport {\n  Dialog,\n  DialogPanel,\n  DialogDescription,\n  DialogHeader,\n  DialogContent,\n  DialogTitle,\n  DialogTrigger,\n} from "@erbium/ui/components/dialog";\n\nexport function DialogScrollableContent() {\n  return (\n    <Dialog>\n      <DialogTrigger render={<Button variant="outline" />}>Scrollable Content</DialogTrigger>\n      <DialogPanel>\n        <DialogHeader>\n          <DialogTitle>Scrollable Content</DialogTitle>\n          <DialogDescription>This is a dialog with scrollable content.</DialogDescription>\n        </DialogHeader>\n        <DialogContent>\n          {Array.from({ length: 10 }).map((_, index) => (\n            <p key={index} className="mb-4 leading-normal">\n              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor\n              incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud\n              exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure\n              dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.\n              Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt\n              mollit anim id est laborum.\n            </p>\n          ))}\n        </DialogContent>\n      </DialogPanel>\n    </Dialog>\n  );\n}\n',
      },
    },
  },
  render: () => <DialogScrollableContent />,
};
