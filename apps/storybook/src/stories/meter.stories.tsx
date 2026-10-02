import type { Meta, StoryObj } from "@storybook/tanstack-react";
import {
  Meter,
  MeterIndicator,
  MeterLabel,
  MeterTrack,
  MeterValue,
} from "@erbium/ui/components/meter";
import Demo from "../examples/meter-demo";

const meta = {
  title: "UI/Meter",
  component: Meter,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          'Shows a scalar value within a known range, such as disk usage or a score. Built on Base UI\'s `Meter`, which exposes `role="meter"` with the value, min and max. For work moving toward completion use `Progress`.\n\n**Import:** `@erbium/ui/components/meter`\n\n```tsx\nimport { Meter, MeterLabel, MeterValue } from "@erbium/ui/components/meter"\n```',
      },
    },
  },
} satisfies Meta<typeof Meter>;

export default meta;
type Story = StoryObj;

export const Playground: StoryObj<typeof Meter> = {
  args: { value: 24, min: 0, max: 100 },
  argTypes: {
    value: { control: { type: "range", min: 0, max: 100, step: 1 } },
    min: { control: "number" },
    max: { control: "number" },
  },
  render: (args) => (
    <Meter {...args} className="w-72" aria-label="Storage used">
      <MeterTrack>
        <MeterIndicator />
      </MeterTrack>
    </Meter>
  ),
};

export const Overview: Story = {
  parameters: {
    docs: {
      source: {
        code: 'import {\n  Meter,\n  MeterIndicator,\n  MeterLabel,\n  MeterTrack,\n  MeterValue,\n} from "@erbium/ui/components/meter";\n\nexport default function MeterDemo() {\n  return (\n    <Meter value={24} className="w-72">\n      <MeterLabel>Storage used</MeterLabel>\n      <MeterValue />\n      <MeterTrack>\n        <MeterIndicator />\n      </MeterTrack>\n    </Meter>\n  );\n}\n',
      },
    },
  },
  render: () => <Demo />,
};

export const Range: Story = {
  parameters: {
    docs: {
      description: {
        story: "Set `min`, `max` and `format` to show the value in its own units.",
      },
    },
  },
  render: () => (
    <Meter
      value={72}
      min={0}
      max={100}
      format={{ style: "unit", unit: "percent" }}
      className="w-72"
    >
      <MeterLabel>Battery</MeterLabel>
      <MeterValue />
      <MeterTrack>
        <MeterIndicator />
      </MeterTrack>
    </Meter>
  ),
};
