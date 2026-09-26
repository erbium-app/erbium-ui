import type { Meta, StoryObj } from "@storybook/tanstack-react";
import { DirectionProvider } from "@erbium/ui/components/direction";
import Demo from "../examples/direction-demo";

const meta = {
  title: "UI/Direction",
  component: DirectionProvider,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          'A provider component that sets the text direction for your application.\n\n**Import:** `@erbium/ui/components/direction`  \n\n**shadcn/ui page:** [Direction](https://ui.shadcn.com/docs/components/base/direction)\n\n### Usage\n\n```tsx\nimport { DirectionProvider } from "@erbium/ui/components/direction"\n```\n\n```tsx\n<html dir="rtl">\n  <body>\n    <DirectionProvider direction="rtl">\n      {/* Your app content */}\n    </DirectionProvider>\n  </body>\n</html>\n```\n\n### useDirection\n\nThe `useDirection` hook is used to get the current direction of the application.\n\n```tsx\nimport { useDirection } from "@erbium/ui/components/direction"\n\nfunction MyComponent() {\n  const direction = useDirection()\n  return <div>Current direction: {direction}</div>\n}\n```',
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Playground: StoryObj<{ direction: "ltr" | "rtl" }> = {
  args: { direction: "ltr" },
  argTypes: { direction: { control: "select", options: ["ltr", "rtl"] } },
  render: (args) => (
    <DirectionProvider direction={args.direction}>
      <div dir={args.direction} className="w-72 rounded border p-4">
        Direction: {args.direction}
        <div className="mt-2 flex gap-2">
          <button className="rounded border p-2">First</button>
          <button className="rounded border p-2">Second</button>
        </div>
      </div>
    </DirectionProvider>
  ),
};

export const Overview: Story = {
  parameters: {
    docs: {
      source: {
        code: 'import { DirectionProvider } from "@erbium/ui/components/direction";\nimport { Button } from "@erbium/ui/components/button";\nexport default function Demo() {\n  return (\n    <div className="flex gap-8">\n      <DirectionProvider direction="ltr">\n        <Button>Left to right</Button>\n      </DirectionProvider>\n      <DirectionProvider direction="rtl">\n        <Button>من اليمين إلى اليسار</Button>\n      </DirectionProvider>\n    </div>\n  );\n}\n',
      },
    },
  },
  render: () => (
    <div className="w-full min-w-72 max-w-2xl p-4">
      <Demo />
    </div>
  ),
};
