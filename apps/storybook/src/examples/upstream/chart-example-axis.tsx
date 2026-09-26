import { Chart } from "@erbium/ui/components/chart";
import { visitorChart } from "./chart-example";

export function ChartBarDemoAxis() {
  return (
    <Chart
      definition={visitorChart({ grid: true, axis: true })}
      height={240}
      initialWidth={640}
      ariaLabel="Desktop and mobile visitors by month"
    />
  );
}
