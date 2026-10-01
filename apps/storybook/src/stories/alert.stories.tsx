import AlertColors from "../examples/upstream/alert-colors";
import ExampleAlertDestructive from "../examples/alert-destructive";
import type { Meta, StoryObj } from "@storybook/tanstack-react";
import { Alert, AlertAction, AlertDescription, AlertTitle } from "@erbium/ui/components/alert";
import { Button } from "@erbium/ui/components/button";
import Demo from "../examples/alert-demo";

const alertContent = {
  default: {
    title: "Workspace connected",
    description: "The agent can read the app and package files for this task.",
  },
  destructive: {
    title: "Tool call failed",
    description: "The agent could not run the test suite. Check the workspace process.",
  },
  info: {
    title: "Plan ready",
    description: "The agent identified three files to update before writing code.",
  },
  success: {
    title: "Verification passed",
    description: "Type checks and 42 tests passed after the changes.",
  },
  warning: {
    title: "Approval required",
    description: "The agent needs permission to install a new dependency.",
  },
};

const meta = {
  title: "UI/Alert",
  component: Alert,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          'Displays a callout for agent activity, decisions, and failures. Each variant supplies its own icon.\n\n**Import:** `@erbium/ui/components/alert`  \n\n**shadcn/ui page:** [Alert](https://ui.shadcn.com/docs/components/base/alert)\n\n### Usage\n\n```tsx\nimport {\n  Alert,\n  AlertAction,\n  AlertDescription,\n  AlertTitle,\n} from "@erbium/ui/components/alert"\n```\n\n```tsx\n<Alert variant="warning">\n  <AlertTitle>Approval required</AlertTitle>\n  <AlertDescription>\n    The agent needs permission to install a new dependency.\n  </AlertDescription>\n  <AlertAction>\n    <Button variant="outline">Review</Button>\n  </AlertAction>\n</Alert>\n```\n\n### Composition\n\nUse the following composition to build an `Alert`:\n\n```text\nAlert\n├── AlertTitle\n├── AlertDescription\n└── AlertAction\n```',
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
  render: (args) => {
    const content = alertContent[args.variant ?? "default"];

    return (
      <Alert {...args} className={`w-96 ${args.className ?? ""}`}>
        <AlertTitle>{content.title}</AlertTitle>
        <AlertDescription>{content.description}</AlertDescription>
      </Alert>
    );
  },
};

export const Overview: Story = {
  parameters: {
    docs: {
      source: {
        code: 'import { Alert, AlertDescription, AlertTitle } from "@erbium/ui/components/alert";\n\nexport default function AlertDemo() {\n  return (\n    <section className="w-full max-w-2xl overflow-hidden rounded-xl border surface-panel">\n      <header className="border-b border-transparent px-5 py-4">\n        <p className="text-xs font-medium text-muted-foreground">NOVA / AGENT WORKSPACE</p>\n        <h2 className="mt-1 font-heading text-lg font-semibold">Refactor the billing flow</h2>\n        <p className="mt-1 text-sm text-muted-foreground">\n          Agent activity across planning, tools, and verification\n        </p>\n      </header>\n      <div className="grid gap-3 p-5">\n        <Alert>\n          <AlertTitle>Workspace connected</AlertTitle>\n          <AlertDescription>\n            The agent can read the app and package files for this task.\n          </AlertDescription>\n        </Alert>\n        <Alert variant="info">\n          <AlertTitle>Plan ready</AlertTitle>\n          <AlertDescription>\n            The agent identified three files to update before writing code.\n          </AlertDescription>\n        </Alert>\n        <Alert variant="success">\n          <AlertTitle>Verification passed</AlertTitle>\n          <AlertDescription>Type checks and 42 tests passed after the changes.</AlertDescription>\n        </Alert>\n        <Alert variant="warning">\n          <AlertTitle>Approval required</AlertTitle>\n          <AlertDescription>\n            The agent needs permission to install a new dependency.\n          </AlertDescription>\n        </Alert>\n        <Alert variant="destructive">\n          <AlertTitle>Browser preview failed</AlertTitle>\n          <AlertDescription>\n            The preview server did not start. Check the build log and retry.\n          </AlertDescription>\n        </Alert>\n      </div>\n    </section>\n  );\n}\n',
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
      description: { story: 'Use `variant="destructive"` when an agent action fails.' },

      source: {
        code: 'import { Alert, AlertDescription, AlertTitle } from "@erbium/ui/components/alert";\n\nexport default function AlertDestructive() {\n  return (\n    <Alert variant="destructive">\n      <AlertTitle>Tool call failed</AlertTitle>\n      <AlertDescription>\n        The agent could not run the test suite. The workspace process exited before returning\n        results.\n      </AlertDescription>\n    </Alert>\n  );\n}\n',
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
      description: { story: "The default alert reports neutral workspace status." },
    },
  },

  render: () => (
    <Alert className="w-80">
      <AlertTitle>Workspace connected</AlertTitle>
      <AlertDescription>The agent can read the files in this project.</AlertDescription>
    </Alert>
  ),
};

export const Info: Story = {
  parameters: {
    docs: {
      description: { story: 'Use `variant="info"` for useful agent progress updates.' },
    },
  },
  render: () => (
    <Alert variant="info" className="w-96">
      <AlertTitle>Plan ready</AlertTitle>
      <AlertDescription>
        The agent identified three files to update before writing code.
      </AlertDescription>
    </Alert>
  ),
};

export const Success: Story = {
  parameters: {
    docs: {
      description: { story: 'Use `variant="success"` when a task or verification step completes.' },
    },
  },
  render: () => (
    <Alert variant="success" className="w-96">
      <AlertTitle>Verification passed</AlertTitle>
      <AlertDescription>Type checks and 42 tests passed after the changes.</AlertDescription>
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
    <Alert variant="warning" className="w-96">
      <AlertTitle>Approval required</AlertTitle>
      <AlertDescription>The agent needs permission to install a new dependency.</AlertDescription>
      <AlertAction>
        <Button size="sm" variant="outline">
          Review
        </Button>
      </AlertAction>
    </Alert>
  ),
};

export const Warning: Story = {
  parameters: {
    docs: {
      description: { story: 'Use `variant="warning"` when the agent may need attention soon.' },
      source: {
        code: 'import { Alert, AlertDescription, AlertTitle } from "@erbium/ui/components/alert";\n\nexport default function AlertColors() {\n  return (\n    <Alert variant="warning" className="max-w-md">\n      <AlertTitle>Context window nearly full</AlertTitle>\n      <AlertDescription>\n        The agent may need to summarize this conversation before continuing the task.\n      </AlertDescription>\n    </Alert>\n  );\n}\n',
      },
    },
  },
  render: () => <AlertColors />,
};
