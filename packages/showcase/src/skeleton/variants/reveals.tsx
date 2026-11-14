import { useState } from "react";
import { SkeletonProvider } from "@erbium/ui/components/skeleton";
import type { SkeletonReveal } from "@erbium/ui/components/skeleton";
import { ToggleGroup, ToggleGroupItem } from "@erbium/ui/components/toggle-group";
import { SkeletonAvatar } from "../examples/skeleton-avatar";

const reveals: SkeletonReveal[] = ["smart", "together", "sequence", "sweep"];

const isReveal = (value: unknown): value is SkeletonReveal =>
  reveals.some((reveal) => reveal === value);

const Example = () => {
  const [reveal, setReveal] = useState<SkeletonReveal>("smart");

  return (
    <div className="flex w-full max-w-sm flex-col items-center gap-group">
      <ToggleGroup
        aria-label="Reveal"
        value={[reveal]}
        onValueChange={(value) => {
          const [next] = value;

          if (isReveal(next)) {
            setReveal(next);
          }
        }}
      >
        {reveals.map((value) => (
          <ToggleGroupItem key={value} value={value} className="capitalize">
            {value}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
      <SkeletonProvider reveal={reveal}>
        {/* Remounted per reveal, so each choice replays the first load. */}
        <SkeletonAvatar key={reveal} />
      </SkeletonProvider>
    </div>
  );
};

export default Example;
