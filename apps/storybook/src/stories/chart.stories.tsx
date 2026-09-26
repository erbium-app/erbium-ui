import { ChartExample } from "../examples/upstream/chart-example";
import { ChartBarDemoGrid } from "../examples/upstream/chart-example-grid";
import { ChartBarDemoAxis } from "../examples/upstream/chart-example-axis";
import { ChartBarDemoTooltip } from "../examples/upstream/chart-example-tooltip";
import { ChartBarDemoLegend } from "../examples/upstream/chart-example-legend";
import type { Meta, StoryObj } from "@storybook/tanstack-react";
import { Chart } from "@erbium/ui/components/chart";
import Demo from "../examples/chart-demo";

const meta = {
  title: "UI/Chart",
  component: Chart,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `Charts use [TanStack Charts](https://tanstack.com/charts) definitions. Import \`Chart\` from \`@erbium/ui/components/chart\`, then create marks and scales with \`@tanstack/charts\`. Define colors, axes, grid, focus, tooltip, and legend in the chart definition. Set a height and an accessible label on each chart. See the example stories for working compositions.`,
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
        code: 'import { barY, defineChart, group } from "@tanstack/charts";\nimport { scaleBand } from "@tanstack/charts/scales/band";\nimport { scaleLinear } from "@tanstack/charts/scales/linear";\nimport { scaleOrdinal } from "@tanstack/charts/scales/ordinal";\nimport { tooltip } from "@tanstack/charts/tooltip";\nimport { colorLegend } from "@tanstack/charts/legend";\nimport { Chart } from "@erbium/ui/components/chart";\n\nconst monthlyVisitors = [\n  { month: "January", desktop: 186, mobile: 80 },\n  { month: "February", desktop: 305, mobile: 200 },\n  { month: "March", desktop: 237, mobile: 120 },\n  { month: "April", desktop: 73, mobile: 190 },\n  { month: "May", desktop: 209, mobile: 130 },\n  { month: "June", desktop: 214, mobile: 140 },\n];\n\nconst visitors = monthlyVisitors.flatMap(({ month, desktop, mobile }) => [\n  { month, device: "Desktop", visitors: desktop },\n  { month, device: "Mobile", visitors: mobile },\n]);\n\nexport function visitorChart(\n  options: { grid?: boolean; axis?: boolean; tooltip?: boolean; legend?: boolean } = {},\n) {\n  return defineChart({\n    marks: [\n      barY(visitors, {\n        x: "month",\n        y: "visitors",\n        z: "device",\n        color: "device",\n        layout: group({ padding: 0.12 }),\n        radius: 4,\n        inset: 1,\n      }),\n    ],\n    scales: {\n      x: {\n        scale: scaleBand,\n        axis: options.axis ? { ticks: { format: (value: string) => value.slice(0, 3) } } : false,\n      },\n      y: { scale: scaleLinear, nice: true, grid: options.grid },\n    },\n    color: {\n      scale: scaleOrdinal(["Desktop", "Mobile"], ["#2563eb", "#60a5fa"]),\n      ...(options.legend ? { legend: colorLegend({ label: "Device" }) } : {}),\n    },\n    ...(options.tooltip ? { focus: "group-x" as const, tooltip: { use: tooltip } } : {}),\n  });\n}\n\nexport default function Demo() {\n  return (\n    <Chart\n      definition={visitorChart({ grid: true, axis: true, tooltip: true, legend: true })}\n      height={240}\n      initialWidth={640}\n      ariaLabel="Desktop and mobile visitors by month"\n    />\n  );\n}\n',
      },
    },
  },
  render: () => (
    <div className="w-full min-w-72 max-w-2xl p-4">
      <Demo />
    </div>
  ),
};

