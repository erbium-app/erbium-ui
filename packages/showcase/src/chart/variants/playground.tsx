import { visitorChart } from "../examples/chart-example";
import { Chart } from "@erbium/ui/components/chart";

const Example = (args: {
  height: number;
  initialWidth: number;
  grid: boolean;
  axis: boolean;
  tooltip: boolean;
  legend: boolean;
}) => (
  <Chart
    definition={visitorChart({
      axis: args.axis,
      grid: args.grid,
      legend: args.legend,
      tooltip: args.tooltip,
    })}
    height={args.height}
    initialWidth={args.initialWidth}
    ariaLabel="Visitors by month"
  />
);

export default Example;
