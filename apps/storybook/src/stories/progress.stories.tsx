import type { Meta, StoryObj } from "@storybook/tanstack-react";
import { Progress } from "@erbium/ui/components/progress";
import Demo from "../examples/progress-demo";

const meta = {
  title: "UI/Progress",
  component: Progress,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          'Displays an indicator showing the completion progress of a task, typically displayed as a progress bar.\n\n**Import:** `@erbium/ui/components/progress`  \n\n**shadcn/ui page:** [Progress](https://ui.shadcn.com/docs/components/base/progress)\n\n### Usage\n\n```tsx\nimport { Progress } from "@erbium/ui/components/progress"\n```\n\n```tsx\n<Progress value={33} />\n```\n\n### Composition\n\nUse `ProgressLabel` and `ProgressValue` to add a label and value display.\n\n```tsx\nimport {\n  Progress,\n  ProgressLabel,\n  ProgressValue,\n} from "@erbium/ui/components/progress"\n\n;<Progress value={56} className="w-full max-w-sm">\n  <ProgressLabel>Upload progress</ProgressLabel>\n  <ProgressValue />\n</Progress>\n```\n\n```text\nProgress\n├── ProgressLabel\n├── ProgressValue\n└── ProgressTrack\n    └── ProgressIndicator\n```\n\n### Label\n\nUse `ProgressLabel` and `ProgressValue` to add a label and value display.\n\n### Controlled\n\nA progress bar that can be controlled by a slider.',
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
        code: 'import * as React from "react";\n\nimport { Progress } from "@erbium/ui/components/progress";\n\nexport default function ProgressDemo() {\n  const [progress, setProgress] = React.useState(13);\n\n  React.useEffect(() => {\n    const timer = setTimeout(() => setProgress(66), 500);\n    return () => clearTimeout(timer);\n  }, []);\n\n  return <Progress value={progress} className="w-[60%]" />;\n}\n',
      },
    },
  },
  render: () => (
    <div className="w-full min-w-72 max-w-2xl p-4">
      <Demo />
    </div>
  ),
};

export const Partial: Story = {
  render: () => <Progress value={40} className="w-64" aria-label="Upload progress" />,
};
export const Complete: Story = {
  render: () => <Progress value={100} className="w-64" aria-label="Upload complete" />,
};
