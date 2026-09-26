import { SkeletonAvatar } from "../examples/upstream/skeleton-avatar";
import { SkeletonText } from "../examples/upstream/skeleton-text";
import { SkeletonForm } from "../examples/upstream/skeleton-form";
import { SkeletonTable } from "../examples/upstream/skeleton-table";
import ExampleSkeletonCard from "../examples/skeleton-card";
import type { Meta, StoryObj } from "@storybook/tanstack-react";
import { Skeleton } from "@erbium/ui/components/skeleton";
import Demo from "../examples/skeleton-demo";

const meta = {
  title: "UI/Skeleton",
  component: Skeleton,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          'Use to show a placeholder while content is loading.\n\n**Import:** `@erbium/ui/components/skeleton`  \n\n**shadcn/ui page:** [Skeleton](https://ui.shadcn.com/docs/components/base/skeleton)\n\n### Usage\n\n```tsx\nimport { Skeleton } from "@erbium/ui/components/skeleton"\n```\n\n```tsx\n<Skeleton className="h-[20px] w-[100px] rounded-full" />\n```',
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
  parameters: {
    docs: {
      description: { story: "Show a card placeholder while content loads." },
    },
  },

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
      description: { story: "Use skeleton shapes to represent a card." },

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

export const Avatar: Story = {
  parameters: {
    docs: {
      description: { story: "Use a skeleton as an avatar placeholder." },

      source: {
        code: 'import { Skeleton } from "@erbium/ui/components/skeleton";\n\nexport function SkeletonAvatar() {\n  return (\n    <div className="flex w-fit items-center gap-4">\n      <Skeleton className="size-10 shrink-0 rounded-full" />\n      <div className="grid gap-2">\n        <Skeleton className="h-4 w-[150px]" />\n        <Skeleton className="h-4 w-[100px]" />\n      </div>\n    </div>\n  );\n}\n',
      },
    },
  },
  render: () => <SkeletonAvatar />,
};
export const Text: Story = {
  parameters: {
    docs: {
      description: { story: "Use skeleton lines as a text placeholder." },

      source: {
        code: 'import { Skeleton } from "@erbium/ui/components/skeleton";\n\nexport function SkeletonText() {\n  return (\n    <div className="flex w-full max-w-xs flex-col gap-2">\n      <Skeleton className="h-4 w-full" />\n      <Skeleton className="h-4 w-full" />\n      <Skeleton className="h-4 w-3/4" />\n    </div>\n  );\n}\n',
      },
    },
  },
  render: () => <SkeletonText />,
};
export const Form: Story = {
  parameters: {
    docs: {
      description: { story: "Use skeleton shapes to represent a form." },
      source: {
        code: 'import { Skeleton } from "@erbium/ui/components/skeleton";\n\nexport function SkeletonForm() {\n  return (\n    <div className="flex w-full max-w-xs flex-col gap-7">\n      <div className="flex flex-col gap-3">\n        <Skeleton className="h-4 w-20" />\n        <Skeleton className="h-8 w-full" />\n      </div>\n      <div className="flex flex-col gap-3">\n        <Skeleton className="h-4 w-24" />\n        <Skeleton className="h-8 w-full" />\n      </div>\n      <Skeleton className="h-8 w-24" />\n    </div>\n  );\n}\n',
      },
    },
  },
  render: () => <SkeletonForm />,
};
export const Table: Story = {
  parameters: {
    docs: {
      description: { story: "Use skeleton shapes to represent a table." },

      source: {
        code: 'import { Skeleton } from "@erbium/ui/components/skeleton";\n\nexport function SkeletonTable() {\n  return (\n    <div className="flex w-full max-w-sm flex-col gap-2">\n      {Array.from({ length: 5 }).map((_, index) => (\n        <div className="flex gap-4" key={index}>\n          <Skeleton className="h-4 flex-1" />\n          <Skeleton className="h-4 w-24" />\n          <Skeleton className="h-4 w-20" />\n        </div>\n      ))}\n    </div>\n  );\n}\n',
      },
    },
  },
  render: () => <SkeletonTable />,
};
