import { barY, defineChart, group } from "@tanstack/charts";
import { scaleBand } from "@tanstack/charts/scales/band";
import { scaleLinear } from "@tanstack/charts/scales/linear";
import { scaleOrdinal } from "@tanstack/charts/scales/ordinal";
import { tooltip } from "@tanstack/charts/tooltip";
import { colorLegend, colorLegendItems } from "@tanstack/charts/legend";
import { Chart } from "@erbium/ui/components/chart";
import { chartTextRole } from "@erbium/ui/lib/typography";

const monthlyVisitors = [
  { desktop: 186, mobile: 80, month: "January" },
  { desktop: 305, mobile: 200, month: "February" },
  { desktop: 237, mobile: 120, month: "March" },
  { desktop: 73, mobile: 190, month: "April" },
  { desktop: 209, mobile: 130, month: "May" },
  { desktop: 214, mobile: 140, month: "June" },
];

const visitors = monthlyVisitors.flatMap(({ month, desktop, mobile }) => [
  { device: "Desktop", month, visitors: desktop },
  { device: "Mobile", month, visitors: mobile },
]);

export const visitorChart = (
  options: { grid?: boolean; axis?: boolean; tooltip?: boolean; legend?: boolean } = {},
) =>
  defineChart({
    color: {
      scale: scaleOrdinal(["Desktop", "Mobile"], ["var(--chart-1)", "var(--chart-2)"]),
      ...(options.legend
        ? {
            legend: colorLegend({
              items: colorLegendItems<"Desktop" | "Mobile">({
                gap: 16,
                indicator: { gap: 7, height: 8, shape: "dot", width: 8 },
                justify: "start",
                label: { ...chartTextRole("metadata"), fill: "var(--muted-foreground)" },
                rowGap: 8,
              }),
              label: "Device",
            }),
          }
        : {}),
    },
    marks: [
      barY(visitors, {
        color: "device",
        inset: 1,
        layout: group({ padding: 0.12 }),
        radius: 4,
        x: "month",
        y: "visitors",
        z: "device",
      }),
    ],
    scales: {
      x: {
        axis: options.axis ? { ticks: { format: (value: string) => value.slice(0, 3) } } : false,
        scale: scaleBand,
      },
      y: { grid: options.grid, nice: true, scale: scaleLinear },
    },
    theme: {
      foreground: "var(--foreground)",
      grid: "var(--border)",
      muted: "var(--muted-foreground)",
    },
    ...(options.tooltip
      ? {
          focus: "group-x" as const,
          tooltip: { className: "erbium-chart-tooltip", use: tooltip },
        }
      : {}),
  });

export const ChartExample = () => (
  <Chart
    definition={visitorChart()}
    height={240}
    initialWidth={640}
    ariaLabel="Desktop and mobile visitors by month"
  />
);
