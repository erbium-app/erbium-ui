import { Control } from "@erbium/ui/components/control";

export default function ControlSelectExample() {
  return (
    <Control.Select
      label="Shape"
      defaultValue="portrait"
      options={[
        { label: "Portrait", value: "portrait" },
        { label: "Square", value: "square" },
        { label: "Landscape", value: "landscape" },
      ]}
      className="w-72"
    />
  );
}
