import ExampleAlertDestructive from "../examples/alert-destructive";
import type { Meta, StoryObj } from "@storybook/tanstack-react";
import { Alert } from "@erbium/ui/components/alert";
import Demo from "../examples/alert-demo";

const meta = {
  title: "UI/Alert",
  component: Alert,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          'Displays a callout for user attention.\n\n**Import:** `@erbium/ui/components/alert`  \n\n**shadcn/ui page:** [Alert](https://ui.shadcn.com/docs/components/base/alert)\n\n### Usage\n\n```tsx\nimport {\n  Alert,\n  AlertAction,\n  AlertDescription,\n  AlertTitle,\n} from "@erbium/ui/components/alert"\n```\n\n```tsx\n<Alert>\n  <InfoIcon />\n  <AlertTitle>Heads up!</AlertTitle>\n  <AlertDescription>\n    You can add components and dependencies to your app using the cli.\n  </AlertDescription>\n  <AlertAction>\n    <Button variant="outline">Enable</Button>\n  </AlertAction>\n</Alert>\n```\n\n### Composition\n\nUse the following composition to build an `Alert`:\n\n```text\nAlert\n├── Icon\n├── AlertTitle\n├── AlertDescription\n└── AlertAction\n```\n\n### Basic\n\nA basic alert with an icon, title and description.\n\nstyleName="base-nova"\n\nname="alert-basic"\n\npreviewClassName="h-auto sm:h-72 p-6"\n\n/>\n\n### Destructive\n\nUse `variant="destructive"` to create a destructive alert.\n\nstyleName="base-nova"\n\nname="alert-destructive"\n\npreviewClassName="h-auto sm:h-72 p-6"\n\n/>\n\n### Action\n\nUse `AlertAction` to add a button or other action element to the alert.\n\nstyleName="base-nova"\n\nname="alert-action"\n\npreviewClassName="h-auto sm:h-72 p-6"\n\n/>\n\n### Custom Colors\n\nYou can customize the alert colors by adding custom classes such as `bg-amber-50 dark:bg-amber-950` to the `Alert` component.\n\nstyleName="base-nova"\n\nname="alert-colors"\n\npreviewClassName="h-auto sm:h-72 p-6"\n\n/>',
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
        code: 'import { AlertCircleIcon, CheckCircle2Icon, PopcornIcon } from "lucide-react";\n\nimport { Alert, AlertDescription, AlertTitle } from "@erbium/ui/components/alert";\n\nexport default function AlertDemo() {\n  return (\n    <div className="grid w-full max-w-xl items-start gap-4">\n      <Alert>\n        <CheckCircle2Icon />\n        <AlertTitle>Success! Your changes have been saved</AlertTitle>\n        <AlertDescription>This is an alert with icon, title and description.</AlertDescription>\n      </Alert>\n      <Alert>\n        <PopcornIcon />\n        <AlertTitle>This Alert has a title and an icon. No description.</AlertTitle>\n      </Alert>\n      <Alert variant="destructive">\n        <AlertCircleIcon />\n        <AlertTitle>Unable to process your payment.</AlertTitle>\n        <AlertDescription>\n          <p>Please verify your billing information and try again.</p>\n          <ul className="list-inside list-disc text-sm">\n            <li>Check your card details</li>\n            <li>Ensure sufficient funds</li>\n            <li>Verify billing address</li>\n          </ul>\n        </AlertDescription>\n      </Alert>\n    </div>\n  );\n}\n',
      },
    },
  },
  render: () => (
    <div className="w-full min-w-72 max-w-2xl p-4">
      <Demo />
    </div>
  ),
};

export const Destructive: Story = {
  parameters: {
    docs: {
      source: {
        code: 'import { AlertCircleIcon } from "lucide-react"\n\nimport {\n  Alert,\n  AlertDescription,\n  AlertTitle,\n} from "@erbium/ui/components/alert"\n\nexport default function AlertDestructive() {\n  return (\n    <Alert variant="destructive">\n      <AlertCircleIcon />\n      <AlertTitle>Error</AlertTitle>\n      <AlertDescription>\n        Your session has expired. Please log in again.\n      </AlertDescription>\n    </Alert>\n  )\n}\n',
      },
    },
  },
  render: () => (
    <div className="w-full min-w-72 max-w-2xl p-4">
      <ExampleAlertDestructive />
    </div>
  ),
};
