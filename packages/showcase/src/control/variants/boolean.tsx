import { Control } from "@erbium/ui/components/control";

export default function ControlBooleanExample() {
  return (
    <Control.Group className="w-72">
      <Control.Boolean label="Visible" defaultChecked />
      <Control.Boolean label="Reduced motion" presentation="switch" />
    </Control.Group>
  );
}
