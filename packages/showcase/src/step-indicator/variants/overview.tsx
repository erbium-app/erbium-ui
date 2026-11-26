import { useState } from "react";
import { StepIndicator } from "@erbium/ui/blocks/step-indicator";

const tips = [
  "Drag files onto any page to upload them.",
  "Press Command K to search every project.",
  "Pin a project to keep it at the top.",
  "Share a link to invite anyone to a file.",
];

export default function StepIndicatorExample() {
  const [tip, setTip] = useState(0);

  return (
    <div className="flex w-72 flex-col items-center gap-4">
      <p className="min-h-12 text-center text-control text-pretty">{tips[tip]}</p>
      <StepIndicator count={tips.length} value={tip} onValueChange={setTip} aria-label="Tips" />
    </div>
  );
}
