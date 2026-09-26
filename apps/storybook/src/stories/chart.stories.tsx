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
        component:
          'Beautiful charts. Built using Recharts. Copy and paste into your apps.\n\n**Import:** `@erbium/ui/components/chart`  \n\n**shadcn/ui page:** [Chart](https://ui.shadcn.com/docs/components/base/chart)\n\n### Component\n\nWe use [Recharts](https://recharts.org/) under the hood.\n\nWe designed the `chart` component with composition in mind. **You build your charts using Recharts components and only bring in custom components, such as `ChartTooltip`, when and where you need it**.\n\nWe do not wrap Recharts. This means you\'re not locked into an abstraction. When a new Recharts version is released, you can follow the official upgrade path to upgrade your charts.\n\n**The components are yours**.\n\n```tsx\nimport { Bar, BarChart } from "recharts"\n\nimport { ChartContainer, ChartTooltipContent } from "@erbium/ui/components/chart"\n\nexport function MyChart() {\n  return (\n    <ChartContainer>\n      <BarChart data={data}>\n        <Bar dataKey="value" />\n        <ChartTooltip content={<ChartTooltipContent />} />\n      </BarChart>\n    </ChartContainer>\n  )\n}\n```\n\n### Updating to Recharts v3\n\nIf you\'re updating older chart code to Recharts v3:\n\n- Use `var(--chart-1)` instead of `hsl(var(--chart-1))` when you reference chart tokens from your CSS variables.\n\n- Use `ChartTooltip.defaultIndex` for initial tooltip state only. Keep persistent active shapes in your own chart state.\n\n- Remove `layout` from `<Bar>` when the parent `<BarChart>` already defines it.\n\n- Keep a height, `min-h-*`, or `aspect-*` on `ChartContainer` so `ResponsiveContainer` can measure on first render.\n\n### Your First Chart\n\nLet\'s build your first chart. We\'ll build a bar chart, add a grid, axis, tooltip and legend.\n\nThe following data represents the number of desktop and mobile users for each month.\n\n**Note:** Your data can be in any shape. You are not limited to the shape of the data below. Use the `dataKey` prop to map your data to the chart.\n\nThe chart config holds configuration for the chart. This is where you place human-readable strings, such as labels, icons and color tokens for theming.\n\nYou can now build your chart using Recharts components.\n\n**Important:** Remember to set a `min-h-[VALUE]` on the `ChartContainer` component. This is required for the chart to be responsive.\n\nLet\'s add a grid to the chart.\n\nTo add an x-axis to the chart, we\'ll use the `XAxis` component.\n\nSo far we\'ve only used components from Recharts. They look great out of the box thanks to some customization in the `chart` component.\n\nTo add a tooltip, we\'ll use the custom `ChartTooltip` and `ChartTooltipContent` components from `chart`.\n\nHover to see the tooltips. Easy, right? Two components, and we\'ve got a beautiful tooltip.\n\nWe\'ll do the same for the legend. We\'ll use the `ChartLegend` and `ChartLegendContent` components from `chart`.\n\nDone. You\'ve built your first chart! What\'s next?\n\n- [Themes and Colors](https://ui.shadcn.com/docs/components/chart#theming)\n\n- [Tooltip](https://ui.shadcn.com/docs/components/chart#tooltip)\n\n- [Legend](https://ui.shadcn.com/docs/components/chart#legend)\n\n```tsx\nconst chartData = [\n  { month: "January", desktop: 186, mobile: 80 },\n  { month: "February", desktop: 305, mobile: 200 },\n  { month: "March", desktop: 237, mobile: 120 },\n  { month: "April", desktop: 73, mobile: 190 },\n  { month: "May", desktop: 209, mobile: 130 },\n  { month: "June", desktop: 214, mobile: 140 },\n]\n```\n\n```tsx\nimport { type ChartConfig } from "@erbium/ui/components/chart"\n\nconst chartConfig = {\n  desktop: {\n    label: "Desktop",\n    color: "#2563eb",\n  },\n  mobile: {\n    label: "Mobile",\n    color: "#60a5fa",\n  },\n} satisfies ChartConfig\n```\n\n```tsx\nimport { Bar, BarChart, CartesianGrid } from "recharts"\n```\n\n```tsx\n<ChartContainer config={chartConfig} className="min-h-[200px] w-full">\n  <BarChart accessibilityLayer data={chartData}>\n    <CartesianGrid vertical={false} />\n    <Bar dataKey="desktop" fill="var(--color-desktop)" radius={4} />\n    <Bar dataKey="mobile" fill="var(--color-mobile)" radius={4} />\n  </BarChart>\n</ChartContainer>\n```\n\n```tsx\nimport { Bar, BarChart, CartesianGrid, XAxis } from "recharts"\n```\n\n```tsx\n<ChartContainer config={chartConfig} className="h-[200px] w-full">\n  <BarChart accessibilityLayer data={chartData}>\n    <CartesianGrid vertical={false} />\n    <XAxis\n      dataKey="month"\n      tickLine={false}\n      tickMargin={10}\n      axisLine={false}\n      tickFormatter={(value) => value.slice(0, 3)}\n    />\n    <Bar dataKey="desktop" fill="var(--color-desktop)" radius={4} />\n    <Bar dataKey="mobile" fill="var(--color-mobile)" radius={4} />\n  </BarChart>\n</ChartContainer>\n```\n\n```tsx\nimport { ChartTooltip, ChartTooltipContent } from "@erbium/ui/components/chart"\n```\n\n```tsx\n<ChartContainer config={chartConfig} className="h-[200px] w-full">\n  <BarChart accessibilityLayer data={chartData}>\n    <CartesianGrid vertical={false} />\n    <XAxis\n      dataKey="month"\n      tickLine={false}\n      tickMargin={10}\n      axisLine={false}\n      tickFormatter={(value) => value.slice(0, 3)}\n    />\n    <ChartTooltip content={<ChartTooltipContent />} />\n    <Bar dataKey="desktop" fill="var(--color-desktop)" radius={4} />\n    <Bar dataKey="mobile" fill="var(--color-mobile)" radius={4} />\n  </BarChart>\n</ChartContainer>\n```\n\n```tsx\nimport { ChartLegend, ChartLegendContent } from "@erbium/ui/components/chart"\n```\n\n```tsx\n<ChartContainer config={chartConfig} className="h-[200px] w-full">\n  <BarChart accessibilityLayer data={chartData}>\n    <CartesianGrid vertical={false} />\n    <XAxis\n      dataKey="month"\n      tickLine={false}\n      tickMargin={10}\n      axisLine={false}\n      tickFormatter={(value) => value.slice(0, 3)}\n    />\n    <ChartTooltip content={<ChartTooltipContent />} />\n    <ChartLegend content={<ChartLegendContent />} />\n    <Bar dataKey="desktop" fill="var(--color-desktop)" radius={4} />\n    <Bar dataKey="mobile" fill="var(--color-mobile)" radius={4} />\n  </BarChart>\n</ChartContainer>\n```\n\n### Chart Config\n\nThe chart config is where you define the labels, icons and colors for a chart.\n\nIt is intentionally decoupled from chart data.\n\nThis allows you to share config and color tokens between charts. It can also work independently for cases where your data or color tokens live remotely or in a different format.\n\n```tsx\nimport { Monitor } from "lucide-react"\n\nimport { type ChartConfig } from "@erbium/ui/components/chart"\n\nconst chartConfig = {\n  desktop: {\n    label: "Desktop",\n    icon: Monitor,\n    // A color like \'hsl(220, 98%, 61%)\' or \'var(--color-name)\'\n    color: "#2563eb",\n    // OR a theme object with \'light\' and \'dark\' keys\n    theme: {\n      light: "#2563eb",\n      dark: "#dc2626",\n    },\n  },\n} satisfies ChartConfig\n```\n\n### Theming\n\nCharts have built-in support for theming. You can use css variables (recommended) or color values in any color format, such as hex, hsl or oklch.\n\nYou can also define your colors directly in the chart config. Use the color format you prefer.\n\nTo use the theme colors in your chart, reference the colors using the format `var(--color-KEY)`.\n\n```tsx\nconst chartConfig = {\n  desktop: {\n    label: "Desktop",\n    color: "var(--chart-1)",\n  },\n  mobile: {\n    label: "Mobile",\n    color: "var(--chart-2)",\n  },\n} satisfies ChartConfig\n```\n\n```tsx\nconst chartConfig = {\n  desktop: {\n    label: "Desktop",\n    color: "#2563eb",\n  },\n  mobile: {\n    label: "Mobile",\n    color: "hsl(220, 98%, 61%)",\n  },\n  tablet: {\n    label: "Tablet",\n    color: "oklch(0.5 0.2 240)",\n  },\n  laptop: {\n    label: "Laptop",\n    color: "var(--chart-2)",\n  },\n} satisfies ChartConfig\n```\n\n```tsx\n<Bar dataKey="desktop" fill="var(--color-desktop)" />\n```\n\n```tsx\nconst chartData = [\n  { browser: "chrome", visitors: 275, fill: "var(--color-chrome)" },\n  { browser: "safari", visitors: 200, fill: "var(--color-safari)" },\n]\n```\n\n```tsx\n<LabelList className="fill-(--color-desktop)" />\n```\n\n### Accessibility\n\nYou can turn on the `accessibilityLayer` prop to add an accessible layer to your chart.\n\nThis prop adds keyboard access and screen reader support to your charts.\n\n```tsx\n<LineChart accessibilityLayer />\n```',
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
        code: 'import { ChartContainer } from "@erbium/ui/components/chart";\nexport default function Demo() {\n  return (\n    <ChartContainer\n      config={{ desktop: { label: "Desktop", color: "var(--chart-1)" } }}\n      className="h-40 w-80"\n    >\n      <div className="flex size-full items-end gap-3 p-4">\n        <div className="h-1/2 flex-1 bg-primary" />\n        <div className="h-3/4 flex-1 bg-primary" />\n        <div className="h-full flex-1 bg-primary" />\n      </div>\n    </ChartContainer>\n  );\n}\n',
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
        code: 'import { Bar, BarChart } from "recharts";\n\nimport { ChartContainer, type ChartConfig } from "@erbium/ui/components/chart";\n\nconst chartData = [\n  { month: "January", desktop: 186, mobile: 80 },\n  { month: "February", desktop: 305, mobile: 200 },\n  { month: "March", desktop: 237, mobile: 120 },\n  { month: "April", desktop: 73, mobile: 190 },\n  { month: "May", desktop: 209, mobile: 130 },\n  { month: "June", desktop: 214, mobile: 140 },\n];\n\nconst chartConfig = {\n  desktop: {\n    label: "Desktop",\n    color: "#2563eb",\n  },\n  mobile: {\n    label: "Mobile",\n    color: "#60a5fa",\n  },\n} satisfies ChartConfig;\n\nexport function ChartExample() {\n  return (\n    <ChartContainer config={chartConfig} className="min-h-[200px] w-full">\n      <BarChart accessibilityLayer data={chartData}>\n        <Bar dataKey="desktop" fill="#2563eb" radius={4} />\n        <Bar dataKey="mobile" fill="#60a5fa" radius={4} />\n      </BarChart>\n    </ChartContainer>\n  );\n}\n',
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
        code: 'import { Bar, BarChart, CartesianGrid } from "recharts";\n\nimport { ChartContainer, type ChartConfig } from "@erbium/ui/components/chart";\n\nconst chartData = [\n  { month: "January", desktop: 186, mobile: 80 },\n  { month: "February", desktop: 305, mobile: 200 },\n  { month: "March", desktop: 237, mobile: 120 },\n  { month: "April", desktop: 73, mobile: 190 },\n  { month: "May", desktop: 209, mobile: 130 },\n  { month: "June", desktop: 214, mobile: 140 },\n];\n\nconst chartConfig = {\n  desktop: {\n    label: "Desktop",\n    color: "#2563eb",\n  },\n  mobile: {\n    label: "Mobile",\n    color: "#60a5fa",\n  },\n} satisfies ChartConfig;\n\nexport function ChartBarDemoGrid() {\n  return (\n    <ChartContainer config={chartConfig} className="min-h-[200px] w-full">\n      <BarChart accessibilityLayer data={chartData}>\n        <CartesianGrid vertical={false} />\n        <Bar dataKey="desktop" fill="#2563eb" radius={4} />\n        <Bar dataKey="mobile" fill="#60a5fa" radius={4} />\n      </BarChart>\n    </ChartContainer>\n  );\n}\n',
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
        code: 'import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";\n\nimport { ChartContainer, type ChartConfig } from "@erbium/ui/components/chart";\n\nconst chartData = [\n  { month: "January", desktop: 186, mobile: 80 },\n  { month: "February", desktop: 305, mobile: 200 },\n  { month: "March", desktop: 237, mobile: 120 },\n  { month: "April", desktop: 73, mobile: 190 },\n  { month: "May", desktop: 209, mobile: 130 },\n  { month: "June", desktop: 214, mobile: 140 },\n];\n\nconst chartConfig = {\n  desktop: {\n    label: "Desktop",\n    color: "#2563eb",\n  },\n  mobile: {\n    label: "Mobile",\n    color: "#60a5fa",\n  },\n} satisfies ChartConfig;\n\nexport function ChartBarDemoAxis() {\n  return (\n    <ChartContainer config={chartConfig} className="min-h-[200px] w-full">\n      <BarChart accessibilityLayer data={chartData}>\n        <CartesianGrid vertical={false} />\n        <XAxis\n          dataKey="month"\n          tickLine={false}\n          tickMargin={10}\n          axisLine={false}\n          tickFormatter={(value) => value.slice(0, 3)}\n        />\n        <Bar dataKey="desktop" fill="#2563eb" radius={4} />\n        <Bar dataKey="mobile" fill="#60a5fa" radius={4} />\n      </BarChart>\n    </ChartContainer>\n  );\n}\n',
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
        story:
          'A chart tooltip contains a label, name, indicator and value. You can use a combination of these to customize your tooltip.\n\nYou can turn on/off any of these using the `hideLabel`, `hideIndicator` props and customize the indicator style using the `indicator` prop.\n\nUse `labelKey` and `nameKey` to use a custom key for the tooltip label and name.\n\nChart comes with the `<ChartTooltip>` and `<ChartTooltipContent>` components. You can use these two components to add custom tooltips to your chart.\n\nUse the following props to customize the tooltip.\n\n| Prop            | Type                     | Description                                  |\n\n| :-------------- | :----------------------- | :------------------------------------------- |\n\n| `labelKey`      | string                   | The config or data key to use for the label. |\n\n| `nameKey`       | string                   | The config or data key to use for the name.  |\n\n| `indicator`     | `dot` `line` or `dashed` | The indicator style for the tooltip.         |\n\n| `hideLabel`     | boolean                  | Whether to hide the label.                   |\n\n| `hideIndicator` | boolean                  | Whether to hide the indicator.               |\n\nColors are automatically referenced from the chart config.\n\nTo use a custom key for tooltip label and names, use the `labelKey` and `nameKey` props.\n\nThis will use `Total Visitors` for label and `Chrome` and `Safari` for the tooltip names.\n\n```tsx\nimport { ChartTooltip, ChartTooltipContent } from "@erbium/ui/components/chart"\n```\n\n```tsx\n<ChartTooltip content={<ChartTooltipContent />} />\n```\n\n```tsx\nconst chartData = [\n  { browser: "chrome", visitors: 187, fill: "var(--color-chrome)" },\n  { browser: "safari", visitors: 200, fill: "var(--color-safari)" },\n]\n\nconst chartConfig = {\n  visitors: {\n    label: "Total Visitors",\n  },\n  chrome: {\n    label: "Chrome",\n    color: "var(--chart-1)",\n  },\n  safari: {\n    label: "Safari",\n    color: "var(--chart-2)",\n  },\n} satisfies ChartConfig\n```\n\n```tsx\n<ChartTooltip\n  content={<ChartTooltipContent labelKey="visitors" nameKey="browser" />}\n/>\n```',
      },
      source: {
        code: 'import { Bar, BarChart, CartesianGrid, XAxis, Tooltip as ChartTooltip } from "recharts";\n\nimport { ChartContainer, type ChartConfig } from "@erbium/ui/components/chart";\n\nconst chartData = [\n  { month: "January", desktop: 186, mobile: 80 },\n  { month: "February", desktop: 305, mobile: 200 },\n  { month: "March", desktop: 237, mobile: 120 },\n  { month: "April", desktop: 73, mobile: 190 },\n  { month: "May", desktop: 209, mobile: 130 },\n  { month: "June", desktop: 214, mobile: 140 },\n];\n\nconst chartConfig = {\n  desktop: {\n    label: "Desktop",\n    color: "#2563eb",\n  },\n  mobile: {\n    label: "Mobile",\n    color: "#60a5fa",\n  },\n} satisfies ChartConfig;\n\nexport function ChartBarDemoTooltip() {\n  return (\n    <ChartContainer config={chartConfig} className="min-h-[200px] w-full">\n      <BarChart accessibilityLayer data={chartData}>\n        <CartesianGrid vertical={false} />\n        <XAxis\n          dataKey="month"\n          tickLine={false}\n          tickMargin={10}\n          axisLine={false}\n          tickFormatter={(value) => value.slice(0, 3)}\n        />\n        <ChartTooltip />\n        <Bar dataKey="desktop" fill="#2563eb" radius={4} />\n        <Bar dataKey="mobile" fill="#60a5fa" radius={4} />\n      </BarChart>\n    </ChartContainer>\n  );\n}\n',
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
        story:
          'You can use the custom `<ChartLegend>` and `<ChartLegendContent>` components to add a legend to your chart.\n\nColors are automatically referenced from the chart config.\n\nTo use a custom key for legend names, use the `nameKey` prop.\n\nThis will use `Chrome` and `Safari` for the legend names.\n\n```tsx\nimport { ChartLegend, ChartLegendContent } from "@erbium/ui/components/chart"\n```\n\n```tsx\n<ChartLegend content={<ChartLegendContent />} />\n```\n\n```tsx\nconst chartData = [\n  { browser: "chrome", visitors: 187, fill: "var(--color-chrome)" },\n  { browser: "safari", visitors: 200, fill: "var(--color-safari)" },\n]\n\nconst chartConfig = {\n  chrome: {\n    label: "Chrome",\n    color: "var(--chart-1)",\n  },\n  safari: {\n    label: "Safari",\n    color: "var(--chart-2)",\n  },\n} satisfies ChartConfig\n```\n\n```tsx\n<ChartLegend content={<ChartLegendContent nameKey="browser" />} />\n```',
      },
      source: {
        code: 'import {\n  Bar,\n  BarChart,\n  CartesianGrid,\n  XAxis,\n  Tooltip as ChartTooltip,\n  Legend as ChartLegend,\n} from "recharts";\n\nimport { ChartContainer, type ChartConfig } from "@erbium/ui/components/chart";\n\nconst chartData = [\n  { month: "January", desktop: 186, mobile: 80 },\n  { month: "February", desktop: 305, mobile: 200 },\n  { month: "March", desktop: 237, mobile: 120 },\n  { month: "April", desktop: 73, mobile: 190 },\n  { month: "May", desktop: 209, mobile: 130 },\n  { month: "June", desktop: 214, mobile: 140 },\n];\n\nconst chartConfig = {\n  desktop: {\n    label: "Desktop",\n    color: "#2563eb",\n  },\n  mobile: {\n    label: "Mobile",\n    color: "#60a5fa",\n  },\n} satisfies ChartConfig;\n\nexport function ChartBarDemoLegend() {\n  return (\n    <ChartContainer config={chartConfig} className="min-h-[200px] w-full">\n      <BarChart accessibilityLayer data={chartData}>\n        <CartesianGrid vertical={false} />\n        <XAxis\n          dataKey="month"\n          tickLine={false}\n          tickMargin={10}\n          axisLine={false}\n          tickFormatter={(value) => value.slice(0, 3)}\n        />\n        <ChartTooltip />\n        <ChartLegend />\n        <Bar dataKey="desktop" fill="#2563eb" radius={4} />\n        <Bar dataKey="mobile" fill="#60a5fa" radius={4} />\n      </BarChart>\n    </ChartContainer>\n  );\n}\n',
      },
    },
  },
  render: () => <ChartBarDemoLegend />,
};
