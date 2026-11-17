import { LineChart } from "@erbium/ui/charts/line-chart";
import { devices, shortMonth, visitors } from "../examples/data";

const Example = (args: {
  axis: boolean;
  curve: "smooth" | "linear" | "step";
  grid: boolean;
  legend: boolean;
  points: boolean;
  tooltip: boolean;
}) => (
  <div className="w-2xl max-w-full p-4">
    <LineChart
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
