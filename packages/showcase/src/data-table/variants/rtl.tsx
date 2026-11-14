import { DirectionProvider } from "@erbium/ui/components/direction";
import { InvoicesTable } from "../helpers";

const Example = () => (
  <DirectionProvider direction="rtl">
    <div dir="rtl" className="w-full min-w-72 max-w-3xl p-4">
      <InvoicesTable />
    </div>
  </DirectionProvider>
);

export default Example;
