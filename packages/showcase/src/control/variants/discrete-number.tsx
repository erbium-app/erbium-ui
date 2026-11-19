import { Control } from "@erbium/ui/components/control";

export default function ControlDiscreteNumberExample() {
  return (
    <Control.Number
      label="Quality"
      steps={[0.1, 0.5, 0.7, 1.3]}
      defaultValue={0.7}
      marks
      className="w-72"
    />
  );
}
