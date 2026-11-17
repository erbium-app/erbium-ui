import { PieChart } from "@erbium/ui/charts/pie-chart";
import { browsers } from "../examples/data";

export const defaultProps = {
  donut: true,
  legend: true,
  tooltip: true,
} satisfies { donut: boolean; legend: boolean; tooltip: boolean };

export default function PieChartPlaygroundExample(
  args: { donut: boolean; legend: boolean; tooltip: boolean } = defaultProps,
) {
  return (
    <div className="w-md max-w-full p-4">
      <PieChart
        ariaLabel="Visitors by browser"
        data={browsers}
        index="browser"
        value="visitors"
        initialWidth={400}
        {...args}
      />
    </div>
  );
}
