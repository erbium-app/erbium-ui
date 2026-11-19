import { Control } from "@erbium/ui/components/control";

export default function ControlToggleExample() {
  return (
    <Control.Group className="w-72">
      <Control.Toggle label="Visible" defaultChecked />
      <Control.Switch label="Reduced motion" />
    </Control.Group>
  );
}
