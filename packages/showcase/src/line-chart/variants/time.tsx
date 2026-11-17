import { LineChart } from "@erbium/ui/charts/line-chart";

const start = Date.UTC(2026, 9, 1);
const day = 24 * 60 * 60 * 1000;

const latency = Array.from({ length: 30 }, (_, index) => ({
  date: new Date(start + index * day),
  p50: 120 + Math.round(Math.sin(index / 3) * 18),
  p95: 260 + Math.round(Math.cos(index / 4) * 40),
}));

const dateFormat = new Intl.DateTimeFormat("en", {
  day: "numeric",
  month: "short",
  timeZone: "UTC",
});

const Example = () => (
  <div className="w-2xl max-w-full p-4">
    <LineChart
      ariaLabel="Daily response time, median and 95th percentile"
      data={latency}
      index="date"
      indexType="time"
      indexFormat={(value) => (value instanceof Date ? dateFormat.format(value) : String(value))}
      series={[
        { key: "p50", label: "Median" },
        { key: "p95", label: "95th percentile" },
      ]}
      format={(value) => `${value} ms`}
      initialWidth={640}
    />
  </div>
);

export default Example;
