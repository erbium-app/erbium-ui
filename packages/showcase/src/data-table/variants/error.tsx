import { InvoicesTable } from "../helpers";

export default function DataTableErrorExample() {
  return (
    <div className="w-full min-w-72 p-4">
      <InvoicesTable fail />
    </div>
  );
}
