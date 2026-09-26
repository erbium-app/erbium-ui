import type { Meta, StoryObj } from "@storybook/tanstack-react";
import { AlertDialog } from "@erbium/ui/components/alert-dialog";
import Demo from "./examples/alert-dialog-demo";

const meta = {
  title: "UI/Alert Dialog",
  component: AlertDialog,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          'A modal dialog that interrupts the user with important content and expects a response.\n\n**Import:** `@erbium/ui/components/alert-dialog`  \n\n**shadcn/ui page:** [Alert Dialog](https://ui.shadcn.com/docs/components/base/alert-dialog)\n\n### Usage\n\n```tsx\nimport {\n  AlertDialog,\n  AlertDialogAction,\n  AlertDialogCancel,\n  AlertDialogContent,\n  AlertDialogDescription,\n  AlertDialogFooter,\n  AlertDialogHeader,\n  AlertDialogTitle,\n  AlertDialogTrigger,\n} from "@erbium/ui/components/alert-dialog"\n```\n\n```tsx\n<AlertDialog>\n  <AlertDialogTrigger render={<Button variant="outline" />}>\n    Show Dialog\n  </AlertDialogTrigger>\n  <AlertDialogContent>\n    <AlertDialogHeader>\n      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>\n      <AlertDialogDescription>\n        This action cannot be undone. This will permanently delete your account\n        from our servers.\n      </AlertDialogDescription>\n    </AlertDialogHeader>\n    <AlertDialogFooter>\n      <AlertDialogCancel>Cancel</AlertDialogCancel>\n      <AlertDialogAction>Continue</AlertDialogAction>\n    </AlertDialogFooter>\n  </AlertDialogContent>\n</AlertDialog>\n```\n\n### Composition\n\nUse the following composition to build an `AlertDialog`:\n\n```text\nAlertDialog\n├── AlertDialogTrigger\n└── AlertDialogContent\n    ├── AlertDialogHeader\n    │   ├── AlertDialogMedia\n    │   ├── AlertDialogTitle\n    │   └── AlertDialogDescription\n    └── AlertDialogFooter\n        ├── AlertDialogCancel\n        └── AlertDialogAction\n```\n\n### Basic\n\nA basic alert dialog with a title, description, and cancel and continue buttons.\n\nstyleName="base-nova"\n\nname="alert-dialog-basic"\n\npreviewClassName="h-56"\n\n/>\n\n### Small\n\nUse the `size="sm"` prop to make the alert dialog smaller.\n\nstyleName="base-nova"\n\nname="alert-dialog-small"\n\npreviewClassName="h-56"\n\n/>\n\n### Media\n\nUse the `AlertDialogMedia` component to add a media element such as an icon or image to the alert dialog.\n\nstyleName="base-nova"\n\nname="alert-dialog-media"\n\npreviewClassName="h-56"\n\n/>\n\n### Small with Media\n\nUse the `size="sm"` prop to make the alert dialog smaller and the `AlertDialogMedia` component to add a media element such as an icon or image to the alert dialog.\n\nstyleName="base-nova"\n\nname="alert-dialog-small-media"\n\npreviewClassName="h-56"\n\n/>\n\n### Destructive\n\nUse the `AlertDialogAction` component to add a destructive action button to the alert dialog.\n\nstyleName="base-nova"\n\nname="alert-dialog-destructive"\n\npreviewClassName="h-56"\n\n/>',
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
