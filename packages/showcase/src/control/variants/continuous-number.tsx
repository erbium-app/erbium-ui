import { Control } from "@erbium/ui/components/control";

const Example = () => (
  <Control.Number
    label="Position"
    mode="continuous"
    defaultValue={32.418}
    min={-100}
    max={100}
    className="w-72"
  />
);

export default Example;
