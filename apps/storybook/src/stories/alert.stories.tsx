import AlertColors from "../examples/upstream/alert-colors";
import ExampleAlertDestructive from "../examples/alert-destructive";
import { HugeiconsIcon } from "@hugeicons/react";
import CircleCheckIcon from "@hugeicons/core-free-icons/CircleCheckIcon";
import InfoIcon from "@hugeicons/core-free-icons/InfoIcon";
import TriangleAlertIcon from "@hugeicons/core-free-icons/TriangleAlertIcon";

import type { Meta, StoryObj } from "@storybook/tanstack-react";
import { Alert, AlertAction, AlertDescription, AlertTitle } from "@erbium/ui/components/alert";
import { Button } from "@erbium/ui/components/button";
import Demo from "../examples/alert-demo";

const meta = {
  title: "UI/Alert",
  component: Alert,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          'Displays a callout for user attention.\n\n**Import:** `@erbium/ui/components/alert`  \n\n**shadcn/ui page:** [Alert](https://ui.shadcn.com/docs/components/base/alert)\n\n### Usage\n\n```tsx\nimport {\n  Alert,\n  AlertAction,\n  AlertDescription,\n  AlertTitle,\n} from "@erbium/ui/components/alert"\n```\n\n```tsx\n<Alert>\n  <InfoIcon />\n  <AlertTitle>Heads up!</AlertTitle>\n  <AlertDescription>\n    You can add components and dependencies to your app using the cli.\n  </AlertDescription>\n  <AlertAction>\n    <Button variant="outline">Enable</Button>\n  </AlertAction>\n</Alert>\n```\n\n### Composition\n\nUse the following composition to build an `Alert`:\n\n```text\nAlert\n├── Icon\n├── AlertTitle\n├── AlertDescription\n└── AlertAction\n```',
      },
    },
  },
} satisfies Meta<typeof Alert>;

export default meta;
type Story = StoryObj;

export const Playground: StoryObj<typeof Alert> = {
  args: { variant: "default", className: "" },
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "destructive", "info", "success", "warning"],
    },
  },
  render: (args) => (
    <Alert {...args} className={`w-96 ${args.className ?? ""}`}>
      <HugeiconsIcon icon={InfoIcon} />
      <AlertTitle>Heads up!</AlertTitle>
      <AlertDescription>You can add components with the CLI.</AlertDescription>
    </Alert>
  ),
};

export const Overview: Story = {
  parameters: {
    docs: {
      source: {
        code: 'import { HugeiconsIcon } from "@hugeicons/react";\nimport AlertCircleIcon from "@hugeicons/core-free-icons/AlertCircleIcon";\nimport CircleCheckIcon from "@hugeicons/core-free-icons/CircleCheckIcon";\nimport PopcornIcon from "@hugeicons/core-free-icons/PopcornIcon";\n\n\nimport { Alert, AlertDescription, AlertTitle } from "@erbium/ui/components/alert";\n\nexport default function AlertDemo() {\n  return (\n    <div className="grid w-full max-w-xl items-start gap-4">\n      <Alert>\n        <HugeiconsIcon icon={CircleCheckIcon} />\n        <AlertTitle>Success! Your changes have been saved</AlertTitle>\n        <AlertDescription>This is an alert with icon, title and description.</AlertDescription>\n      </Alert>\n      <Alert>\n        <HugeiconsIcon icon={PopcornIcon} />\n        <AlertTitle>This Alert has a title and an icon. No description.</AlertTitle>\n      </Alert>\n      <Alert variant="destructive">\n        <HugeiconsIcon icon={AlertCircleIcon} />\n        <AlertTitle>Unable to process your payment.</AlertTitle>\n        <AlertDescription>\n          <p>Please verify your billing information and try again.</p>\n          <ul className="list-inside list-disc text-sm">\n            <li>Check your card details</li>\n            <li>Ensure sufficient funds</li>\n            <li>Verify billing address</li>\n          </ul>\n        </AlertDescription>\n      </Alert>\n    </div>\n  );\n}\n',
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
      description: { story: 'Use `variant="destructive"` to create a destructive alert.' },

      source: {
        code: 'import { HugeiconsIcon } from "@hugeicons/react";\nimport AlertCircleIcon from "@hugeicons/core-free-icons/AlertCircleIcon";\n\n\nimport {\n  Alert,\n  AlertDescription,\n  AlertTitle,\n} from "@erbium/ui/components/alert"\n\nexport default function AlertDestructive() {\n  return (\n    <Alert variant="destructive">\n      <HugeiconsIcon icon={AlertCircleIcon} />\n      <AlertTitle>Error</AlertTitle>\n      <AlertDescription>\n        Your session has expired. Please log in again.\n      </AlertDescription>\n    </Alert>\n  )\n}\n',
      },
    },
  },
  render: () => (
    <div className="w-full min-w-72 max-w-2xl p-4">
      <ExampleAlertDestructive />
    </div>
  ),
};

export const Basic: Story = {
  parameters: {
    docs: {
      description: { story: "A basic alert with an icon, title and description." },
    },
  },

  render: () => (
    <Alert className="w-80">
      <HugeiconsIcon icon={InfoIcon} />
      <AlertTitle>Heads up!</AlertTitle>
      <AlertDescription>You can add components and dependencies using the CLI.</AlertDescription>
    </Alert>
  ),
};

export const Action: Story = {
  parameters: {
    docs: {
      description: {
        story: "Use `AlertAction` to add a button or other action element to the alert.",
      },
    },
  },

  render: () => (
    <Alert className="w-96">
      <HugeiconsIcon icon={CircleCheckIcon} />
      <AlertTitle>Update available</AlertTitle>
      <AlertDescription>A new version is ready to install.</AlertDescription>
      <AlertAction>
        <Button size="sm" variant="outline">
          Update
        </Button>
      </AlertAction>
    </Alert>
  ),
};

export const CustomColors: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "You can customize the alert colors by adding custom classes such as `bg-warning-soft` to the `Alert` component.",
      },
    },
  },

  render: () => (
    <Alert className="w-80 border-warning bg-warning-soft text-warning-soft-foreground">
      <HugeiconsIcon icon={TriangleAlertIcon} />
      <AlertTitle>Scheduled maintenance</AlertTitle>
      <AlertDescription className="text-inherit">
        The service will be briefly unavailable tonight.
      </AlertDescription>
    </Alert>
  ),
};

export const Colors: Story = {
  parameters: {
    docs: {
      description: { story: "Compare alerts with different semantic color treatments." },
      source: {
        code: 'import { HugeiconsIcon } from "@hugeicons/react";\nimport Alert01Icon from "@hugeicons/core-free-icons/Alert01Icon";\n\n\nimport { Alert, AlertDescription, AlertTitle } from "@erbium/ui/components/alert";\n\nexport default function AlertColors() {\n  return (\n    <Alert className="max-w-md border-warning bg-warning-soft text-warning-soft-foreground">\n      <HugeiconsIcon icon={Alert01Icon} />\n      <AlertTitle>Your subscription will expire in 3 days.</AlertTitle>\n      <AlertDescription>\n        Renew now to avoid service interruption or upgrade to a paid plan to continue using the\n        service.\n      </AlertDescription>\n    </Alert>\n  );\n}\n',
      },
    },
  },
  render: () => <AlertColors />,
};
