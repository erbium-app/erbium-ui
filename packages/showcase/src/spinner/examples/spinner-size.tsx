import { Spinner } from "@erbium/ui/components/spinner";

const SpinnerSize = () => (
  <div className="flex items-center gap-section">
    <Spinner className="size-3" />
    <Spinner className="size-4" />
    <Spinner className="size-6" />
    <Spinner className="size-8" />
  </div>
);

export default SpinnerSize;
