import { Skeleton } from "@erbium/ui/components/skeleton";
import { useEffect, useState } from "react";

const rows = [
  { delay: 0, id: "first" },
  { delay: 450, id: "second" },
  { delay: 900, id: "third" },
  { delay: 1350, id: "fourth" },
];

const StaggeredRow = ({ delay }: { delay: number }) => {
  const [mounted, setMounted] = useState(delay === 0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [delay]);

  if (!mounted) {
    return <div className="h-10" />;
  }

  return (
    <div className="flex items-center gap-group">
      <Skeleton className="size-10 shrink-0 rounded-avatar" />
      <div className="flex flex-1 flex-col gap-related">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </div>
      <Skeleton className="min-h-control-sm w-18" />
    </div>
  );
};

const SkeletonStaggered = () => (
  <div className="flex w-full max-w-sm flex-col gap-section">
    {rows.map((row) => (
      <StaggeredRow delay={row.delay} key={row.id} />
    ))}
  </div>
);

export default SkeletonStaggered;
