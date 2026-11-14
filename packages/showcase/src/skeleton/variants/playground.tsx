import { SkeletonProvider } from "@erbium/ui/components/skeleton";
import type { SkeletonReveal } from "@erbium/ui/components/skeleton";
import SkeletonDemo from "../examples/skeleton-demo";

interface PlaygroundArgs {
  latency: number;
  reveal: SkeletonReveal;
}

const Example = ({ latency, reveal }: PlaygroundArgs) => (
  <SkeletonProvider reveal={reveal}>
    <SkeletonDemo key={reveal} latency={latency} />
  </SkeletonProvider>
);

export default Example;
