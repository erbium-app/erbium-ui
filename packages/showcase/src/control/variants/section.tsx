import { Control } from "@erbium/ui/components/control";

const Example = () => (
  <Control.Group className="w-72">
    <Control.Section title="Shadow">
      <Control.Number label="Blur" defaultValue={14} min={0} max={50} />
      <Control.Boolean label="Enabled" defaultChecked />
    </Control.Section>
  </Control.Group>
);

export default Example;
