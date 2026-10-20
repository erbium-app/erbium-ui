import { Skeleton } from "@erbium/ui/components/skeleton";

export const SkeletonTable = () => (
  <div className="flex w-full max-w-sm flex-col gap-related">
    {Array.from({ length: 5 }).map((_, index) => (
      <div className="flex gap-group" key={index}>
        <Skeleton className="h-4 flex-1" />
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-20" />
      </div>
    ))}
  </div>
);
