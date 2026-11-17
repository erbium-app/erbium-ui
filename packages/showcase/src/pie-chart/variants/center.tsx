import { PieChart } from "@erbium/ui/charts/pie-chart";
import { browsers } from "../examples/data";

const total = browsers.reduce((sum, row) => sum + row.visitors, 0);

export default function PieChartCenterExample() {
  return (
    <div className="w-md max-w-full p-4">
      <PieChart
        ariaLabel="Visitors by browser"
        data={browsers}
        index="browser"
        value="visitors"
        initialWidth={400}
        center={
          <>
            <span className="text-subtitle tabular-nums">{total.toLocaleString("en")}</span>
            <span className="text-metadata text-muted-foreground">Visitors</span>
          </>
        }
      />
    </div>
  );
}
