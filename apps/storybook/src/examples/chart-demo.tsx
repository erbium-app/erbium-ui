import { barY, defineChart, group } from "@tanstack/charts";
import { scaleBand } from "@tanstack/charts/scales/band";
import { scaleLinear } from "@tanstack/charts/scales/linear";
import { scaleOrdinal } from "@tanstack/charts/scales/ordinal";
import { tooltip } from "@tanstack/charts/tooltip";
import { colorLegend } from "@tanstack/charts/legend";
import { Chart } from "@erbium/ui/components/chart";

const monthlyVisitors = [
  { month: "January", desktop: 186, mobile: 80 },
  { month: "February", desktop: 305, mobile: 200 },
  { month: "March", desktop: 237, mobile: 120 },
  { month: "April", desktop: 73, mobile: 190 },
  { month: "May", desktop: 209, mobile: 130 },
  { month: "June", desktop: 214, mobile: 140 },
];

const visitors = monthlyVisitors.flatMap(({ month, desktop, mobile }) => [
  { month, device: "Desktop", visitors: desktop },
  { month, device: "Mobile", visitors: mobile },
]);

export function visitorChart(
  options: { grid?: boolean; axis?: boolean; tooltip?: boolean; legend?: boolean } = {},
) {
  return defineChart({
    marks: [
      barY(visitors, {
        x: "month",
        y: "visitors",
        z: "device",
        color: "device",
        layout: group({ padding: 0.12 }),
        radius: 4,
        inset: 1,
      }),
    ],
    scales: {
      x: {
        scale: scaleBand,
        axis: options.axis ? { ticks: { format: (value: string) => value.slice(0, 3) } } : false,
      },
      y: { scale: scaleLinear, nice: true, grid: options.grid },
    },
    color: {
      scale: scaleOrdinal(["Desktop", "Mobile"], ["#2563eb", "#60a5fa"]),
      ...(options.legend ? { legend: colorLegend({ label: "Device" }) } : {}),
    },
    ...(options.tooltip ? { focus: "group-x" as const, tooltip: { use: tooltip } } : {}),
  });
}

export default function Demo() {
  return (
    <Chart
      definition={visitorChart({ grid: true, axis: true, tooltip: true, legend: true })}
      height={240}
      initialWidth={640}
      ariaLabel="Desktop and mobile visitors by month"
    />
  );
}
