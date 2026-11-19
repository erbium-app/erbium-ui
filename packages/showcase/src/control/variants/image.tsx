import { useState } from "react";
import { Control } from "@erbium/ui/components/control";

const swatch = (color: string) =>
  `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32'%3E%3Crect width='32' height='32' fill='%23${color}'/%3E%3C/svg%3E`;

const presets = [
  { label: "Warm", src: swatch("d4976c"), value: "warm" },
  { label: "Cool", src: swatch("6394bf"), value: "cool" },
];

export default function ControlImageExample() {
  const [filename, setFilename] = useState("Cover Photo");

  return (
    <Control.Group className="w-72">
      <Control.Row label={filename}>
        <Control.ImageSelect options={presets} />
        <Control.ImageUpload
          onFileChange={(file) => {
            setFilename(file?.name ?? "Cover Photo");
          }}
        />
      </Control.Row>
      <Control.Row label="Avatar">
        <Control.ImageUpload src={swatch("8a9a5b")}>Change</Control.ImageUpload>
      </Control.Row>
    </Control.Group>
  );
}
