import { ProgressWithLabel } from "../examples/upstream/progress-label";
import { ProgressControlled } from "../examples/upstream/progress-controlled";
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
          'Displays an indicator showing the completion progress of a task, typically displayed as a progress bar.\n\n**Import:** `@erbium/ui/components/progress`  \n\n**shadcn/ui page:** [Progress](https://ui.shadcn.com/docs/components/base/progress)\n\n### Usage\n\n```tsx\nimport { Progress } from "@erbium/ui/components/progress"\n```\n\n```tsx\n<Progress value={33} />\n```\n\n### Composition\n\nUse `ProgressLabel` and `ProgressValue` to add a label and value display.\n\n```tsx\nimport {\n  Progress,\n  ProgressLabel,\n  ProgressValue,\n} from "@erbium/ui/components/progress"\n\n;<Progress value={56} className="w-full max-w-sm">\n  <ProgressLabel>Upload progress</ProgressLabel>\n  <ProgressValue />\n</Progress>\n```\n\n```text\nProgress\n├── ProgressLabel\n├── ProgressValue\n└── ProgressTrack\n    └── ProgressIndicator\n```',
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
  parameters: {
    docs: {
      description: { story: "Show a partially completed task." },
    },
  },

  render: () => <Progress value={40} className="w-64" aria-label="Upload progress" />,
};
export const Complete: Story = {
  parameters: {
    docs: {
      description: { story: "Show a completed task." },
    },
  },

  render: () => <Progress value={100} className="w-64" aria-label="Upload complete" />,
};

export const Label: Story = {
  parameters: {
    docs: {
      description: {
        story: "Use `ProgressLabel` and `ProgressValue` to add a label and value display.",
      },
      source: {
        code: 'import { Progress, ProgressLabel, ProgressValue } from "@erbium/ui/components/progress";\n\nexport function ProgressWithLabel() {\n  return (\n    <Progress value={56} className="w-full max-w-sm">\n      <ProgressLabel>Upload progress</ProgressLabel>\n      <ProgressValue />\n    </Progress>\n  );\n}\n',
      },
    },
  },
  render: () => <ProgressWithLabel />,
};
export const Controlled: Story = {
  parameters: {
    docs: {
      description: { story: "A progress bar that can be controlled by a slider." },
      source: {
        code: 'import * as React from "react";\n\nimport { Progress } from "@erbium/ui/components/progress";\nimport { Slider } from "@erbium/ui/components/slider";\n\nexport function ProgressControlled() {\n  const [value, setValue] = React.useState(50);\n\n  return (\n    <div className="flex w-full max-w-sm flex-col gap-4">\n      <Progress value={value} className="w-full" />\n      <Slider\n        value={value}\n        onValueChange={(value) => setValue(value as number)}\n        min={0}\n        max={100}\n        step={1}\n      />\n    </div>\n  );\n}\n',
      },
    },
  },
  render: () => <ProgressControlled />,
};
