import { Skeleton } from "@erbium/ui/components/skeleton";

export function SkeletonForm() {
  return (
    <div className="flex w-full max-w-xs flex-col gap-7">
      <div className="flex flex-col gap-3">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="min-h-control control-adaptive w-full" />
      </div>
      <div className="flex flex-col gap-3">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="min-h-control control-adaptive w-full" />
      </div>
      <Skeleton className="min-h-control control-adaptive w-24" />
    </div>
  );
}
