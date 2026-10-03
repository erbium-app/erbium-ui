import { Chart } from "@erbium/ui/components/chart";
import { visitorChart } from "./chart-example";

export function ChartBarDemoTooltip() {
  return (
    <Chart
      definition={visitorChart({ grid: true, axis: true, tooltip: true })}
      height={240}
      initialWidth={640}
      ariaLabel="Desktop and mobile visitors by month"
    />
  );
}
