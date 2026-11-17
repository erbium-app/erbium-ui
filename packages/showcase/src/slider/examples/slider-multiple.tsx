import { Slider } from "@erbium/ui/components/slider";

export default function SliderMultipleExample() {
  return (
    <Slider defaultValue={[10, 20, 70]} max={100} step={10} className="mx-auto w-full max-w-xs" />
  );
}
