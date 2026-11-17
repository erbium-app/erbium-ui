import { Control } from "@erbium/ui/components/control";

const hertz = (value: number) => (value >= 1000 ? `${value / 1000} kHz` : `${value} Hz`);

export default function ControlLogarithmicNumberExample() {
  return (
    <Control.Group className="w-72">
      <Control.Number
        label="Frequency"
        scale="log"
        min={20}
        max={20_000}
        step={1}
        defaultValue={440}
        formatValue={hertz}
      />
      <Control.Number
        label="Scale"
        scale="log"
        mode="continuous"
        min={0.01}
        max={100}
        defaultValue={1}
      />
    </Control.Group>
  );
}
