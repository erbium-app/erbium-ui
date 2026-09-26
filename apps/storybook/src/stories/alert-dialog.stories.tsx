import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogCancel,
} from "@erbium/ui/components/alert-dialog";
import { AlertDialogBasic } from "../examples/upstream/alert-dialog-basic";
import { AlertDialogSmall } from "../examples/upstream/alert-dialog-small";
import { AlertDialogWithMedia } from "../examples/upstream/alert-dialog-media";
import { AlertDialogSmallWithMedia } from "../examples/upstream/alert-dialog-small-media";
import { AlertDialogDestructive } from "../examples/upstream/alert-dialog-destructive";
import type { Meta, StoryObj } from "@storybook/tanstack-react";
import Demo from "../examples/alert-dialog-demo";

const meta = {
  title: "UI/Alert Dialog",
  component: AlertDialog,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          'A modal dialog that interrupts the user with important content and expects a response.\n\n**Import:** `@erbium/ui/components/alert-dialog`  \n\n**shadcn/ui page:** [Alert Dialog](https://ui.shadcn.com/docs/components/base/alert-dialog)\n\n### Usage\n\n```tsx\nimport {\n  AlertDialog,\n  AlertDialogAction,\n  AlertDialogCancel,\n  AlertDialogContent,\n  AlertDialogDescription,\n  AlertDialogFooter,\n  AlertDialogHeader,\n  AlertDialogTitle,\n  AlertDialogTrigger,\n} from "@erbium/ui/components/alert-dialog"\n```\n\n```tsx\n<AlertDialog>\n  <AlertDialogTrigger render={<Button variant="outline" />}>\n    Show Dialog\n  </AlertDialogTrigger>\n  <AlertDialogContent>\n    <AlertDialogHeader>\n      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>\n      <AlertDialogDescription>\n        This action cannot be undone. This will permanently delete your account\n        from our servers.\n      </AlertDialogDescription>\n    </AlertDialogHeader>\n    <AlertDialogFooter>\n      <AlertDialogCancel>Cancel</AlertDialogCancel>\n      <AlertDialogAction>Continue</AlertDialogAction>\n    </AlertDialogFooter>\n  </AlertDialogContent>\n</AlertDialog>\n```\n\n### Composition\n\nUse the following composition to build an `AlertDialog`:\n\n```text\nAlertDialog\n├── AlertDialogTrigger\n└── AlertDialogContent\n    ├── AlertDialogHeader\n    │   ├── AlertDialogMedia\n    │   ├── AlertDialogTitle\n    │   └── AlertDialogDescription\n    └── AlertDialogFooter\n        ├── AlertDialogCancel\n        └── AlertDialogAction\n```',
      },
    },
  },
} satisfies Meta<typeof AlertDialog>;

export default meta;
type Story = StoryObj;

export const Playground: StoryObj<{ size: "default" | "sm"; defaultOpen: boolean }> = {
  args: { size: "default", defaultOpen: false },
  argTypes: {
    size: { control: "select", options: ["default", "sm"] },
    defaultOpen: { control: "boolean" },
  },
  render: (args) => (
    <AlertDialog key={String(args.defaultOpen)} defaultOpen={args.defaultOpen}>
      <AlertDialogTrigger>Open alert dialog</AlertDialogTrigger>
      <AlertDialogContent size={args.size}>
        <AlertDialogHeader>
          <AlertDialogTitle>Confirm action</AlertDialogTitle>
          <AlertDialogDescription>This action needs confirmation.</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  ),
};

