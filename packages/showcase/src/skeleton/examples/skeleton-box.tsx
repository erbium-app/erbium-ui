import { Skeleton } from "@erbium/ui/components/skeleton";

/**
 * Without content, `Skeleton` is a box you size yourself. Use it only when there is nothing to
 * render a sample from, such as a chart whose shape depends on the data. It shares the page's
 * shimmer with every measured skeleton.
 */
export default function SkeletonBoxExample() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-related">
      <Skeleton className="h-40 w-full rounded-xl" />
      <div className="flex gap-related">
        <Skeleton className="h-4 flex-1" />
        <Skeleton className="h-4 w-16" />
      </div>
    </div>
  );
}
