import { useState } from "react";
import { StepIndicator } from "@erbium/ui/blocks/step-indicator";
import { Slider } from "@erbium/ui/components/slider";

export default function StepIndicatorProgressExample() {
  const [progress, setProgress] = useState(0.4);

  return (
    <div className="flex w-64 flex-col items-center gap-4">
      <StepIndicator count={4} value={1} progress={progress} aria-label="Upload progress" />
      <Slider
        aria-label="Progress"
        min={0}
        max={100}
        value={progress * 100}
        onValueChange={(next) => {
          setProgress(next / 100);
        }}
      />
    </div>
  );
}
