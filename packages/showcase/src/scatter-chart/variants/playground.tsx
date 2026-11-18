import { chartNumberFormat } from "@erbium/ui/charts/chart";
import { ScatterChart } from "@erbium/ui/charts/scatter-chart";
import { products } from "../examples/data";

const priceFormat = chartNumberFormat(
  { currency: "USD", maximumFractionDigits: 0, style: "currency" },
  "en",
);

const ratingFormat = chartNumberFormat({ maximumFractionDigits: 1 }, "en");

export const defaultProps = {
  grid: true,
  legend: true,
  radius: 4,
  tooltip: true,
} satisfies { grid: boolean; legend: boolean; radius: number; tooltip: boolean };

export default function ScatterChartPlaygroundExample(
  args: { grid: boolean; legend: boolean; radius: number; tooltip: boolean } = defaultProps,
) {
  return (
    <div className="w-full p-4">
      <ScatterChart
        ariaLabel="Product price against average rating"
        data={products}
        x="price"
        y="rating"
        group="category"
        xLabel="Price"
        yLabel="Rating"
        xFormat={priceFormat}
        format={ratingFormat}
        initialWidth={640}
        {...args}
      />
    </div>
  );
}
