import { BadgeCustomColors } from "../examples/upstream/badge-colors";
import { BadgeWithSpinner } from "../examples/upstream/badge-spinner";
import { BadgeWithIconLeft } from "../examples/upstream/badge-icon";
import { BadgeAsLink } from "../examples/upstream/badge-link";
import type { Meta, StoryObj } from "@storybook/tanstack-react";
import { Badge } from "@erbium/ui/components/badge";
import Demo from "../examples/badge-demo";

const meta = {
  title: "UI/Badge",
  component: Badge,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          'Displays a badge or a component that looks like a badge.\n\n**Import:** `@erbium/ui/components/badge`  \n\n**shadcn/ui page:** [Badge](https://ui.shadcn.com/docs/components/base/badge)\n\n### Usage\n\n```tsx\nimport { Badge } from "@erbium/ui/components/badge"\n```\n\n```tsx\n<Badge variant="default | outline | secondary | destructive">Badge</Badge>\n```',
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Playground: StoryObj<typeof Badge> = {
  args: { variant: "default", children: "Badge", className: "" },
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "secondary", "destructive", "outline", "ghost", "link"],
    },
  },
  render: (args) => <Badge {...args} />,
};

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
  parameters: {
    docs: {
      description: { story: "Use the `variant` prop to change the variant of the badge." },
    },
  },

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

export const Link: Story = {
  parameters: {
    docs: {
      description: { story: "Use the `render` prop to render a link as a badge." },
      source: {
        code: 'import { ArrowUpRightIcon } from "lucide-react";\n\nimport { Badge } from "@erbium/ui/components/badge";\n\nexport function BadgeAsLink() {\n  return (\n    <Badge render={<a href="#link" />}>\n      Open Link <ArrowUpRightIcon data-icon="inline-end" />\n    </Badge>\n  );\n}\n',
      },
    },
  },
  render: () => <BadgeAsLink />,
};

export const WithIcon: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'You can render an icon inside the badge. Use `data-icon="inline-start"` to render the icon on the left and `data-icon="inline-end"` to render the icon on the right.',
      },
      source: {
        code: 'import { BadgeCheck, BookmarkIcon } from "lucide-react";\n\nimport { Badge } from "@erbium/ui/components/badge";\n\nexport function BadgeWithIconLeft() {\n  return (\n    <div className="flex flex-wrap gap-2">\n      <Badge variant="secondary">\n        <BadgeCheck data-icon="inline-start" />\n        Verified\n      </Badge>\n      <Badge variant="outline">\n        Bookmark\n        <BookmarkIcon data-icon="inline-end" />\n      </Badge>\n    </div>\n  );\n}\n',
      },
    },
  },
  render: () => <BadgeWithIconLeft />,
};

export const WithSpinner: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'You can render a spinner inside the badge. Remember to add the `data-icon="inline-start"` or `data-icon="inline-end"` prop to the spinner.',
      },
      source: {
        code: 'import { Badge } from "@erbium/ui/components/badge";\nimport { Spinner } from "@erbium/ui/components/spinner";\n\nexport function BadgeWithSpinner() {\n  return (\n    <div className="flex flex-wrap gap-2">\n      <Badge variant="destructive">\n        <Spinner data-icon="inline-start" />\n        Deleting\n      </Badge>\n      <Badge variant="secondary">\n        Generating\n        <Spinner data-icon="inline-end" />\n      </Badge>\n    </div>\n  );\n}\n',
      },
    },
  },
  render: () => <BadgeWithSpinner />,
};

export const CustomColors: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "You can customize the colors of a badge by adding custom classes such as `bg-green-50 dark:bg-green-800` to the `Badge` component.",
      },
      source: {
        code: 'import { Badge } from "@erbium/ui/components/badge";\n\nexport function BadgeCustomColors() {\n  return (\n    <div className="flex flex-wrap gap-2">\n      <Badge className="bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300">Blue</Badge>\n      <Badge className="bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300">\n        Green\n      </Badge>\n      <Badge className="bg-sky-50 text-sky-700 dark:bg-sky-950 dark:text-sky-300">Sky</Badge>\n      <Badge className="bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-300">\n        Purple\n      </Badge>\n      <Badge className="bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300">Red</Badge>\n    </div>\n  );\n}\n',
      },
    },
  },
  render: () => <BadgeCustomColors />,
};
