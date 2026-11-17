import { PieChart } from "@erbium/ui/charts/pie-chart";
import { browsers } from "../examples/data";

const Example = (args: { donut: boolean; legend: boolean; tooltip: boolean }) => (
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

export default Example;
