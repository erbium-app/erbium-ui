import ExampleSkeletonCard from "./examples/skeleton-card";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Skeleton } from "@erbium/ui/components/skeleton";
import Demo from "./examples/skeleton-demo";

const meta = {
  title: "UI/Skeleton",
  component: Skeleton,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          'Use to show a placeholder while content is loading.\n\n**Import:** `@erbium/ui/components/skeleton`  \n\n**shadcn/ui page:** [Skeleton](https://ui.shadcn.com/docs/components/base/skeleton)\n\n### Usage\n\n```tsx\nimport { Skeleton } from "@erbium/ui/components/skeleton"\n```\n\n```tsx\n<Skeleton className="h-[20px] w-[100px] rounded-full" />\n```\n\n### Avatar\n\n### Card\n\nstyleName="base-nova"\n\nname="skeleton-card"\n\npreviewClassName="h-80"\n\n/>\n\n### Text\n\n### Form\n\n### Table',
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
        code: 'import { Skeleton } from "@erbium/ui/components/skeleton";\n\nexport default function SkeletonDemo() {\n  return (\n    <div className="flex items-center space-x-4">\n      <Skeleton className="h-12 w-12 rounded-full" />\n      <div className="space-y-2">\n        <Skeleton className="h-4 w-[250px]" />\n        <Skeleton className="h-4 w-[200px]" />\n      </div>\n    </div>\n  );\n}\n',
      },
    },
  },
  render: () => (
    <div className="w-full min-w-72 max-w-2xl p-4">
      <Demo />
    </div>
  ),
};

export const LoadingCard: Story = {
  render: () => (
    <div className="flex w-64 gap-3">
      <Skeleton className="size-10 rounded-full" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </div>
    </div>
  ),
};

export const Card: Story = {
  parameters: {
    docs: {
      source: {
        code: 'import { Skeleton } from "@erbium/ui/components/skeleton"\n\nexport default function SkeletonCard() {\n  return (\n    <div className="flex flex-col space-y-3">\n      <Skeleton className="h-[125px] w-[250px] rounded-xl" />\n      <div className="space-y-2">\n        <Skeleton className="h-4 w-[250px]" />\n        <Skeleton className="h-4 w-[200px]" />\n      </div>\n    </div>\n  )\n}\n',
      },
    },
  },
  render: () => (
    <div className="w-full min-w-72 max-w-2xl p-4">
      <ExampleSkeletonCard />
    </div>
  ),
};
