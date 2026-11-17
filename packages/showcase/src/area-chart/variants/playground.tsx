import { AreaChart } from "@erbium/ui/charts/area-chart";
import { devices, shortMonth, visitors } from "../examples/data";

const Example = (args: {
  axis: boolean;
  curve: "smooth" | "linear" | "step";
  fill: "gradient" | "solid";
  grid: boolean;
  legend: boolean;
  stacked: boolean;
  tooltip: boolean;
}) => (
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

export default Example;
