import { Skeleton } from "@erbium/ui/components/skeleton";

export function SkeletonAvatar() {
  return (
    <div className="flex w-fit items-center gap-group">
      <Skeleton className="size-10 shrink-0 rounded-avatar" />
      <div className="grid gap-related">
        <Skeleton className="h-4 w-[150px]" />
        <Skeleton className="h-4 w-[100px]" />
      </div>
    </div>
  );
}
