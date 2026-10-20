import { Skeleton } from "@erbium/ui/components/skeleton";

export const SkeletonText = () => (
  <div className="flex w-full max-w-xs flex-col gap-related">
    <Skeleton className="h-4 w-full" />
    <Skeleton className="h-4 w-full" />
    <Skeleton className="h-4 w-3/4" />
  </div>
);
