import { useState } from "react";
import { StepIndicator, StepIndicatorItem } from "@erbium/ui/blocks/step-indicator";

const photos = [
  { disabled: false, invalid: false, label: "Beach" },
  { disabled: false, invalid: true, label: "Harbour, upload failed" },
  { disabled: false, invalid: false, label: "Market" },
  { disabled: true, invalid: false, label: "Sunset, still processing" },
];

export default function StepIndicatorStatusExample() {
  const [photo, setPhoto] = useState(2);

  return (
    <StepIndicator variant="dots" value={photo} onValueChange={setPhoto} aria-label="Photos">
      {photos.map((item, index) => (
        <StepIndicatorItem
          key={item.label}
          index={index}
          label={item.label}
          invalid={item.invalid}
          disabled={item.disabled}
        />
      ))}
    </StepIndicator>
  );
}
