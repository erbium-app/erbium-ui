import { Skeleton } from "@erbium/ui/components/skeleton";

const SkeletonDemo = () => (
  <div className="flex items-center space-x-4">
    <Skeleton className="size-12 rounded-avatar" />
    <div className="space-y-2">
      <Skeleton className="h-4 w-[250px]" />
      <Skeleton className="h-4 w-[200px]" />
    </div>
  </div>
);

export default SkeletonDemo;
