import { defaultLatency } from "../../loading";
import { SkeletonProvider } from "@erbium/ui/components/skeleton";
import type { SkeletonReveal } from "@erbium/ui/components/skeleton";
import SkeletonDemo from "../examples/skeleton-demo";

interface PlaygroundArgs {
  latency: number;
  reveal: SkeletonReveal;
}

export const defaultProps = { latency: defaultLatency, reveal: "smart" } satisfies PlaygroundArgs;

export default function SkeletonPlaygroundExample({
  latency,
  reveal,
}: PlaygroundArgs = defaultProps) {
  return (
    <SkeletonProvider reveal={reveal}>
      <SkeletonDemo key={reveal} latency={latency} />
    </SkeletonProvider>
  );
}
