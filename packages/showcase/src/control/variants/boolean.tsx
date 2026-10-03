import { Control } from "@erbium/ui/components/control";

const Example = () => (
  <Control.Group className="w-72">
    <Control.Boolean label="Visible" defaultChecked />
    <Control.Boolean label="Reduced motion" presentation="switch" />
  </Control.Group>
);

export default Example;
