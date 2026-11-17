import { BarChart } from "@erbium/ui/charts/bar-chart";
import { devices, shortMonth, visitors } from "../examples/data";

const Example = () => (
  <div className="w-2xl max-w-full p-4">
    <BarChart
      ariaLabel="Visitors by month, stacked by device"
      data={visitors}
      index="month"
      indexFormat={shortMonth}
      series={devices}
      stacked
      initialWidth={640}
    />
  </div>
);

export default Example;
