import { BarChart } from "@erbium/ui/charts/bar-chart";
import { devices, shortMonth, visitors } from "../examples/data";

const Example = (args: {
  axis: boolean;
  grid: boolean;
  legend: boolean;
  orientation: "vertical" | "horizontal";
  stacked: boolean;
  tooltip: boolean;
}) => (
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

export default Example;
