import { SliderMultiple } from "../examples/upstream/slider-multiple";
import { SliderRange } from "../examples/upstream/slider-range";
import { SliderVertical } from "../examples/upstream/slider-vertical";
import { SliderControlled } from "../examples/upstream/slider-controlled";
import type { Meta, StoryObj } from "@storybook/tanstack-react";
import { Slider } from "@erbium/ui/components/slider";
import Demo from "../examples/slider-demo";

const meta = {
  title: "UI/Slider",
  component: Slider,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          'An input where the user selects a value from within a given range.\n\n**Import:** `@erbium/ui/components/slider`  \n\n**shadcn/ui page:** [Slider](https://ui.shadcn.com/docs/components/base/slider)\n\n### Usage\n\n```tsx\nimport { Slider } from "@erbium/ui/components/slider"\n```\n\n```tsx\n<Slider defaultValue={[33]} max={100} step={1} />\n```',
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Playground: StoryObj<typeof Slider> = {
  args: { defaultValue: [50], min: 0, max: 100, step: 1, disabled: false },
  argTypes: {
    min: { control: "number" },
    max: { control: "number" },
    step: { control: "number" },
    disabled: { control: "boolean" },
    defaultValue: { control: "object" },
  },
  render: (args) => (
    <Slider key={JSON.stringify(args.defaultValue)} {...args} className="w-64" aria-label="Value" />
  ),
};

export const Overview: Story = {
  parameters: {
    docs: {
      source: {
        code: 'import { cn } from "@erbium/ui/lib/utils";\n\nimport { Slider } from "@erbium/ui/components/slider";\n\ntype SliderProps = React.ComponentProps<typeof Slider>;\n\nexport default function SliderDemo({ className, ...props }: SliderProps) {\n  return (\n    <Slider\n      defaultValue={[50]}\n      max={100}\n      step={1}\n      className={cn("w-[60%]", className)}\n      {...props}\n    />\n  );\n}\n',
      },
    },
  },
  render: () => (
    <div className="w-full min-w-72 max-w-2xl p-4">
      <Demo />
    </div>
  ),
};

export const Midpoint: Story = {
  parameters: {
    docs: {
      description: { story: "Start a slider at its midpoint." },
    },
  },

  render: () => <Slider defaultValue={[50]} max={100} className="w-64" aria-label="Volume" />,
};
export const Disabled: Story = {
  parameters: {
    docs: {
      description: { story: "Use the `disabled` prop to disable the slider." },
    },
  },

  render: () => (
    <Slider disabled defaultValue={[50]} max={100} className="w-64" aria-label="Unavailable" />
  ),
};

export const Range: Story = {
  parameters: {
    docs: {
      description: { story: "Use an array with two values for a range slider." },
      source: {
        code: 'import { Slider } from "@erbium/ui/components/slider";\n\nexport function SliderRange() {\n  return <Slider defaultValue={[25, 50]} max={100} step={5} className="mx-auto w-full max-w-xs" />;\n}\n',
      },
    },
  },
  render: () => <SliderRange />,
};
export const Vertical: Story = {
  parameters: {
    docs: {
      description: { story: 'Use `orientation="vertical"` for a vertical slider.' },
      source: {
        code: 'import { Slider } from "@erbium/ui/components/slider";\n\nexport function SliderVertical() {\n  return (\n    <div className="mx-auto flex w-full max-w-xs items-center justify-center gap-6">\n      <Slider defaultValue={[50]} max={100} step={1} orientation="vertical" className="h-40" />\n      <Slider defaultValue={[25]} max={100} step={1} orientation="vertical" className="h-40" />\n    </div>\n  );\n}\n',
      },
    },
  },
  render: () => <SliderVertical />,
};
export const Controlled: Story = {
  parameters: {
    docs: {
      description: { story: "Control a slider value with React state." },

      source: {
        code: 'import * as React from "react";\n\nimport { Label } from "@erbium/ui/components/label";\nimport { Slider } from "@erbium/ui/components/slider";\n\nexport function SliderControlled() {\n  const [value, setValue] = React.useState([0.3, 0.7]);\n\n  return (\n    <div className="mx-auto grid w-full max-w-xs gap-3">\n      <div className="flex items-center justify-between gap-2">\n        <Label htmlFor="slider-demo-temperature">Temperature</Label>\n        <span className="text-sm text-muted-foreground">{value.join(", ")}</span>\n      </div>\n      <Slider\n        id="slider-demo-temperature"\n        value={value}\n        onValueChange={(value) => setValue(value as number[])}\n        min={0}\n        max={1}\n        step={0.1}\n      />\n    </div>\n  );\n}\n',
      },
    },
  },
  render: () => <SliderControlled />,
};

export const MultipleThumbs: Story = {
  parameters: {
    docs: {
      description: { story: "Use an array with multiple values for multiple thumbs." },
      source: {
        code: 'import { Slider } from "@erbium/ui/components/slider";\n\nexport function SliderMultiple() {\n  return (\n    <Slider defaultValue={[10, 20, 70]} max={100} step={10} className="mx-auto w-full max-w-xs" />\n  );\n}\n',
      },
    },
  },
  render: () => <SliderMultiple />,
};
