import { BarChart } from "@erbium/ui/charts/bar-chart";
import { devices, shortMonth, visitors } from "../examples/data";

export const defaultProps = {
  axis: true,
  grid: true,
  legend: true,
  orientation: "vertical",
  stacked: false,
  tooltip: true,
} satisfies {
  axis: boolean;
  grid: boolean;
  legend: boolean;
  orientation: "vertical" | "horizontal";
  stacked: boolean;
  tooltip: boolean;
};

export default function BarChartPlaygroundExample(
  args: {
    axis: boolean;
    grid: boolean;
    legend: boolean;
    orientation: "vertical" | "horizontal";
    stacked: boolean;
    tooltip: boolean;
  } = defaultProps,
) {
  return (
    <div className="w-2xl max-w-full p-4">
      <BarChart
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
