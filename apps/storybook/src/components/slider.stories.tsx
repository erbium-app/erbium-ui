import type { Meta, StoryObj } from "@storybook/react-vite";
import { Slider } from "@erbium/ui/components/slider";
import Demo from "./examples/slider-demo";

const meta = {
  title: "UI/Slider",
  component: Slider,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          'An input where the user selects a value from within a given range.\n\n**Import:** `@erbium/ui/components/slider`  \n\n**shadcn/ui page:** [Slider](https://ui.shadcn.com/docs/components/base/slider)\n\n### Usage\n\n```tsx\nimport { Slider } from "@erbium/ui/components/slider"\n```\n\n```tsx\n<Slider defaultValue={[33]} max={100} step={1} />\n```\n\n### Range\n\nUse an array with two values for a range slider.\n\n### Multiple Thumbs\n\nUse an array with multiple values for multiple thumbs.\n\n### Vertical\n\nUse `orientation="vertical"` for a vertical slider.\n\n### Controlled\n\n### Disabled\n\nUse the `disabled` prop to disable the slider.',
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
  render: () => <Slider defaultValue={[50]} max={100} className="w-64" aria-label="Volume" />,
};
export const Disabled: Story = {
  render: () => (
    <Slider disabled defaultValue={[50]} max={100} className="w-64" aria-label="Unavailable" />
  ),
};
