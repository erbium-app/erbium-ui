import { HeatmapChart } from "@erbium/ui/charts/heatmap-chart";
import { days, hours, orders } from "../examples/data";

export const defaultProps = { legend: true, tooltip: true } satisfies {
  legend: boolean;
  tooltip: boolean;
};

export default function HeatmapChartPlaygroundExample(
  args: { legend: boolean; tooltip: boolean } = defaultProps,
) {
  return (
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
}
