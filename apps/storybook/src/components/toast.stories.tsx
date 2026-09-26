import type { Meta, StoryObj } from "@storybook/react-vite";
import { Toast } from "@erbium/ui/components/toast";
import Demo from "./examples/toast-demo";

const meta = {
  title: "UI/Toast",
  component: Toast,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          'A succinct message that is displayed temporarily.\n\n**Import:** `@erbium/ui/components/toast`  \n\n**shadcn/ui page:** [Toast](https://ui.shadcn.com/docs/components/base/toast)\n\n### Usage\n\n```tsx\nimport { toast } from "@erbium/ui/components/toast"\n```\n\n```tsx\ntoast.add({\n  title: "Event created",\n  description: "Sunday, December 3 at 9:00 AM",\n})\n```\n\n### Types\n\nSet the `type` option to render a status icon. The built-in renderer recognizes\n\n`success`, `info`, `warning`, `error`, and `loading`.\n\n### Action\n\nPass button props with `actionProps` to render an action.\n\n```tsx\nconst id = toast.add({\n  title: "Event created",\n  actionProps: {\n    children: "Undo",\n    onClick() {\n      toast.close(id)\n    },\n  },\n})\n```\n\n### Promise\n\nUse `toast.promise` to update one toast as an asynchronous task moves through\n\nloading, success, and error states.',
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
