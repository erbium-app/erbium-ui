import { DirectionProvider } from "@erbium/ui/components/direction";
import { InvoicesTable } from "../helpers";

export default function DataTableRtlExample() {
  return (
    <DirectionProvider direction="rtl">
      <div dir="rtl" className="w-full min-w-72 p-4">
        <InvoicesTable />
      </div>
    </DirectionProvider>
  );
}
