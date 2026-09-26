import { ToastTypes } from "../examples/upstream/toast-types";
import { ToastPromise } from "../examples/upstream/toast-promise";
import { Button } from "@erbium/ui/components/button";
import { Toast, toast } from "@erbium/ui/components/toast";
import type { Meta, StoryObj } from "@storybook/tanstack-react";
import Demo from "../examples/toast-demo";

const meta = {
  title: "UI/Toast",
  component: Toast,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          'A succinct message that is displayed temporarily.\n\n**Import:** `@erbium/ui/components/toast`  \n\n**shadcn/ui page:** [Toast](https://ui.shadcn.com/docs/components/base/toast)\n\n### Usage\n\n```tsx\nimport { toast } from "@erbium/ui/components/toast"\n```\n\n```tsx\ntoast.add({\n  title: "Event created",\n  description: "Sunday, December 3 at 9:00 AM",\n})\n```',
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Playground: StoryObj<{
  type: "success" | "info" | "warning" | "error";
  description: string;
}> = {
  args: { type: "success", description: "Saved successfully" },
  argTypes: {
    type: { control: "select", options: ["success", "info", "warning", "error"] },
    description: { control: "text" },
  },
  render: (args) => (
    <Button onClick={() => toast.add({ type: args.type, description: args.description })}>
      Show toast
    </Button>
  ),
};

export const Overview: Story = {
  parameters: {
    docs: {
      source: {
        code: 'import { Button } from "@erbium/ui/components/button";\nimport { Toaster, toast } from "@erbium/ui/components/toast";\nexport default function Demo() {\n  return (\n    <>\n      <Button\n        onClick={() => toast.add({ title: "Saved", description: "Your changes have been saved." })}\n      >\n        Show toast\n      </Button>\n      <Toaster />\n    </>\n  );\n}\n',
      },
    },
  },
  render: () => (
    <div className="w-full min-w-72 max-w-2xl p-4">
      <Demo />
    </div>
  ),
};

export const Types: Story = {
  parameters: {
    docs: {
      description: {
        story: "Set `type` to success, info, warning, error, or loading to show a status icon.",
      },
      source: {
        code: 'import { Button } from "@erbium/ui/components/button";\nimport { toast } from "@erbium/ui/components/toast";\n\nexport function ToastTypes() {\n  return (\n    <div className="flex flex-wrap gap-2">\n      <Button\n        variant="outline"\n        onClick={() => toast.add({ description: "Event has been created." })}\n      >\n        Default\n      </Button>\n      <Button\n        variant="outline"\n        onClick={() =>\n          toast.add({\n            type: "success",\n            description: "Event has been created.",\n          })\n        }\n      >\n        Success\n      </Button>\n      <Button\n        variant="outline"\n        onClick={() =>\n          toast.add({\n            type: "info",\n            description: "Arrive 10 minutes before the event.",\n          })\n        }\n      >\n        Info\n      </Button>\n      <Button\n        variant="outline"\n        onClick={() =>\n          toast.add({\n            type: "warning",\n            description: "The event cannot start before 8:00 AM.",\n          })\n        }\n      >\n        Warning\n      </Button>\n      <Button\n        variant="outline"\n        onClick={() =>\n          toast.add({\n            type: "error",\n            description: "The event could not be created.",\n            priority: "high",\n          })\n        }\n      >\n        Error\n      </Button>\n    </div>\n  );\n}\n',
      },
    },
  },
  render: () => <ToastTypes />,
};
export const Promise: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Use `toast.promise` to update one toast as an asynchronous task moves through\n\nloading, success, and error states.",
      },
      source: {
        code: 'import { Button } from "@erbium/ui/components/button";\nimport { toast } from "@erbium/ui/components/toast";\n\nexport function ToastPromise() {\n  function showToast() {\n    void toast.promise(\n      new Promise<{ name: string }>((resolve) => {\n        window.setTimeout(() => resolve({ name: "Event" }), 2000);\n      }),\n      {\n        loading: "Creating event…",\n        success: (data) => `${data.name} created.`,\n        error: "Could not create event.",\n      },\n    );\n  }\n\n  return (\n    <Button variant="outline" onClick={showToast}>\n      Create Event\n    </Button>\n  );\n}\n',
      },
    },
  },
  render: () => <ToastPromise />,
};
export const Action: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Pass button props with `actionProps` to render an action.\n\n```tsx\nconst id = toast.add({\n  title: "Event created",\n  actionProps: {\n    children: "Undo",\n    onClick() {\n      toast.close(id)\n    },\n  },\n})\n```',
      },
    },
  },

  render: () => (
    <Button
      onClick={() =>
        toast.add({
          title: "Draft saved",
          actionProps: {
            children: "Undo",
            onClick: () => toast.add({ title: "Draft restored" }),
          },
        })
      }
    >
      Show action toast
    </Button>
  ),
};

export const Progress: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Use the ID returned by `toast.add` to update a specific toast. Call `toast.close(id)` to dismiss it.",
      },
    },
  },
  render: () => (
    <Button
      variant="outline"
      onClick={() => {
        const id = toast.add({ title: "Syncing changes…", type: "loading", timeout: 0 });
        window.setTimeout(() => {
          toast.update(id, { title: "Changes synced", type: "success", timeout: 4000 });
        }, 1200);
      }}
    >
      Show progress toast
    </Button>
  ),
};
