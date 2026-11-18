import { defaultLatency } from "../../loading";
import { InvoicesTable } from "../helpers";
import type { InvoicesTableProps } from "../helpers";

export const defaultProps = {
  empty: false,
  fail: false,
  latency: defaultLatency,
  pageSize: 6,
} satisfies InvoicesTableProps;

export default function DataTablePlaygroundExample(args: InvoicesTableProps = defaultProps) {
  return (
    <div className="w-full min-w-72 p-4">
      <InvoicesTable {...args} />
    </div>
  );
}
