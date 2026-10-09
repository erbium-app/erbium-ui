import { Spinner } from "@erbium/ui/components/spinner";

export default function SpinnerSize() {
  return (
    <div className="flex items-center gap-section">
      <Spinner className="size-3" />
      <Spinner className="size-4" />
      <Spinner className="size-6" />
      <Spinner className="size-8" />
    </div>
  );
}
