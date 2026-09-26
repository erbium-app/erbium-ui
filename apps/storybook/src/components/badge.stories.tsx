import type { Meta, StoryObj } from "@storybook/react-vite";
import { Badge } from "@erbium/ui/components/badge";
import Demo from "./examples/badge-demo";

const meta = {
  title: "UI/Badge",
  component: Badge,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          'Displays a badge or a component that looks like a badge.\n\n**Import:** `@erbium/ui/components/badge`  \n\n**shadcn/ui page:** [Badge](https://ui.shadcn.com/docs/components/base/badge)\n\n### Usage\n\n```tsx\nimport { Badge } from "@erbium/ui/components/badge"\n```\n\n```tsx\n<Badge variant="default | outline | secondary | destructive">Badge</Badge>\n```\n\n### Variants\n\nUse the `variant` prop to change the variant of the badge.\n\n### With Icon\n\nYou can render an icon inside the badge. Use `data-icon="inline-start"` to render the icon on the left and `data-icon="inline-end"` to render the icon on the right.\n\n### With Spinner\n\nYou can render a spinner inside the badge. Remember to add the `data-icon="inline-start"` or `data-icon="inline-end"` prop to the spinner.\n\n### Link\n\nUse the `render` prop to render a link as a badge.\n\n### Custom Colors\n\nYou can customize the colors of a badge by adding custom classes such as `bg-green-50 dark:bg-green-800` to the `Badge` component.',
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
        code: 'import { BadgeCheckIcon } from "lucide-react";\n\nimport { Badge } from "@erbium/ui/components/badge";\n\nexport default function BadgeDemo() {\n  return (\n    <div className="flex flex-col items-center gap-2">\n      <div className="flex w-full flex-wrap gap-2">\n        <Badge>Badge</Badge>\n        <Badge variant="secondary">Secondary</Badge>\n        <Badge variant="destructive">Destructive</Badge>\n        <Badge variant="outline">Outline</Badge>\n      </div>\n      <div className="flex w-full flex-wrap gap-2">\n        <Badge variant="secondary" className="bg-blue-500 text-white dark:bg-blue-600">\n          <BadgeCheckIcon />\n          Verified\n        </Badge>\n        <Badge className="h-5 min-w-5 rounded-full px-1 font-mono tabular-nums">8</Badge>\n        <Badge\n          className="h-5 min-w-5 rounded-full px-1 font-mono tabular-nums"\n          variant="destructive"\n        >\n          99\n        </Badge>\n        <Badge className="h-5 min-w-5 rounded-full px-1 font-mono tabular-nums" variant="outline">\n          20+\n        </Badge>\n      </div>\n    </div>\n  );\n}\n',
      },
    },
  },
  render: () => (
    <div className="w-full min-w-72 max-w-2xl p-4">
      <Demo />
    </div>
  ),
};

export const Variants: Story = {
  render: () => (
    <div className="flex gap-2">
      {(["default", "secondary", "outline", "destructive"] as const).map((variant) => (
        <Badge key={variant} variant={variant}>
          {variant}
        </Badge>
      ))}
    </div>
  ),
};
