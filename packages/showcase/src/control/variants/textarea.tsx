import { Control } from "@erbium/ui/components/control";

export default function ControlTextareaExample() {
  return (
    <Control.Textarea
      label="Description"
      defaultValue="A collection of favorite places."
      className="w-72"
    />
  );
}
