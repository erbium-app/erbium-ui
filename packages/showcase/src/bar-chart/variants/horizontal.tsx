import { BarChart } from "@erbium/ui/charts/bar-chart";
import { browsers } from "../examples/data";

export default function BarChartHorizontalExample() {
  return (
    <div className="w-full p-4">
      <BarChart
        ariaLabel="Visitors by browser"
        data={browsers}
        index="browser"
        series={[{ key: "visitors", label: "Visitors" }]}
        orientation="horizontal"
        initialWidth={640}
      />
    </div>
  );
}
