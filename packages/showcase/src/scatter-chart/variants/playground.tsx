import { chartNumberFormat } from "@erbium/ui/charts/chart";
import { ScatterChart } from "@erbium/ui/charts/scatter-chart";
import { products } from "../examples/data";

const priceFormat = chartNumberFormat(
  { currency: "USD", maximumFractionDigits: 0, style: "currency" },
  "en",
);

const ratingFormat = chartNumberFormat({ maximumFractionDigits: 1 }, "en");

const Example = (args: { grid: boolean; legend: boolean; radius: number; tooltip: boolean }) => (
  <div className="w-2xl max-w-full p-4">
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

export default Example;
