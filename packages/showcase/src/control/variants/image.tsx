import { useState } from "react";
import { Control } from "@erbium/ui/components/control";

export default function ControlImageExample() {
  const [filename, setFilename] = useState("Cover Photo");

  return (
    <Control.Group className="w-72">
      <Control.Image
        label={filename}
        options={[
          {
            label: "Warm",
            src: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32'%3E%3Crect width='32' height='32' fill='%23d4976c'/%3E%3C/svg%3E",
            value: "warm",
          },
          {
            label: "Cool",
            src: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32'%3E%3Crect width='32' height='32' fill='%236394bf'/%3E%3C/svg%3E",
            value: "cool",
          },
        ]}
        onFileChange={(file) => {
          setFilename(file?.name ?? "Cover Photo");
        }}
      />
    </Control.Group>
  );
}
