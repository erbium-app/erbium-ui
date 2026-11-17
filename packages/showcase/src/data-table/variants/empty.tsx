import { InvoicesTable } from "../helpers";

export default function DataTableEmptyExample() {
  return (
    <div className="w-full min-w-72 max-w-3xl p-4">
      <InvoicesTable empty />
    </div>
  );
}
