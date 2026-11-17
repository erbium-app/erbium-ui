import { AreaChart } from "@erbium/ui/charts/area-chart";
import { devices, shortMonth, visitors } from "../examples/data";

export default function AreaChartStackedExample() {
  return (
    <div className="w-2xl max-w-full p-4">
      <AreaChart
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
}
