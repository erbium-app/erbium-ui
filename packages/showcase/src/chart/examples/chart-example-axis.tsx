import { Chart } from "@erbium/ui/components/chart";
import { visitorChart } from "./chart-example";

export const ChartBarDemoAxis = () => (
  <Chart
    definition={visitorChart({ axis: true, grid: true })}
    height={240}
    initialWidth={640}
    ariaLabel="Desktop and mobile visitors by month"
  />
);
