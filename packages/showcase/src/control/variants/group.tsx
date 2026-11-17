import { Control } from "@erbium/ui/components/control";

export default function ControlGroupExample() {
  return (
    <Control.Group className="w-72">
      <Control.Text label="Title" defaultValue="Japan" />
      <Control.Number label="Opacity" defaultValue={0.6} min={0} max={1} step={0.01} />
    </Control.Group>
  );
}
