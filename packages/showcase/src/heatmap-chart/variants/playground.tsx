import { HeatmapChart } from "@erbium/ui/charts/heatmap-chart";
import { days, hours, orders } from "../examples/data";

const Example = (args: { legend: boolean; tooltip: boolean }) => (
  <div className="w-2xl max-w-full p-4">
    <HeatmapChart
      ariaLabel="Orders by weekday and hour"
      data={orders}
      x="hour"
      y="day"
      value="orders"
      columns={hours}
      rows={days}
      initialWidth={640}
      {...args}
    />
  </div>
);

export default Example;
