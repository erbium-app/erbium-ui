import { Control } from "@erbium/ui/components/control";

const Example = () => (
  <Control.Number
    label="Quality"
    steps={[0.1, 0.5, 0.7, 1.3]}
    defaultValue={0.7}
    className="w-72"
  />
);

export default Example;
