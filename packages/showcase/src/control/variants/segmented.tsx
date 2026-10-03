import { Control } from "@erbium/ui/components/control";

const Example = () => (
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

export default Example;
