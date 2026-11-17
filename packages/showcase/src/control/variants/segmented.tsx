import { Control } from "@erbium/ui/components/control";

export default function ControlSegmentedExample() {
  return (
    <Control.Segmented
      label="Mode"
      defaultValue="photo"
      options={[
        { label: "Photo", value: "photo" },
        { label: "Video", value: "video" },
      ]}
      className="w-72"
    />
  );
}