export const Example: Story = {
  parameters: {
    docs: {
      description: { story: "A chart with the default configuration." },
      source: {
        code: 'import { barY, defineChart, group } from "@tanstack/charts";\nimport { scaleBand } from "@tanstack/charts/scales/band";\nimport { scaleLinear } from "@tanstack/charts/scales/linear";\nimport { scaleOrdinal } from "@tanstack/charts/scales/ordinal";\nimport { tooltip } from "@tanstack/charts/tooltip";\nimport { colorLegend } from "@tanstack/charts/legend";\nimport { Chart } from "@erbium/ui/components/chart";\n\nconst monthlyVisitors = [\n  { month: "January", desktop: 186, mobile: 80 },\n  { month: "February", desktop: 305, mobile: 200 },\n  { month: "March", desktop: 237, mobile: 120 },\n  { month: "April", desktop: 73, mobile: 190 },\n  { month: "May", desktop: 209, mobile: 130 },\n  { month: "June", desktop: 214, mobile: 140 },\n];\n\nconst visitors = monthlyVisitors.flatMap(({ month, desktop, mobile }) => [\n  { month, device: "Desktop", visitors: desktop },\n  { month, device: "Mobile", visitors: mobile },\n]);\n\nexport function visitorChart(options: { grid?: boolean; axis?: boolean; tooltip?: boolean; legend?: boolean } = {}) {\n  return defineChart({\n    marks: [barY(visitors, {\n      x: "month",\n      y: "visitors",\n      z: "device",\n      color: "device",\n      layout: group({ padding: 0.12 }),\n      radius: 4,\n      inset: 1,\n    })],\n    scales: {\n      x: { scale: scaleBand, axis: options.axis ? { ticks: { format: (value: string) => value.slice(0, 3) } } : false },\n      y: { scale: scaleLinear, nice: true, grid: options.grid },\n    },\n    color: {\n      scale: scaleOrdinal(["Desktop", "Mobile"], ["#2563eb", "#60a5fa"]),\n      ...(options.legend ? { legend: colorLegend({ label: "Device" }) } : {}),\n    },\n    ...(options.tooltip ? { focus: "group-x" as const, tooltip: { use: tooltip } } : {}),\n  });\n}\n\nexport function ChartExample() {\n  return <Chart definition={visitorChart()} height={240} initialWidth={640} ariaLabel="Desktop and mobile visitors by month" />;\n}\n',
      },
    },
  },
  render: () => <ChartExample />,
};
export const ExampleGrid: Story = {
  parameters: {
    docs: {
      description: { story: "Show grid lines in a chart." },
      source: {
        code: 'import { Chart } from "@erbium/ui/components/chart";\nimport { visitorChart } from "./chart-example";\n\nexport function ChartBarDemoGrid() {\n  return <Chart definition={visitorChart({ grid: true })} height={240} initialWidth={640} ariaLabel="Desktop and mobile visitors by month" />;\n}\n',
      },
    },
  },
  render: () => <ChartBarDemoGrid />,
};
export const ExampleAxis: Story = {
  parameters: {
    docs: {
      description: { story: "Show chart axes and labels." },
      source: {
        code: 'import { Chart } from "@erbium/ui/components/chart";\nimport { visitorChart } from "./chart-example";\n\nexport function ChartBarDemoAxis() {\n  return <Chart definition={visitorChart({ grid: true, axis: true })} height={240} initialWidth={640} ariaLabel="Desktop and mobile visitors by month" />;\n}\n',
      },
    },
  },
  render: () => <ChartBarDemoAxis />,
};
export const ExampleTooltip: Story = {
  name: "Tooltip",
  parameters: {
    docs: {
      description: {
        story: `Hover or focus a bar to inspect its value. The chart definition enables grouped focus and TanStack Charts' tooltip extension. The shared month appears as the heading, with a value and color swatch for each device.

\`\`\`tsx
import { tooltip } from "@tanstack/charts/tooltip"

const definition = defineChart({
  marks,
  scales,
  focus: "group-x",
  tooltip: { use: tooltip },
})
\`\`\`

Configure tooltip content with \`items\`, \`format\`, or \`formatGroup\` in the definition. See the [TanStack Charts tooltip guide](https://tanstack.com/charts/latest/docs/framework/react/guides/tooltips-and-focus) for placement and formatting options.`,
      },
      source: {
        code: 'import { Chart } from "@erbium/ui/components/chart";\nimport { visitorChart } from "./chart-example";\n\nexport function ChartBarDemoTooltip() {\n  return <Chart definition={visitorChart({ grid: true, axis: true, tooltip: true })} height={240} initialWidth={640} ariaLabel="Desktop and mobile visitors by month" />;\n}\n',
      },
    },
  },
  render: () => <ChartBarDemoTooltip />,
};
export const ExampleLegend: Story = {
  name: "Legend",
  parameters: {
    docs: {
      description: {
        story: `TanStack Charts renders the legend from the chart definition. The example maps Desktop and Mobile to fixed colors and enables a legend labeled Device.

\`\`\`tsx
import { colorLegend } from "@tanstack/charts/legend"
import { scaleOrdinal } from "@tanstack/charts/scales/ordinal"

const definition = defineChart({
  marks,
  scales,
  color: {
    scale: scaleOrdinal(["Desktop", "Mobile"], ["#2563eb", "#60a5fa"]),
    legend: colorLegend({ label: "Device" }),
  },
})
\`\`\``,
      },
      source: {
        code: 'import { Chart } from "@erbium/ui/components/chart";\nimport { visitorChart } from "./chart-example";\n\nexport function ChartBarDemoLegend() {\n  return <Chart definition={visitorChart({ grid: true, axis: true, tooltip: true, legend: true })} height={240} initialWidth={640} ariaLabel="Desktop and mobile visitors by month" />;\n}\n',
      },
    },
  },
  render: () => <ChartBarDemoLegend />,
};
