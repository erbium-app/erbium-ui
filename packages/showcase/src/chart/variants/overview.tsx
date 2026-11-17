import { AreaChart } from "@erbium/ui/charts/area-chart";
import { BarChart } from "@erbium/ui/charts/bar-chart";
import { LineChart } from "@erbium/ui/charts/line-chart";
import { PieChart } from "@erbium/ui/charts/pie-chart";
import { browsers, devices, shortMonth, visitors } from "../examples/data";

export default function ChartExample() {
  return (
    <div className="grid w-3xl max-w-full gap-8 p-4 sm:grid-cols-2">
      <BarChart
        ariaLabel="Visitors by month and device"
        data={visitors}
        index="month"
        indexFormat={shortMonth}
        series={devices}
        height={180}
        initialWidth={320}
      />
      <LineChart
        ariaLabel="Visitors by month and device"
        data={visitors}
        index="month"
        indexFormat={shortMonth}
        series={devices}
        height={180}
        initialWidth={320}
      />
      <AreaChart
        ariaLabel="Visitors by month and device"
        data={visitors}
        index="month"
        indexFormat={shortMonth}
        series={devices}
        stacked
        height={180}
        initialWidth={320}
      />
      <PieChart
        ariaLabel="Visitors by browser"
        data={browsers}
        index="browser"
        value="visitors"
        height={180}
        initialWidth={320}
      />
    </div>
  );
}
