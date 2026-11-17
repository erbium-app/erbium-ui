import { Control } from "@erbium/ui/components/control";

export default function ControlRowExample() {
  return (
    <Control.Row label="Version" className="w-72">
      <span className="ms-auto text-caption text-muted-foreground">1.0</span>
    </Control.Row>
  );
}
