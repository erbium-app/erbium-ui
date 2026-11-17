import { BarChart } from "@erbium/ui/charts/bar-chart";
import { browsers } from "../examples/data";

const Example = () => (
  <div className="w-2xl max-w-full p-4">
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

export default Example;
