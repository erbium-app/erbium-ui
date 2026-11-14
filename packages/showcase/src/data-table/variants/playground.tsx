import { InvoicesTable } from "../helpers";
import type { InvoicesTableProps } from "../helpers";

const Example = (args: InvoicesTableProps) => (
  <div className="w-full min-w-72 max-w-3xl p-4">
    <InvoicesTable {...args} />
  </div>
);

export default Example;
