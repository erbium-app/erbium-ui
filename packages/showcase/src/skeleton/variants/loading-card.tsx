import { Skeleton } from "@erbium/ui/components/skeleton";

const Example = () => (
  <div className="flex w-64 gap-3">
    <Skeleton className="size-10 rounded-[35%]" />
    <div className="flex-1 space-y-2">
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
    </div>
  </div>
);

export default Example;
