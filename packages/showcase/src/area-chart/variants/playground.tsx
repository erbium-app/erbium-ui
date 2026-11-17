import { AreaChart } from "@erbium/ui/charts/area-chart";
import { devices, shortMonth, visitors } from "../examples/data";

export const defaultProps = {
  axis: true,
  curve: "smooth",
  fill: "gradient",
  grid: true,
  legend: true,
  stacked: false,
  tooltip: true,
} satisfies {
  axis: boolean;
  curve: "smooth" | "linear" | "step";
  fill: "gradient" | "solid";
  grid: boolean;
  legend: boolean;
  stacked: boolean;
  tooltip: boolean;
};

export default function AreaChartPlaygroundExample(
  args: {
    axis: boolean;
    curve: "smooth" | "linear" | "step";
    fill: "gradient" | "solid";
    grid: boolean;
    legend: boolean;
    stacked: boolean;
    tooltip: boolean;
  } = defaultProps,
) {
  return (
    <div className="w-2xl max-w-full p-4">
      <AreaChart
        ariaLabel="Visitors by month and device"
        data={visitors}
        index="month"
        indexFormat={shortMonth}
        series={devices}
        initialWidth={640}
        {...args}
      />
    </div>
  );
}
