import { Spinner } from "@erbium/ui/components/spinner";

const SpinnerSize = () => (
  <div className="flex items-center gap-section">
    <Spinner size="xs" />
    <Spinner size="sm" />
    <Spinner size="default" />
    <Spinner size="lg" />
    <Spinner size="xl" />
  </div>
);

export default SpinnerSize;