export const Overview: Story = {
  parameters: {
    docs: {
      source: {
        code: 'import {\n  AlertDialog,\n  AlertDialogAction,\n  AlertDialogCancel,\n  AlertDialogContent,\n  AlertDialogDescription,\n  AlertDialogFooter,\n  AlertDialogHeader,\n  AlertDialogTitle,\n  AlertDialogTrigger,\n} from "@erbium/ui/components/alert-dialog";\nimport { Button } from "@erbium/ui/components/button";\n\nexport default function AlertDialogDemo() {\n  return (\n    <AlertDialog>\n      <AlertDialogTrigger render={<Button variant="outline">Show Dialog</Button>} />\n      <AlertDialogContent>\n        <AlertDialogHeader>\n          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>\n          <AlertDialogDescription>\n            This action cannot be undone. This will permanently delete your account and remove your\n            data from our servers.\n          </AlertDialogDescription>\n        </AlertDialogHeader>\n        <AlertDialogFooter>\n          <AlertDialogCancel>Cancel</AlertDialogCancel>\n          <AlertDialogAction>Continue</AlertDialogAction>\n        </AlertDialogFooter>\n      </AlertDialogContent>\n    </AlertDialog>\n  );\n}\n',
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
      description: {
        story: "A basic alert dialog with a title, description, and cancel and continue buttons.",
      },
      source: {
        code: 'import {\n  AlertDialog,\n  AlertDialogAction,\n  AlertDialogCancel,\n  AlertDialogContent,\n  AlertDialogDescription,\n  AlertDialogFooter,\n  AlertDialogHeader,\n  AlertDialogTitle,\n  AlertDialogTrigger,\n} from "@erbium/ui/components/alert-dialog";\nimport { Button } from "@erbium/ui/components/button";\n\nexport function AlertDialogBasic() {\n  return (\n    <AlertDialog>\n      <AlertDialogTrigger render={<Button variant="outline">Show Dialog</Button>} />\n      <AlertDialogContent>\n        <AlertDialogHeader>\n          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>\n          <AlertDialogDescription>\n            This action cannot be undone. This will permanently delete your account and remove your\n            data from our servers.\n          </AlertDialogDescription>\n        </AlertDialogHeader>\n        <AlertDialogFooter>\n          <AlertDialogCancel>Cancel</AlertDialogCancel>\n          <AlertDialogAction>Continue</AlertDialogAction>\n        </AlertDialogFooter>\n      </AlertDialogContent>\n    </AlertDialog>\n  );\n}\n',
      },
    },
  },
  render: () => <AlertDialogBasic />,
};
export const Small: Story = {
  parameters: {
    docs: {
      description: { story: 'Use the `size="sm"` prop to make the alert dialog smaller.' },
      source: {
        code: 'import {\n  AlertDialog,\n  AlertDialogAction,\n  AlertDialogCancel,\n  AlertDialogContent,\n  AlertDialogDescription,\n  AlertDialogFooter,\n  AlertDialogHeader,\n  AlertDialogTitle,\n  AlertDialogTrigger,\n} from "@erbium/ui/components/alert-dialog";\nimport { Button } from "@erbium/ui/components/button";\n\nexport function AlertDialogSmall() {\n  return (\n    <AlertDialog>\n      <AlertDialogTrigger render={<Button variant="outline">Show Dialog</Button>} />\n      <AlertDialogContent size="sm">\n        <AlertDialogHeader>\n          <AlertDialogTitle>Allow accessory to connect?</AlertDialogTitle>\n          <AlertDialogDescription>\n            Do you want to allow the USB accessory to connect to this device?\n          </AlertDialogDescription>\n        </AlertDialogHeader>\n        <AlertDialogFooter>\n          <AlertDialogCancel>Don&apos;t allow</AlertDialogCancel>\n          <AlertDialogAction>Allow</AlertDialogAction>\n        </AlertDialogFooter>\n      </AlertDialogContent>\n    </AlertDialog>\n  );\n}\n',
      },
    },
  },
  render: () => <AlertDialogSmall />,
};
export const Media: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Use the `AlertDialogMedia` component to add a media element such as an icon or image to the alert dialog.",
      },
      source: {
        code: 'import { CircleFadingPlusIcon } from "lucide-react";\n\nimport {\n  AlertDialog,\n  AlertDialogAction,\n  AlertDialogCancel,\n  AlertDialogContent,\n  AlertDialogDescription,\n  AlertDialogFooter,\n  AlertDialogHeader,\n  AlertDialogMedia,\n  AlertDialogTitle,\n  AlertDialogTrigger,\n} from "@erbium/ui/components/alert-dialog";\nimport { Button } from "@erbium/ui/components/button";\n\nexport function AlertDialogWithMedia() {\n  return (\n    <AlertDialog>\n      <AlertDialogTrigger render={<Button variant="outline">Share Project</Button>} />\n      <AlertDialogContent>\n        <AlertDialogHeader>\n          <AlertDialogMedia>\n            <CircleFadingPlusIcon />\n          </AlertDialogMedia>\n          <AlertDialogTitle>Share this project?</AlertDialogTitle>\n          <AlertDialogDescription>\n            Anyone with the link will be able to view and edit this project.\n          </AlertDialogDescription>\n        </AlertDialogHeader>\n        <AlertDialogFooter>\n          <AlertDialogCancel>Cancel</AlertDialogCancel>\n          <AlertDialogAction>Share</AlertDialogAction>\n        </AlertDialogFooter>\n      </AlertDialogContent>\n    </AlertDialog>\n  );\n}\n',
      },
    },
  },
  render: () => <AlertDialogWithMedia />,
};
export const SmallMedia: Story = {
  name: "Small with Media",
  parameters: {
    docs: {
      description: {
        story:
          'Use the `size="sm"` prop to make the alert dialog smaller and the `AlertDialogMedia` component to add a media element such as an icon or image to the alert dialog.',
      },
      source: {
        code: 'import { BluetoothIcon } from "lucide-react";\n\nimport {\n  AlertDialog,\n  AlertDialogAction,\n  AlertDialogCancel,\n  AlertDialogContent,\n  AlertDialogDescription,\n  AlertDialogFooter,\n  AlertDialogHeader,\n  AlertDialogMedia,\n  AlertDialogTitle,\n  AlertDialogTrigger,\n} from "@erbium/ui/components/alert-dialog";\nimport { Button } from "@erbium/ui/components/button";\n\nexport function AlertDialogSmallWithMedia() {\n  return (\n    <AlertDialog>\n      <AlertDialogTrigger render={<Button variant="outline">Show Dialog</Button>} />\n\n      <AlertDialogContent size="sm">\n        <AlertDialogHeader>\n          <AlertDialogMedia>\n            <BluetoothIcon />\n          </AlertDialogMedia>\n          <AlertDialogTitle>Allow accessory to connect?</AlertDialogTitle>\n          <AlertDialogDescription>\n            Do you want to allow the USB accessory to connect to this device?\n          </AlertDialogDescription>\n        </AlertDialogHeader>\n        <AlertDialogFooter>\n          <AlertDialogCancel>Don&apos;t allow</AlertDialogCancel>\n          <AlertDialogAction>Allow</AlertDialogAction>\n        </AlertDialogFooter>\n      </AlertDialogContent>\n    </AlertDialog>\n  );\n}\n',
      },
    },
  },
  render: () => <AlertDialogSmallWithMedia />,
};
export const Destructive: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Use the `AlertDialogAction` component to add a destructive action button to the alert dialog.",
      },
      source: {
        code: 'import { Trash2Icon } from "lucide-react";\n\nimport {\n  AlertDialog,\n  AlertDialogAction,\n  AlertDialogCancel,\n  AlertDialogContent,\n  AlertDialogDescription,\n  AlertDialogFooter,\n  AlertDialogHeader,\n  AlertDialogMedia,\n  AlertDialogTitle,\n  AlertDialogTrigger,\n} from "@erbium/ui/components/alert-dialog";\nimport { Button } from "@erbium/ui/components/button";\n\nexport function AlertDialogDestructive() {\n  return (\n    <AlertDialog>\n      <AlertDialogTrigger render={<Button variant="destructive">Delete Chat</Button>} />\n      <AlertDialogContent size="sm">\n        <AlertDialogHeader>\n          <AlertDialogMedia className="bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive">\n            <Trash2Icon />\n          </AlertDialogMedia>\n          <AlertDialogTitle>Delete chat?</AlertDialogTitle>\n          <AlertDialogDescription>\n            This will permanently delete this chat conversation. View <a href="#">Settings</a>{" "}\n            delete any memories saved during this chat.\n          </AlertDialogDescription>\n        </AlertDialogHeader>\n        <AlertDialogFooter>\n          <AlertDialogCancel variant="outline">Cancel</AlertDialogCancel>\n          <AlertDialogAction variant="destructive">Delete</AlertDialogAction>\n        </AlertDialogFooter>\n      </AlertDialogContent>\n    </AlertDialog>\n  );\n}\n',
      },
    },
  },
  render: () => <AlertDialogDestructive />,
};
