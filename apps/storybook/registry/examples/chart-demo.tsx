// @ts-nocheck
import { ChartContainer } from "../components/chart";
export default function Demo() {
  return (
    <ChartContainer
      config={{ desktop: { label: "Desktop", color: "var(--chart-1)" } }}
      className="h-40 w-80"
    >
      <div className="flex size-full items-end gap-3 p-4">
        <div className="h-1/2 flex-1 bg-primary" />
        <div className="h-3/4 flex-1 bg-primary" />
        <div className="h-full flex-1 bg-primary" />
      </div>
    </ChartContainer>
  );
}
